import CheckEngine from "../../../assets/icons/check-engine-light.svg";
import OilLight from "../../../assets/icons/oil-light.svg";
import BatteryLight from "../../../assets/icons/battery-light.svg";
import CoolantTemperature from "../../../assets/icons/coolant-temperature.svg";
import ABS from "../../../assets/icons/abs.svg";
import HandBrakeWarning from "../../../assets/icons/hand-brake-warning.svg";
import AirbagLight from "../../../assets/icons/airbag-warning.svg";
import SeaBeltLight from "../../../assets/icons/seat-belt-warning.svg";
import PowerSteering from "../../../assets/icons/power-steering-warning-light.svg";
import TPMS from "../../../assets/icons/TPMS_warning-light.svg";
import LowFuel from "../../../assets/icons/low-fuel-warning-light.svg";
import HighBeam from "../../../assets/icons/high-beam-warning-light.svg";
import LowBeam from "../../../assets/icons/low-beam-warning-light.svg";
import OpenDoor from "../../../assets/icons/door-ajar-warning-light.svg";
import HoodOpen from "../../../assets/icons/hood-poppet-warning-light.svg";
import TrunkOpen from "../../../assets/icons/trunk-open-warning-light.svg";
import ESP from "../../../assets/icons/electronic-stability-control-warning-light.svg";
import DPF from "../../../assets/icons/diesel-particulate-filter-warning.svg";
import Flashing from "../../../assets/icons/flashing-warning-light.svg";
import Image from "next/image";
import {cn} from "@/app/cn";

type Light = {
    name: string;
    icon?: string;
};

export type LightStatus = {
    present: boolean;
    functioning: boolean;
    evaluated: boolean;
};

export type LightData = Light & {
    status: LightStatus;
};

const lights: Light[] = [
    {name: "Check engine (motor)", icon: CheckEngine},
    {name: "Aceite (presión de aceite)", icon: OilLight},
    {name: "Batería / alternador", icon: BatteryLight},
    {name: "Temperatura refrigerante", icon: CoolantTemperature},
    {name: "ABS", icon: ABS},
    {name: "Freno de mano / freno", icon: HandBrakeWarning},
    {name: "Airbag", icon: AirbagLight},
    {name: "Cinturón de seguridad", icon: SeaBeltLight},
    {name: "Dirección asistida", icon: PowerSteering},
    {name: "Presión neumáticos (TPMS)", icon: TPMS},
    {name: "Combustible bajo", icon: LowFuel},
    {name: "Luces altas", icon: HighBeam},
    {name: "Luces bajas", icon: LowBeam},
    {name: "Intermitentes", icon: Flashing},
    {name: "Puerta abierta", icon: OpenDoor},
    {name: "Capó abierto", icon: HoodOpen},
    {name: "Maletero abierto", icon: TrunkOpen},
    {name: "Sistema de tracción (ESP/ESC)", icon: ESP},
    {name: "Filtro de partículas / emisiones (diésel)", icon: DPF},
];

interface IndicatorLightsProps {
    lightsData: LightData[];
    onLightChange: (index: number, field: 'present' | 'functioning', value: boolean) => void;
}

export default function IndicatorLights({lightsData, onLightChange}: IndicatorLightsProps) {

    const handlePresentChange = (index: number, present: boolean) => {
        onLightChange(index, 'present', present);
        // Si no está presente, también marcar como no funcionando
        if (!present) {
            onLightChange(index, 'functioning', false);
        }
    };

    return (
        <div className="space-y-4 pr-4">
            {lightsData.map((light, index) => (
                <div key={light.name} className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/30">
                    {/* Header con icono y nombre */}
                    <div className="flex items-center gap-4 mb-6">
                        {light.icon && (
                            <div className="flex-shrink-0">
                                <Image
                                    src={light.icon}
                                    alt={light.name}
                                    width={80}
                                    height={80}
                                    className="filter brightness-0 invert opacity-80"
                                />
                            </div>
                        )}
                        <span className="text-slate-200 text-lg font-medium leading-tight">
                            {light.name}
                        </span>
                    </div>

                    {/* Selector de presencia */}
                    <div className="mb-4">
                        <p className="text-slate-300 text-sm mb-3">¿Está presente?</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handlePresentChange(index, true)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    light.status.present
                                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                                        : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                                )}
                            >
                                Sí
                            </button>
                            <button
                                onClick={() => handlePresentChange(index, false)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    !light.status.present
                                        ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                                        : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                                )}
                            >
                                No
                            </button>
                        </div>
                    </div>

                    {/* Selector de funcionamiento - solo si está presente */}
                    {light.status.present && (
                        <div>
                            <p className="text-slate-300 text-sm mb-3">¿Funciona correctamente?</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => onLightChange(index, 'functioning', true)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                        light.status.functioning
                                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                                            : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                                    )}
                                >
                                    Sí
                                </button>
                                <button
                                    onClick={() => onLightChange(index, 'functioning', false)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                        !light.status.functioning
                                            ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                                            : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                                    )}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Indicador de no evaluado */}
                    {!light.status.present && (
                        <div className="flex items-center gap-2 mt-4">
                            <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                            <span className="text-slate-400 text-sm">Sin evaluar</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// Exportar luces para uso en otros componentes
export {lights};
