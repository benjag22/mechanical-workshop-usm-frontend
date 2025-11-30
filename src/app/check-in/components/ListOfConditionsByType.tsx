'use client'

import { useState, useEffect } from "react";
import SelectConditionComponent from "@/app/check-in/components/SelectConditionComponent";
import api, {GroupedMechanicalCondition} from "@/api";
import { Cable, Car, Package, AlertCircle } from 'lucide-react';
import { cn } from "@/app/cn";

export type ConditionState = {
  id: number;
  partName: string;
  conditionState: string;
}

type ConditionSelectionState = {
  isIncluded: boolean;
  selectedConditionId: number | null;
}

type ConditionType = "INTERIOR" | "EXTERIOR" | "ELECTRICAL";

type Props = {
  type: ConditionType;
  onConditionsChange: (conditionIds: number[], type: ConditionType) => void;
}

const STATE_COLORS: Record<string, string> = {
  "Rayado": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Abollado": "bg-lime-100 text-lime-800 border-lime-200",
  "Trizado": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Malo": "bg-orange-100 text-orange-800 border-orange-200",
  "Roto": "bg-red-100 text-red-800 border-red-200",
  "Ausente": "bg-red-100 text-red-800 border-red-200"
};

const CONFIG = {
  INTERIOR: {
    title: "Condiciones de Interior",
    icon: Package,
    color: "blue"
  },
  EXTERIOR: {
    title: "Condiciones de Exterior",
    icon: Car,
    color: "emerald"
  },
  ELECTRICAL: {
    title: "Condiciones del Sistema Eléctrico",
    icon: Cable,
    color: "amber"
  }
};

export default function ListOfConditionsByType({ type, onConditionsChange }: Props) {
  const [currentStates, setCurrentStates] = useState<ConditionState[]>([]);
  const [selectionStates, setSelectionStates] = useState<Map<string, ConditionSelectionState>>(new Map());
  const [conditions, setConditions] = useState<GroupedMechanicalCondition[]>([]);
  const [loading, setLoading] = useState(true);

  const config = CONFIG[type];
  const Icon = config.icon;

  useEffect(() => {
    async function loadConditions() {
      try {
        setLoading(true);
        let result;

        switch (type) {
          case "INTERIOR":
            result = await api.getInteriorConditions();
            break;
          case "EXTERIOR":
            result = await api.getExteriorConditions();
            break;
          case "ELECTRICAL":
            result = await api.getElectricalConditions();
            break;
        }

        if (result.error) {
          console.error(result.error);
          setConditions([]);
        } else {
          setConditions(result.data ??  []);
        }
      } catch (error) {
        console.error(error);
        setConditions([]);
      } finally {
        setLoading(false);
      }
    }

    loadConditions();
  }, [type]);

  useEffect(() => {
    onConditionsChange(currentStates.map(state => state.id), type);
  }, [currentStates, onConditionsChange, type]);

  function handleCurrentState(newState: ConditionState | null, partName: string) {
    setCurrentStates(prev => {
      if (newState) {
        const exists = prev.find(s => s.partName === partName);
        if (exists) {
          return prev.map(s => s.partName === partName ? newState : s);
        } else {
          return [...prev, newState];
        }
      } else {
        return prev.filter(s => s.partName !== partName);
      }
    });
  }

  function handleSelectionStateChange(partName: string, isIncluded: boolean, selectedConditionId: number | null) {
    setSelectionStates(prev => {
      const newMap = new Map(prev);
      newMap.set(partName, { isIncluded, selectedConditionId });
      return newMap;
    });
  }

  function getSelectionState(partName: string): ConditionSelectionState {
    return selectionStates. get(partName) || { isIncluded: false, selectedConditionId: null };
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <div className="text-slate-400">Cargando condiciones...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto">
      <div className={cn(
        "bg-gradient-to-r rounded-t-lg p-4 sm:p-5 mb-4 sm:mb-6 border-b-2",
        type === "INTERIOR" ? "from-blue-600/20 to-blue-500/10 border-blue-500": "",
        type === "EXTERIOR" ? "from-emerald-600/20 to-emerald-500/10 border-emerald-500": "",
        type === "ELECTRICAL" ? "from-amber-600/20 to-amber-500/10 border-amber-500": ""
      )}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 sm:p-3 rounded-lg",
              type === "INTERIOR" ? "bg-blue-500/20": "",
              type === "EXTERIOR" ? "bg-emerald-500/20": "",
              type === "ELECTRICAL" ? "bg-amber-500/20": ""
            )}>
              <Icon size={24} className={cn(
                type === "INTERIOR" ?  "text-blue-400" : "",
                type === "EXTERIOR" ? "text-emerald-400" : "",
                type === "ELECTRICAL" ? "text-amber-400" :""
              )} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-200">
                {config. title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                {conditions. length} partes disponibles
              </p>
            </div>
          </div>

          <div className={cn(
            "px-3 sm:px-4 py-1. 5 sm:py-2 rounded-full text-sm font-medium",
            type === "INTERIOR" ? "bg-blue-500/20 text-blue-400" : "",
            type === "EXTERIOR" ? "bg-emerald-500/20 text-emerald-400" : "",
            type === "ELECTRICAL" ? "bg-amber-500/20 text-amber-400" : ""
          )}>
            {currentStates.length} seleccionadas
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
          {conditions.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700/50">
              <Icon size={48} className="mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">No hay condiciones disponibles</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-3">
              {conditions.map((condition) => (
                <SelectConditionComponent
                  key={condition.partName}
                  condition={condition}
                  onStateChange={handleCurrentState}
                  onSelectionStateChange={handleSelectionStateChange}
                  initialState={getSelectionState(condition. partName)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 xl:w-96">
          <div className="lg:sticky lg:top-4">
            <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-slate-700/50">
              <h3 className="text-base sm:text-lg font-semibold text-slate-200 mb-3 sm:mb-4 flex items-center gap-2">
                <AlertCircle size={18} className="sm:w-5 sm:h-5" />
                Condiciones Registradas
                <span className={cn(
                  "ml-auto text-xs px-2. 5 py-1 rounded-full font-medium",
                  type === "INTERIOR" ? "bg-blue-500/20 text-blue-400" : "",
                  type === "EXTERIOR" ? "bg-emerald-500/20 text-emerald-400" : "",
                  type === "ELECTRICAL" ? "bg-amber-500/20 text-amber-400" : ""
                )}>
                  {currentStates.length}
                </span>
              </h3>

              {currentStates.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
                    <Icon size={24} className="sm:w-7 sm:h-7 text-slate-500" />
                  </div>
                  <p className="text-slate-400 text-sm sm:text-base font-medium">
                    No hay condiciones seleccionadas
                  </p>
                  <p className="text-slate-500 text-xs sm:text-sm mt-2">
                    Marca las condiciones del vehículo
                  </p>
                </div>
              ) : (
                <div className="space-y-2. 5 sm:space-y-3 max-h-[400px] sm:max-h-96 overflow-y-auto custom-scrollbar pr-2">
                  {currentStates. map((state) => (
                    <div
                      key={`${state.partName}-${state.id}`}
                      className="bg-slate-700/50 rounded-lg p-3 sm:p-4 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-slate-200 font-medium text-sm sm:text-base mb-2 truncate">
                            {state. partName}
                          </h4>
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-md text-xs sm:text-sm font-medium border",
                            STATE_COLORS[state.conditionState] || "bg-gray-100 text-gray-800 border-gray-200"
                          )}>
                            {state.conditionState}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentStates.length > 0 && (
                <div className="mt-4 pt-3 sm:pt-4 border-t border-slate-700/50">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400">
                    <span>Total registrado</span>
                    <span className="font-semibold text-slate-300">{currentStates.length} condiciones</span>
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
