import {cn} from "@/app/cn";
import {Check} from "lucide-react";
import {useState} from "react";
import {ConditionState} from "@/app/check-in/components/ListOfConditionsComponent";

type Props = {
    name: string;
    onStateChange: (newState: ConditionState | null, name:string) => void;
}

type State = "Rayado" | "Abollado" | "Trizado" | "Malo" | "Roto" | "Ausente";

const CONDITIONS: State[] = [
    "Rayado",
    "Abollado",
    "Trizado",
    "Malo",
    "Roto",
    "Ausente"
];

const CONDITION_STYLES: Record<State, string> = {
    "Rayado": "bg-emerald-400 text-black border-emerald-600 hover:bg-emerald-500",
    "Abollado": "bg-lime-300 text-black border-lime-500 hover:bg-lime-400",
    "Trizado": "bg-yellow-300 text-black border-yellow-500 hover:bg-yellow-400",
    "Malo": "bg-orange-400 text-black border-orange-600 hover:bg-orange-500",
    "Roto": "bg-orange-600 text-white border-orange-800 hover:bg-orange-700",
    "Ausente": "bg-red-600 text-white border-red-800 hover:bg-red-700"
};

export default function SelectConditionComponent({name, onStateChange}: Props) {
    const [selectedState, setSelectedState] = useState<State | null>(null);
    const [isIncluded, setIsIncluded] = useState<boolean>(false);

    const handleStateSelect = (state: State) => {
        // Auto-enable the component if not already enabled
        if (!isIncluded) {
            setIsIncluded(true);
        }
        setSelectedState(state);
        onStateChange({name:name, state:state }, name);
    };

    const handleIncludeToggle = () => {
        const newIncluded = !isIncluded;
        setIsIncluded(newIncluded);
        if (!newIncluded) {
            setSelectedState(null);
            onStateChange(null, name);
        }
    };

    const getItemStyles = (state: State, index: number) => {
        const baseStyles = "flex-1 cursor-pointer p-3 h-12 flex items-center justify-center border-2 transition-all duration-300 ease-in-out font-medium text-xs lg:text-sm";

        const positionStyles = cn(
            index === 0 ? "border-l-2" : "border-l-0"
        );

        const stateStyles = CONDITION_STYLES[state];

        const selectedStyles = selectedState === state
            ? "scale-105 shadow-lg ring-2 ring-black z-10"
            : "hover:scale-102 hover:shadow-md";

        return cn(baseStyles, positionStyles, stateStyles, selectedStyles);
    };

    return (
        <div className="flex flex-col w-full">
            <div
                onClick={handleIncludeToggle}
                className={cn(
                    "w-full flex items-center space-x-4 p-3 border-1 transition-all duration-200 cursor-pointer group",
                    "border-gray-400 bg-gray-700 hover:bg-gray-600 hover:border-gray-300",
                    isIncluded ? "border-gray-300 bg-gray-600 rounded-t-lg" : "rounded-lg "
                )}
            >
                <div className="relative">
                    <input
                        type="checkbox"
                        id={`checkbox-${name}`}
                        checked={isIncluded}
                        onChange={() => {
                        }}
                        className="sr-only"
                    />
                    <div
                        className={cn(
                            "w-5 h-5 rounded border-1 flex items-center justify-center transition-all duration-200",
                            isIncluded
                                ? "bg-blue-600 border-blue-600 shadow-sm"
                                : "bg-white border-gray-300 group-hover:border-green-800"
                        )}
                    >
                        {isIncluded && (
                            <Check
                                size={14}
                                className="text-white"
                                strokeWidth={3}
                            />
                        )}
                    </div>
                </div>
                <label
                    className={cn(
                        "font-medium cursor-pointer transition-all duration-200 select-none flex-1",
                        isIncluded
                            ? "text-gray-100"
                            : "text-gray-400 group-hover:text-gray-200"
                    )}
                >
                    {name}
                </label>
                <div className={cn(
                    "w-2 h-2 rounded-full transition-all duration-200",
                    isIncluded ? "bg-green-500" : "bg-gray-400"
                )}/>
            </div>

            <div className={cn(
                "w-full border-x-2 border-gray-200 rounded-b-lg overflow-hidden transition-all duration-200"
            )}>
                {isIncluded && (<div className="flex w-full">
                    {CONDITIONS.map((state, index) => (
                        <button
                            key={state}
                            type="button"
                            className={cn(getItemStyles(state, index),
                                selectedState === state ? "appearance-none" : ""
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleStateSelect(state);

                            }}
                            disabled={!isIncluded}
                            aria-pressed={selectedState === state}
                            aria-label={`Seleccionar estado ${state}`}
                        >
                            {selectedState === state ? (
                                <Check size={20} className="animate-in fade-in-50 zoom-in-95 duration-200"/>
                            ) : (
                                <span className="truncate">{state}</span>
                            )}
                        </button>
                    ))}
                </div>)}
            </div>
        </div>
    );
}
