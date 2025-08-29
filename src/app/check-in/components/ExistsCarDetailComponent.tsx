"use client"

import {cn} from "@/app/cn";
import React, {useState} from "react";
import {Car, Gauge, Fuel, FileText, ArrowLeft} from "lucide-react";

type ExistsCar = {
    id: number;
    patent: string;
    VIN: string;
    modelName: string;
    brandName: string;
    year: number;
    type: string;
}

type CarDetail = {
    reason: string;
    mileage: number;
    fuelLevel: "Full" | "3/4" | "1/2" | "1/4" | "Low"
}

type ExistsCarDetailComponentProps = {
    car: ExistsCar;
    onBackAction: () => void;
}

export default function ExistsCarDetailComponent({ car, onBackAction }: ExistsCarDetailComponentProps){
    const [carDetail, setCarDetail] = useState<CarDetail>({
        reason: '',
        mileage: 0,
        fuelLevel: "Full"
    });

    const handleInputChange = (field: keyof CarDetail, value: string | number) => {
        setCarDetail(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ ...car, ...carDetail });
    };

    return(
        <div className="w-full h-full flex flex-col">
            <div className="flex items-center mb-2 lg:mb-3">
                <button
                    onClick={onBackAction}
                    className={cn(
                        "flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 mr-3",
                        "bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-all duration-200"
                    )}
                >
                    <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </button>
                <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-white">Vehículo Registrado</h2>
                    <p className="text-gray-400 text-sm lg:text-base">Complete los detalles de ingreso</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col space-y-2 lg:space-y-3">
                <div className={cn(
                    "bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/50 p-2 lg:p-4"
                )}>
                    <h3 className="text-lg lg:text-xl font-semibold text-white mb-3 lg:mb-4 flex items-center">
                        <Car className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                        Información del Vehículo
                    </h3>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 text-sm lg:text-base">
                        <div>
                            <p className="text-gray-400">Patente</p>
                            <p className="text-white font-semibold">{car.patent}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Marca</p>
                            <p className="text-white font-semibold">{car.brandName}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Modelo</p>
                            <p className="text-white font-semibold">{car.modelName}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Año</p>
                            <p className="text-white font-semibold">{car.year}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Tipo</p>
                            <p className="text-white font-semibold">{car.type}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">VIN</p>
                            <p className="text-white font-semibold text-xs lg:text-sm">{car.VIN}</p>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                    <div className="space-y-1 lg:space-y-2">
                        <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                            <FileText className="w-3 h-3 lg:w-4 lg:h-4" />
                            Motivo de Ingreso
                        </label>
                        <textarea
                            value={carDetail.reason}
                            onChange={(e) => handleInputChange('reason', e.target.value)}
                            className={cn(
                                "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                                "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base",
                                "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                                "transition-all duration-200 hover:border-gray-600/50",
                                "resize-none h-16 lg:h-20"
                            )}
                            placeholder="Describa el motivo del ingreso del vehículo"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        <div className="space-y-1 lg:space-y-2">
                            <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Gauge className="w-3 h-3 lg:w-4 lg:h-4" />
                                Kilometraje
                            </label>
                            <input
                                type="number"
                                value={carDetail.mileage || ''}
                                onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
                                className={cn(
                                    "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                                    "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                                    "transition-all duration-200 hover:border-gray-600/50"
                                )}
                                placeholder="Ej: 45000"
                                required
                            />
                        </div>

                        <div className="space-y-1 lg:space-y-2">
                            <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Fuel className="w-3 h-3 lg:w-4 lg:h-4" />
                                Nivel de Combustible
                            </label>
                            <select
                                value={carDetail.fuelLevel}
                                onChange={(e) => handleInputChange('fuelLevel', e.target.value)}
                                className={cn(
                                    "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                                    "text-white backdrop-blur-sm text-sm lg:text-base",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                                    "transition-all duration-200 hover:border-gray-600/50"
                                )}
                                required
                            >
                                <option value="Full">Lleno</option>
                                <option value="3/4">3/4</option>
                                <option value="1/2">1/2</option>
                                <option value="1/4">1/4</option>
                                <option value="Low">Reserva</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
