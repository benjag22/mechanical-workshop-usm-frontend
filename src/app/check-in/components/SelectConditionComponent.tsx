import {cn} from "@/app/cn";
import {Check} from "lucide-react";
import {useState, useEffect} from "react";
import {ConditionState} from "@/app/check-in/components/ListOfConditionsByType";
import {GroupedMechanicalCondition} from "@/api";

type Props = {
  condition: GroupedMechanicalCondition;
  onStateChange: (newState: ConditionState | null, partName: string) => void;
  onSelectionStateChange: (partName: string, isIncluded: boolean, selectedConditionId: number | null) => void;
  initialState: {
    isIncluded: boolean;
    selectedConditionId: number | null;
  };
}

const CONDITION_STYLES: Record<string, string> = {
  "Rayado": "bg-emerald-400 text-black border-emerald-600 hover:bg-emerald-500",
  "Abollado": "bg-lime-300 text-black border-lime-500 hover:bg-lime-400",
  "Trizado": "bg-yellow-300 text-black border-yellow-500 hover:bg-yellow-400",
  "Malo": "bg-orange-400 text-black border-orange-600 hover:bg-orange-500",
  "Roto": "bg-orange-600 text-white border-orange-800 hover:bg-orange-700",
  "Ausente": "bg-red-600 text-white border-red-800 hover:bg-red-700"
};

export default function SelectConditionComponent({condition, onStateChange, onSelectionStateChange, initialState}: Props) {
  const [selectedConditionId, setSelectedConditionId] = useState<number | null>(initialState.selectedConditionId);
  const [isIncluded, setIsIncluded] = useState<boolean>(initialState.isIncluded);

  useEffect(() => {
    setIsIncluded(initialState.isIncluded);
    setSelectedConditionId(initialState.selectedConditionId);
  }, [initialState]);

  const handleConditionSelect = (conditionId: number, conditionState: string) => {
    if (! isIncluded) {
      setIsIncluded(true);
    }
    setSelectedConditionId(conditionId);

    onStateChange({
      id: conditionId,
      partName: condition.partName,
      conditionState: conditionState
    }, condition.partName);

    onSelectionStateChange(condition.partName, true, conditionId);
  };

  const handleIncludeToggle = () => {
    const newIncluded = !isIncluded;
    setIsIncluded(newIncluded);
    if (! newIncluded) {
      setSelectedConditionId(null);
      onStateChange(null, condition.partName);
      onSelectionStateChange(condition. partName, false, null);
    } else {
      onSelectionStateChange(condition.partName, true, selectedConditionId);
    }
  };

  const getItemStyles = (conditionId: number, conditionState: string, index: number) => {
    const baseStyles = "flex-1 cursor-pointer p-2 sm:p-3 h-12 sm:h-14 flex items-center justify-center border-2 transition-all duration-300 ease-in-out font-medium text-xs sm:text-sm";

    const positionStyles = cn(
      index === 0 ? "border-l-2" : "border-l-0"
    );

    const stateStyles = CONDITION_STYLES[conditionState] || "bg-gray-400 text-black border-gray-600 hover:bg-gray-500";

    const selectedStyles = selectedConditionId === conditionId
      ? "scale-105 shadow-lg ring-2 ring-black z-10"
      : "hover:scale-102 hover:shadow-md";

    return cn(baseStyles, positionStyles, stateStyles, selectedStyles);
  };

  return (
    <div className="flex flex-col w-full">
      <div
        onClick={handleIncludeToggle}
        className={cn(
          "w-full flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 border-2 transition-all duration-200 cursor-pointer group",
          "border-gray-400 bg-gray-700 hover:bg-gray-600 hover:border-gray-300",
          isIncluded ? "border-gray-300 bg-gray-600 rounded-t-lg" : "rounded-lg"
        )}
      >
        <div className="relative flex-shrink-0">
          <input
            type="checkbox"
            id={`checkbox-${condition.partName}`}
            checked={isIncluded}
            onChange={() => {}}
            className="sr-only"
          />
          <div
            className={cn(
              "w-5 h-5 sm:w-6 sm:h-6 rounded border-2 flex items-center justify-center transition-all duration-200",
              isIncluded
                ? "bg-blue-600 border-blue-600 shadow-sm"
                : "bg-white border-gray-300 group-hover:border-gray-100"
            )}
          >
            {isIncluded && (
              <Check
                size={16}
                className="text-white sm:w-4 sm:h-4"
                strokeWidth={3}
              />
            )}
          </div>
        </div>
        <label
          className={cn(
            "font-medium cursor-pointer transition-all duration-200 select-none flex-1 text-sm sm:text-base",
            isIncluded
              ? "text-gray-100"
              : "text-gray-400 group-hover:text-gray-200"
          )}
        >
          {condition.partName}
        </label>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className={cn(
            "w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-200",
            isIncluded ? "bg-green-500 shadow-sm shadow-green-500/50" : "bg-gray-400"
          )}/>
          {isIncluded && (
            <span className="text-xs text-slate-400 hidden sm:inline">
              {condition.conditions.length} estados
            </span>
          )}
        </div>
      </div>

      <div className={cn(
        "w-full border-x-2 border-gray-200 rounded-b-lg overflow-hidden transition-all duration-200"
      )}>
        {isIncluded && (
          <div className="flex w-full flex-wrap sm:flex-nowrap">
            {condition.conditions.map((singleCondition, index) => (
              <button
                key={singleCondition.id}
                type="button"
                className={cn(
                  getItemStyles(singleCondition. id, singleCondition.conditionState, index),
                  selectedConditionId === singleCondition.id ?  "appearance-none" : "",
                  "min-w-[33.333%] sm:min-w-0"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleConditionSelect(singleCondition.id, singleCondition.conditionState);
                }}
                disabled={! isIncluded}
                aria-pressed={selectedConditionId === singleCondition.id}
                aria-label={`Seleccionar estado ${singleCondition.conditionState}`}
              >
                {selectedConditionId === singleCondition.id ?  (
                  <Check
                    size={20}
                    className="animate-in fade-in-50 zoom-in-95 duration-200 sm:w-5 sm:h-5"
                  />
                ) : (
                  <span className="truncate px-1">{singleCondition.conditionState}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
