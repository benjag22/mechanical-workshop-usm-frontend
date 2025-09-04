import "./SelectConditionComponent"
import SelectConditionComponent from "@/app/check-in/components/SelectConditionComponent";
import {cn} from "@/app/cn";
import {useState} from "react";
import {Cable, Car, Package, AlertCircle} from 'lucide-react';

type ConditionCategory = "interior" | "exterior" | "electrical";

export type ConditionState = {
    name: string;
    state: string;
}

const STATE_COLORS: Record<string, string> = {
    "Rayado": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "Abollado": "bg-lime-100 text-lime-800 border-lime-200",
    "Trizado": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Malo": "bg-orange-100 text-orange-800 border-orange-200",
    "Roto": "bg-red-100 text-red-800 border-red-200",
    "Ausente": "bg-red-100 text-red-800 border-red-200"
};

export default function ListOfConditionsComponent() {
    const [activeTab, setActiveTab] = useState<ConditionCategory>("interior");
    const [currentStates, setCurrentStates] = useState<ConditionState[]>([])

    function handleCurrentState(newState: ConditionState | null, name: string) {
        setCurrentStates(prev => {
            if (newState) {
                const exists = prev.find(s => s.name === name);
                if (exists) {
                    return prev.map(s => s.name === name ? newState : s);
                } else {
                    return [...prev, newState];
                }
            } else {
                return prev.filter(s => s.name !== name);
            }
        });
    }

    const conditionsData = {
        interior: {
            title: "Interior",
            conditions: [
                "Encendedor",
                "Radio",
                "Luz Interior",
                "Espejo Interior",
                "Pisos de goma",
                "Cinturón de seguridad",
                "Aire acondicionado",
                "Cierre centralizado",
                "Manillas y botonera",
                "Tapiceria",
                "Accesorios Electrónico"
            ]
        },
        exterior: {
            title: "Exterior",
            conditions: [
                "Luneta delantera",
                "Luneta Trasera",
                "Luneta lateral",
                "Limpia parabrisas",
                "Retrovisores exteriores",
                "Neumàticos delanteros",
                "Neumàticos traseros",
                "Luminaria delantera",
                "Luminaria trasera",
                "Antena",
                "Llantas",
                "Molduras",
                "Emblemas",
                "Manillas y Botoneras",
                "Tapón de Combustibles",
                "Tapa de Combustible"
            ]
        },
        electrical: {
            title: "Sistema Eléctrico",
            conditions: [
                "Control de niveles de motor",
                "Control de niveles accesarios",
                "Estado fluido liquido de frenos",
                "Estado del sistema de carga",
                "Luces indicadoras de falla"
            ]
        }
    };

    const getTabStyles = (tab: ConditionCategory) => {
        const baseStyles = "flex flex-row items-center justify-center space-x-2 flex-1 px-4 py-3 text-sm font-medium transition-all duration-300 cursor-pointer relative";
        const activeStyles = activeTab === tab
            ? "text-blue-400 bg-slate-700/50 border-b-2 border-blue-400"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30";

        return cn(baseStyles, activeStyles);
    };

    const getIcon = (tab: ConditionCategory) => {
        const iconSize = 18;
        if (tab === "electrical") {
            return <Cable size={iconSize}/>
        } else if (tab === "interior") {
            return <Package size={iconSize}/>
        } else {
            return <Car size={iconSize}/>
        }
    }

    return (
        <div className="flex flex-col w-full max-w-7xl mx-auto">
            <div className="flex bg-slate-800/50 rounded-lg mb-6 p-1 backdrop-blur-sm">
                <button
                    className={cn(getTabStyles("interior"))}
                    onClick={() => setActiveTab("interior")}
                >
                    {getIcon("interior")}
                    <span className="hidden sm:inline">{conditionsData.interior.title}</span>
                </button>
                <button
                    className={getTabStyles("exterior")}
                    onClick={() => setActiveTab("exterior")}
                >
                    {getIcon("exterior")}
                    <span className="hidden sm:inline">{conditionsData.exterior.title}</span>
                </button>
                <button
                    className={getTabStyles("electrical")}
                    onClick={() => setActiveTab("electrical")}
                >
                    {getIcon("electrical")}
                    <span className="hidden sm:inline">{conditionsData.electrical.title}</span>
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                        {getIcon(activeTab)}
                        {conditionsData[activeTab].title}
                    </h3>
                    <div className="flex flex-col space-y-3">
                        {conditionsData[activeTab].conditions.map((condition, index) => (
                            <SelectConditionComponent
                                key={`${activeTab}-${index}`}
                                name={condition}
                                onStateChange={handleCurrentState}
                            />
                        ))}
                    </div>
                </div>

                <div className="w-full lg:w-80 xl:w-96">
                    <div className="sticky top-4">
                        <div className="bg-slate-800/70 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
                            <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                                <AlertCircle size={18} />
                                Condiciones Registradas
                                <span className="ml-auto bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                                    {currentStates.length}
                                </span>
                            </h3>

                            {currentStates.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
                                        <AlertCircle size={24} className="text-slate-500" />
                                    </div>
                                    <p className="text-slate-400 text-sm">
                                        No hay condiciones seleccionadas
                                    </p>
                                    <p className="text-slate-500 text-xs mt-1">
                                        Marca las condiciones del vehículo
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                                    {currentStates.map((state, index) => (
                                        <div
                                            key={`${state.name}-${index}`}
                                            className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/30 hover:border-slate-500/50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="text-slate-200 font-medium text-sm mb-1 truncate">
                                                        {state.name}
                                                    </h4>
                                                    <span className={cn(
                                                        "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border",
                                                        STATE_COLORS[state.state] || "bg-gray-100 text-gray-800 border-gray-200"
                                                    )}>
                                                        {state.state}
                                                    </span>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {currentStates.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-slate-700/50">
                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                        <span>Total registrado</span>
                                        <span className="font-medium">{currentStates.length} condiciones</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
