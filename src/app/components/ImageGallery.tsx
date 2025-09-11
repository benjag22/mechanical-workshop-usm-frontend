import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { cn } from "@/app/cn"

export type ImageFile = {
    id: string
    file: File
    preview: string
    name: string
    size: number
}

type ImageGalleryProps = {
    onImagesChange?: (images: ImageFile[]) => void
    maxImages?: number
    acceptedFormats?: string[]
    maxFileSize?: number
}

export default function ImageGallery({
                                         onImagesChange,
                                         maxImages = 10,
                                         acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
                                         maxFileSize = 5
                                     }: ImageGalleryProps) {
    const [images, setImages] = useState<ImageFile[]>([])
    const [dragActive, setDragActive] = useState(false)
    const [isCapturing, setIsCapturing] = useState(false)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamRef = useRef<MediaStream | null>(null)

    const generateId = () => Math.random().toString(36)?.substr(2, 9)

    const createImageFile = useCallback((file: File): Promise<ImageFile> => {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                resolve({
                    id: generateId(),
                    file,
                    preview: e.target?.result as string,
                    name: file.name,
                    size: file.size
                })
            }
            reader.readAsDataURL(file)
        })
    }, [])

    const addImages = useCallback(async (files: File[]) => {
        const validFiles = files.filter(file => {
            const isValidFormat = acceptedFormats.includes(file.type)
            const isValidSize = file.size <= maxFileSize * 1024 * 1024
            return isValidFormat && isValidSize
        })

        if (validFiles.length === 0) return

        const newImageFiles = await Promise.all(
            validFiles.slice(0, maxImages - images.length).map(createImageFile)
        )

        const updatedImages = [...images, ...newImageFiles]
        setImages(updatedImages)
        onImagesChange?.(updatedImages)
    }, [images, acceptedFormats, maxFileSize, maxImages, createImageFile, onImagesChange])

    const removeImage = useCallback((id: string) => {
        const updatedImages = images.filter(img => img.id !== id)
        setImages(updatedImages)
        onImagesChange?.(updatedImages)

        const imageToRemove = images.find(img => img.id === id)
        if (imageToRemove) {
            URL.revokeObjectURL(imageToRemove.preview)
        }
    }, [images, onImagesChange])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        addImages(files)
    }

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault()
        setDragActive(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setDragActive(false)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragActive(false)
        const files = Array.from(e.dataTransfer.files)
        addImages(files)
    }

    const startCamera = async () => {
        try {
            setIsCapturing(true)
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            })

            if (videoRef.current) {
                videoRef.current.srcObject = stream
                streamRef.current = stream
            }
        } catch (error) {
            console.error('Error accessing camera:', error)
            setIsCapturing(false)
        }
    }

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
        }
        setIsCapturing(false)
    }

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return

        const video = videoRef.current
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        if (ctx) {
            ctx.drawImage(video, 0, 0)
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' })
                    addImages([file])
                    stopCamera()
                }
            }, 'image/jpeg', 0.8)
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <div className="w-full space-y-6">
            <div
                className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
                    dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-300 hover:border-slate-400",
                    images.length >= maxImages ? "opacity-50 pointer-events-none" : ""
                )}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>

                    <div>
                        <p className="text-lg font-medium text-slate-300 mb-2">
                            Arrastra imágenes aquí o selecciona archivos
                        </p>
                        <p className="text-sm text-slate-500 mb-4">
                            Máximo {maxImages} imágenes • {formatFileSize(maxFileSize * 1024 * 1024)} por archivo
                        </p>

                        <div className="flex gap-3 justify-center">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                disabled={images.length >= maxImages}
                            >
                                📁 Seleccionar archivos
                            </button>

                            <button
                                type="button"
                                onClick={startCamera}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                disabled={images.length >= maxImages}
                            >
                                📷 Tomar foto
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isCapturing && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Tomar foto</h3>
                                <button
                                    onClick={stopCamera}
                                    className="text-slate-500 hover:text-slate-700"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="relative">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full rounded-lg"
                                />
                                <canvas ref={canvasRef} className="hidden" />
                            </div>

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={capturePhoto}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    📸 Capturar
                                </button>
                                <button
                                    onClick={stopCamera}
                                    className="px-8 py-3 bg-slate-400 text-white rounded-lg hover:bg-slate-500 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {images.length > 0 && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-slate-700">
                            Imágenes seleccionadas ({images.length}/{maxImages})
                        </h3>
                        <button
                            onClick={() => {
                                images.forEach(img => URL.revokeObjectURL(img.preview))
                                setImages([])
                                onImagesChange?.([])
                            }}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                            Eliminar todas
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image) => (
                            <div key={image.id} className="relative group">
                                <div className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                                    <Image
                                        src={image.preview}
                                        alt={image.name}
                                        width={300}
                                        height={300}
                                        className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
                                        onClick={() => setSelectedImage(image.preview)}
                                        unoptimized={true}
                                    />
                                </div>

                                <button
                                    onClick={() => removeImage(image.id)}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                >
                                    ✕
                                </button>

                                <div className="mt-2">
                                    <p className="text-xs text-slate-600 truncate" title={image.name}>
                                        {image.name}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {formatFileSize(image.size)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative max-w-4xl max-h-[90vh] mx-4">
                        <Image
                            src={selectedImage}
                            alt="Preview"
                            width={800}
                            height={600}
                            className="max-w-full max-h-full object-contain rounded-lg"
                            unoptimized={true}
                        />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={acceptedFormats.join(',')}
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    )
}
