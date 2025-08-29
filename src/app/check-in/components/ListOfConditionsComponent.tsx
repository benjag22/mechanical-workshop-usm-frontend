import "./SelectConditionComponent"
import SelectConditionComponent from "@/app/check-in/components/SelectConditionComponent";
import {cn} from "@/app/cn";
import { useState } from "react";

type ConditionCategory = "interior" | "exterior" | "electrical";

export default function ListOfConditionsComponent() {
    const [activeTab, setActiveTab] = useState<ConditionCategory>("interior");

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
        const baseStyles = "px-6 py-3 font-medium text-sm transition-all duration-200 border-b-2 cursor-pointer";
        const activeStyles = activeTab === tab
            ? "text-blue-600 border-blue-600 bg-blue-50"
            : "text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-300";

        return cn(baseStyles, activeStyles);
    };

    return (
        <div className={cn("flex flex-col w-full")}>
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={getTabStyles("interior")}
                    onClick={() => setActiveTab("interior")}
                >
                    {conditionsData.interior.title}
                </button>
                <button
                    className={getTabStyles("exterior")}
                    onClick={() => setActiveTab("exterior")}
                >
                    {conditionsData.exterior.title}
                </button>
                <button
                    className={getTabStyles("electrical")}
                    onClick={() => setActiveTab("electrical")}
                >
                    {conditionsData.electrical.title}
                </button>
            </div>

            <div className="flex flex-col space-y-4">
                {conditionsData[activeTab].conditions.map((condition, index) => (
                    <SelectConditionComponent
                        key={`${activeTab}-${index}`}
                        name={condition}
                    />
                ))}
            </div>
        </div>
    );
}
