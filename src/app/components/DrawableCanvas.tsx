'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { cn } from "@/app/cn"

type DrawableCanvasProps = {
  backgroundImage?: string
  width?: number
  height?: number
  strokeColor?: string
  strokeWidth?: number
  backgroundColor?: string
  className?: string
  onSignatureChange?: (file: File | null) => void
}

export default function DrawableCanvas({
                                         backgroundImage,
                                         width = 800,
                                         height = 600,
                                         strokeColor = '#000000',
                                         strokeWidth = 2,
                                         backgroundColor = '#ffffff',
                                         className,
                                         onSignatureChange
                                       }: DrawableCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })
  const [canvasSize, setCanvasSize] = useState({ width, height })
  const [isEmpty, setIsEmpty] = useState(true)

  const getEventPos = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      }
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      }
    }
  }, [])

  const canvasToFile = useCallback(async (format: 'png' | 'jpeg' = 'png'): Promise<File | null> => {
    const canvas = canvasRef.current
    if (!canvas || isEmpty) return null

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File(
            [blob],
            `signature-${Date.now()}.${format}`,
            { type: `image/${format}` }
          )
          resolve(file)
        } else {
          resolve(null)
        }
      }, `image/${format}`, 0.95)
    })
  }, [isEmpty])

  const updateSignature = useCallback(async () => {
    if (isEmpty) {
      onSignatureChange?.(null)
      return
    }

    const file = await canvasToFile('png')
    onSignatureChange?.(file)
  }, [isEmpty, canvasToFile, onSignatureChange])

  const draw = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    ctx.strokeStyle = strokeColor
    ctx.lineWidth = strokeWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    ctx.moveTo(lastPos.x, lastPos.y)
    ctx.lineTo(x, y)
    ctx.stroke()

    setLastPos({ x, y })

    if (isEmpty) {
      setIsEmpty(false)
    }
  }, [lastPos, strokeColor, strokeWidth, isEmpty])

  const handleMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault()
    setIsDrawing(true)
    const pos = getEventPos(e)
    setLastPos(pos)
  }, [getEventPos])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault()
    if (!isDrawing) return
    const pos = getEventPos(e)
    draw(pos.x, pos.y)
  }, [isDrawing, getEventPos, draw])

  const handleMouseUp = useCallback(async (e: MouseEvent) => {
    e.preventDefault()
    if (isDrawing) {
      setIsDrawing(false)
      await updateSignature()
    }
  }, [isDrawing, updateSignature])

  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault()
    setIsDrawing(true)
    const pos = getEventPos(e)
    setLastPos(pos)
  }, [getEventPos])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault()
    if (!isDrawing) return
    const pos = getEventPos(e)
    draw(pos.x, pos.y)
  }, [isDrawing, getEventPos, draw])

  const handleTouchEnd = useCallback(async (e: TouchEvent) => {
    e.preventDefault()
    if (isDrawing) {
      setIsDrawing(false)
      await updateSignature()
    }
  }, [isDrawing, updateSignature])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (backgroundImage) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
      img.src = backgroundImage
    } else {
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    setIsEmpty(true)
    onSignatureChange?.(null)
  }, [backgroundImage, backgroundColor, onSignatureChange])

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const container = canvas.parentElement
    if (!container) return

    const containerWidth = container.clientWidth
    const aspectRatio = height / width
    const newWidth = Math.min(containerWidth, width)
    const newHeight = newWidth * aspectRatio

    setCanvasSize({ width: newWidth, height: newHeight })
  }, [width, height])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    if (backgroundImage) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
      img.src = backgroundImage
    } else {
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [backgroundImage, backgroundColor, canvasSize])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mouseleave', handleMouseUp)

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mouseleave', handleMouseUp)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd])

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [resizeCanvas])

  return (
    <div className={cn("w-full flex flex-col items-center space-y-4", className ?? "")}>
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg font-semibold flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Firma del Cliente
          </h3>
          <button
            onClick={clearCanvas}
            disabled={isEmpty}
            className={cn(
              "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
              "flex items-center gap-2",
              isEmpty
                ? "bg-slate-500 text-slate-300 cursor-not-allowed opacity-50"
                : "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl"
            )}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Limpiar
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-slate-300">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className={cn(
              "border-2 border-dashed border-slate-300 rounded-lg cursor-crosshair",
              "touch-none select-none w-full h-auto",
              "hover:border-blue-400 transition-colors"
            )}
          />
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Dibuja tu firma usando el mouse o tu dedo en pantallas táctiles</span>
          </div>

          {!isEmpty && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm animate-in fade-in-50 duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd" />
              </svg>
              <span className="font-medium">Firma capturada correctamente</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
