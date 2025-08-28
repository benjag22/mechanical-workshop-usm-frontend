"use client"

import {cn} from "@/app/cn";
import {useState} from "react";
import {User, Mail, MapPin, Phone} from "lucide-react";

type ClientInfo = {
    firstName: string;
    lastName: string;
    emailAddress: string;
    address: string;
    cellphoneNumber: string;
}

export default function ClientInfoDetailComponent(){
    const [clientInfo, setClientInfo] = useState<ClientInfo>({
        firstName: '',
        lastName: '',
        emailAddress: '',
        address: '',
        cellphoneNumber: ''
    });

    const handleInputChange = (field: keyof ClientInfo, value: string) => {
        setClientInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Client info:', clientInfo);
    };

    return(
        <div className="w-full h-full flex flex-col">
            <div className="text-center mb-4 lg:mb-6">
                <h2 className="text-xl lg:text-2xl font-bold text-white mb-1 lg:mb-2">Información del Cliente</h2>
                <p className="text-gray-400 text-sm lg:text-base">Complete los datos del cliente para continuar</p>
            </div>

            <div className="flex-1 flex items-center">
                <form onSubmit={handleSubmit} className="w-full space-y-4 lg:space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        <div className="space-y-1 lg:space-y-2">
                            <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                                <User className="w-3 h-3 lg:w-4 lg:h-4" />
                                Nombre
                            </label>
                            <input
                                type="text"
                                value={clientInfo.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                className={cn(
                                    "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                                    "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                                    "transition-all duration-200 hover:border-gray-600/50"
                                )}
                                placeholder="Ingrese el nombre"
                                required
                            />
                        </div>

                        <div className="space-y-1 lg:space-y-2">
                            <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                                <User className="w-3 h-3 lg:w-4 lg:h-4" />
                                Apellido
                            </label>
                            <input
                                type="text"
                                value={clientInfo.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                className={cn(
                                    "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                                    "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                                    "transition-all duration-200 hover:border-gray-600/50"
                                )}
                                placeholder="Ingrese el apellido"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        <div className="space-y-1 lg:space-y-2">
                            <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Mail className="w-3 h-3 lg:w-4 lg:h-4" />
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                value={clientInfo.emailAddress}
                                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                                className={cn(
                                    "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                                    "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                                    "transition-all duration-200 hover:border-gray-600/50"
                                )}
                                placeholder="cliente@email.com"
                                required
                            />
                        </div>

                        <div className="space-y-1 lg:space-y-2">
                            <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Phone className="w-3 h-3 lg:w-4 lg:h-4" />
                                Número de Teléfono
                            </label>
                            <input
                                type="tel"
                                value={clientInfo.cellphoneNumber}
                                onChange={(e) => handleInputChange('cellphoneNumber', e.target.value)}
                                className={cn(
                                    "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                                    "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                                    "transition-all duration-200 hover:border-gray-600/50"
                                )}
                                placeholder="+56 9 12345678"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-1 lg:space-y-2">
                        <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                            <MapPin className="w-3 h-3 lg:w-4 lg:h-4" />
                            Dirección
                        </label>
                        <textarea
                            value={clientInfo.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className={cn(
                                "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                                "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base",
                                "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                                "transition-all duration-200 hover:border-gray-600/50",
                                "resize-none h-16 lg:h-24"
                            )}
                            placeholder="Ingrese la dirección completa"
                            required
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}
