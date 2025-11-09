import { cn } from "@/app/cn";
import { useState } from "react";

type Service = {
    name: string;
    hours: number;
}

export default function SelectServices() {
    const [currentServices, setCurrentServices] = useState<Service[]>([]);
    const [addServiceState, setAddServiceState] = useState(false);
    const [serviceName, setServiceName] = useState("");
    const [serviceHours, setServiceHours] = useState("");

    const addService = () => {
        if (serviceName.trim() && serviceHours.trim()) {
            const newService: Service = {
                name: serviceName.trim(),
                hours: +(serviceHours)
            };

            setCurrentServices(prev => [...prev, newService]);
            setServiceName("");
            setServiceHours("");
            setAddServiceState(false);
        }
    };

    const removeService = (index: number) => {
        setCurrentServices(prev => prev.filter((_, i) => i !== index));
    };

    const cancelAdd = () => {
        setServiceName("");
        setServiceHours("");
        setAddServiceState(false);
    };

    const formatHours = (hours: number) => {
        if (hours === 1) {
            return `${hours} hora`;
        }
        return `${hours} horas`;
    };

    const getTotalHours = () => {
        return currentServices.reduce((total, service) => total + service.hours, 0);
    };

    return (
        <div className="w-full space-y-6">
            <div className="text-center">
                <h2 className="text-slate-100 text-xl font-semibold mb-2">
                    Servicios a Realizar
                </h2>
                <p className="text-slate-300 text-sm">
                    Agrega los servicios necesarios y estima las horas de trabajo
                </p>
            </div>

            {addServiceState ? (
                <div className="bg-slate-600/30 backdrop-blur-sm rounded-xl p-6 border border-slate-500/30">
                    <h3 className="text-slate-100 text-lg font-medium mb-4">Agregar Nuevo Servicio</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-slate-200 text-sm font-medium mb-2">
                                Nombre del Servicio
                            </label>
                            <input
                                type="text"
                                value={serviceName}
                                onChange={(e) => setServiceName(e.target.value)}
                                placeholder="Escribe el nombre del servicio..."
                                className={cn(
                                    "w-full px-4 py-3 rounded-lg border-2 transition-all duration-200",
                                    "bg-slate-100 border-slate-300 text-slate-800",
                                    "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                                    "placeholder:text-slate-400"
                                )}
                            />
                        </div>

                        <div>
                            <label className="block text-slate-200 text-sm font-medium mb-2">
                                Horas de Trabajo Estimadas
                            </label>
                            <input
                                type="number"
                                value={serviceHours}
                                onChange={(e) => setServiceHours(e.target.value)}
                                placeholder="0"
                                min="0"
                                step="0.5"
                                className={cn(
                                    "w-full px-4 py-3 rounded-lg border-2 transition-all duration-200",
                                    "bg-slate-100 border-slate-300 text-slate-800",
                                    "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                                    "placeholder:text-slate-400"
                                )}
                            />
                            <p className="text-slate-400 text-xs mt-1">
                                Puedes usar decimales (ej: 1.5 para 1 hora y 30 minutos)
                            </p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={addService}
                                disabled={!serviceName.trim() || !serviceHours.trim()}
                                className={cn(
                                    "flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200",
                                    "bg-emerald-600 text-white shadow-lg hover:bg-emerald-700",
                                    "disabled:bg-slate-400 disabled:cursor-not-allowed",
                                    "hover:shadow-xl transform hover:scale-[1.005]"
                                )}
                            >
                                ✓ Agregar Servicio
                            </button>
                            <button
                                onClick={cancelAdd}
                                className={cn(
                                    "px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200",
                                    "bg-red-500 text-white shadow-lg hover:bg-red-600",
                                    "hover:shadow-xl transform hover:scale-[1.02]"
                                )}
                            >
                                ✕ Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setAddServiceState(true)}
                    className={cn(
                        "w-full flex items-center justify-center gap-3 p-6 rounded-xl",
                        "border-2 border-dashed border-emerald-400/50 bg-emerald-500/10",
                        "text-emerald-100 hover:text-white transition-all duration-200",
                        "hover:bg-emerald-500/20 hover:border-emerald-400",
                        "transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    )}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-lg font-medium">Agregar Servicio</span>
                </button>
            )}

            {currentServices.length > 0 && (
                <div className="bg-slate-600/30 backdrop-blur-sm rounded-xl p-6 border border-slate-500/30">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-slate-100 text-lg font-semibold">
                            Servicios Seleccionados ({currentServices.length})
                        </h3>
                        <button
                            onClick={() => setCurrentServices([])}
                            className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                        >
                            Limpiar todo
                        </button>
                    </div>

                    <div className="space-y-3">
                        {currentServices.map((service, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-lg",
                                    "bg-slate-700/50 border border-slate-600/50",
                                    "hover:bg-slate-700/70 transition-all duration-200",
                                    "group"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-semibold">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-slate-100 font-medium">{service.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-amber-400 font-semibold">{formatHours(service.hours)}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeService(index)}
                                    className={cn(
                                        "p-2 rounded-lg text-red-400 hover:text-red-300",
                                        "hover:bg-red-500/10 transition-all duration-200",
                                        "opacity-0 group-hover:opacity-100"
                                    )}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-600/50">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-300 text-lg font-medium">Tiempo Total:</span>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-amber-400 text-xl font-bold">
                                    {formatHours(getTotalHours())}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
