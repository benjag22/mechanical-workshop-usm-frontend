import { useRef, useEffect, useState, useCallback } from 'react'
import { cn } from "@/app/cn"

type DrawableCanvasProps = {
    backgroundImage?: string
    width?: number
    height?: number
    strokeColor?: string
    strokeWidth?: number
    className?: string
    onDrawingChange?: (imageData: string) => void
}

export default function DrawableCanvas({
                                           backgroundImage,
                                           width = 800,
                                           height = 600,
                                           strokeColor = '#ef4444',
                                           strokeWidth = 3,
                                           className,
                                           onDrawingChange
                                       }: DrawableCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 })
    const [canvasSize, setCanvasSize] = useState({ width, height })

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

        if (onDrawingChange) {
            onDrawingChange(canvas.toDataURL())
        }
    }, [lastPos, strokeColor, strokeWidth, onDrawingChange])

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

    const handleMouseUp = useCallback((e: MouseEvent) => {
        e.preventDefault()
        setIsDrawing(false)
    }, [])

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

    const handleTouchEnd = useCallback((e: TouchEvent) => {
        e.preventDefault()
        setIsDrawing(false)
    }, [])

    const clearCanvas = useCallback(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!ctx || !canvas) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (backgroundImage) {
            const img = new Image()
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                if (onDrawingChange) {
                    onDrawingChange(canvas.toDataURL())
                }
            }
            img.src = backgroundImage
        } else if (onDrawingChange) {
            onDrawingChange(canvas.toDataURL())
        }
    }, [backgroundImage, onDrawingChange])

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
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!ctx || !canvas || !backgroundImage) return

        const img = new Image()
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        }
        img.src = backgroundImage
    }, [backgroundImage, canvasSize])

    useEffect(() => {
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)
        return () => window.removeEventListener('resize', resizeCanvas)
    }, [resizeCanvas])

    return (
        <div className={cn("w-full flex flex-col items-center space-y-4", className ?? "")}>
            <div className="w-full max-w-4xl">
                <canvas
                    ref={canvasRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    className={cn(
                        "border border-gray-300 rounded-lg shadow-lg cursor-crosshair",
                        "touch-none select-none bg-white w-full h-auto"
                    )}
                />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
                <button
                    onClick={clearCanvas}
                    className={cn(
                        "px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600",
                        "transition-colors duration-200 text-sm font-medium"
                    )}
                >
                    Limpiar
                </button>
            </div>
        </div>
    )
}
