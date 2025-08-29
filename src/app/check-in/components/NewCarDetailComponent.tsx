"use client"

import {cn} from "@/app/cn";
import React, {useState} from "react";
import {Car, Hash, Calendar, Gauge, Fuel, FileText, ArrowLeft, Tag} from "lucide-react";

type newCar = {
    patent: string;
    VIN: string;
    modelName?: string;
    modelId?: number;
    brandName?: string;
    brandId?: number;
    year: number;
    type: string;
}

type CarDetail = newCar & {
    reason: string;
    mileage: number;
    fuelLevel: "Full" | "3/4" | "1/2" | "1/4" | "Low"
}

type NewCarDetailComponentProps = {
    prefilledPatent?: string | null;
    onBackAction: () => void;
}

export default function NewCarDetailComponent({ prefilledPatent, onBackAction }: NewCarDetailComponentProps){
    const [carDetail, setCarDetail] = useState<CarDetail>({
        patent: prefilledPatent || '',
        VIN: '',
        modelName: '',
        brandName: '',
        year: new Date().getFullYear(),
        type: '',
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
        console.log('New car detail:', carDetail);
    };

    const vehicleTypes = [
        "Sedán", "Hatchback", "SUV", "Pick-up", "Camioneta", "Convertible",
        "Coupe", "Station Wagon", "Minivan", "Crossover"
    ];

    return(
        <div className="w-full h-full flex flex-col">
            <div className="flex items-center mb-2 lg:mb-4">
                <button
                    onClick={onBackAction}
                    className={cn(
                        "flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 mr-4",
                        "bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-all duration-200"
                    )}
                >
                    <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </button>
                <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-white">Nuevo Vehículo</h2>
                    <p className="text-gray-400 text-sm lg:text-base">Complete la información del vehículo</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        <div className="space-y-1 lg:space-y-2">
                            <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Tag className="w-3 h-3 lg:w-4 lg:h-4" />
                                Patente
                            </label>
                            <input
                                type="text"
                                value={carDetail.patent}
                                onChange={(e) => handleInputChange('patent', e.target.value.toUpperCase())}
                                className={cn(
                                    "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                                    "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base uppercase",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                                    "transition-all duration-200 hover:border-gray-600/50"
                                )}
                                placeholder="BCDF12"
                                maxLength={6}
                                required
                            />
                        </div>

                        <div className="space-y-1 lg:space-y-2">
                            <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Hash className="w-3 h-3 lg:w-4 lg:h-4" />
                                VIN
                            </label>
                            <input
                                type="text"
                                value={carDetail.VIN}
                                onChange={(e) => handleInputChange('VIN', e.target.value.toUpperCase())}
                                className={cn(
                                    "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                                    "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base uppercase",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                                    "transition-all duration-200 hover:border-gray-600/50"
                                )}
                                placeholder="1HGBH41JXMN109186"
                                maxLength={17}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        <div className="space-y-1 lg:space-y-2">
                            <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Car className="w-3 h-3 lg:w-4 lg:h-4" />
                                Marca
                            </label>
                            <input
                                type="text"
                                value={carDetail.brandName || ''}
                                onChange={(e) => handleInputChange('brandName', e.target.value)}
                                className={cn(
                                    "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                                    "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                                    "transition-all duration-200 hover:border-gray-600/50"
                                )}
                                placeholder="Toyota, Honda, Ford..."
                                required
                            />
                        </div>

                        <div className="space-y-1 lg:space-y-2">
                            <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Car className="w-3 h-3 lg:w-4 lg:h-4" />
                                Modelo
                            </label>
                            <input
                                type="text"
                                value={carDetail.modelName || ''}
                                onChange={(e) => handleInputChange('modelName', e.target.value)}
                                className={cn(
                                    "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                                    "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                                    "transition-all duration-200 hover:border-gray-600/50"
                                )}
                                placeholder="Corolla, Civic, Focus..."
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        <div className="space-y-1 lg:space-y-2">
                            <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
                                Año
                            </label>
                            <input
                                type="number"
                                value={carDetail.year}
                                onChange={(e) => handleInputChange('year', parseInt(e.target.value) || new Date().getFullYear())}
                                className={cn(
                                    "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                                    "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                                    "transition-all duration-200 hover:border-gray-600/50"
                                )}
                                min={1900}
                                max={new Date().getFullYear() + 1}
                                required
                            />
                        </div>

                        <div className="space-y-1 lg:space-y-2">
                            <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Car className="w-3 h-3 lg:w-4 lg:h-4" />
                                Tipo de Vehículo
                            </label>
                            <select
                                value={carDetail.type}
                                onChange={(e) => handleInputChange('type', e.target.value)}
                                className={cn(
                                    "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                                    "text-white backdrop-blur-sm text-sm lg:text-base",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                                    "transition-all duration-200 hover:border-gray-600/50"
                                )}
                                required
                            >
                                <option value="">Seleccione el tipo</option>
                                {vehicleTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

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
