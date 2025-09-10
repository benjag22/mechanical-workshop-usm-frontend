'use client'
import { use, useState } from 'react'
import { cn } from "@/app/cn"
import DrawableCanvas from "@/app/components/DrawableCanvas";

type GenerateByIdCheckInPageProps = {
    id: number;
}

export default function GenerateByIdCheckIn({params}: {params: Promise<GenerateByIdCheckInPageProps>}) {
    const {id} = use(params)
    const [drawingData, setDrawingData] = useState<string>('')
    const vehicleImageUrl = "/bg-conditions.jpg"

    const handleDrawingChange = (imageData: string) => {
        setDrawingData(imageData)
    }

    const saveWorkOrder = () => {
        console.log('Datos del dibujo:', drawingData)
    }

    return (
        <div className={cn("w-full min-h-screen bg-slate-700 p-4")}>
            <div className="max-w-6xl mx-auto">
                <h1 className="text-white text-2xl font-bold mb-6 text-center">
                    Orden de Trabajo - Check In ID: {id}
                </h1>

                <div className="bg-white rounded-lg p-6 shadow-xl">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">
                        Marque las áreas de inspección en el vehículo
                    </h2>

                    <DrawableCanvas
                        backgroundImage={vehicleImageUrl}
                        width={1000}
                        height={600}
                        strokeColor="#ef4444"
                        strokeWidth={3}
                        onDrawingChange={handleDrawingChange}
                        className="mb-6"
                    />

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={saveWorkOrder}
                            className={cn(
                                "px-6 py-3 bg-blue-600 text-white rounded-md",
                                "hover:bg-blue-700 transition-colors duration-200",
                                "font-medium text-sm"
                            )}
                        >
                            Guardar Orden de Trabajo
                        </button>

                        <button
                            className={cn(
                                "px-6 py-3 bg-gray-600 text-white rounded-md",
                                "hover:bg-gray-700 transition-colors duration-200",
                                "font-medium text-sm"
                            )}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
