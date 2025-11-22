'use client'

import { useState, useEffect } from "react";
import IndicatorLights from "./IndicatorLights";
import api, { GetImage, CreateWorkOrderHasDashboardLightRequest } from "@/api";

type LightData = GetImage & {
  present: boolean;
  isFunctional: boolean;
};

type Props = {
  onLightsChange: (lights: CreateWorkOrderHasDashboardLightRequest[]) => void;
}

async function getLightsData(): Promise<GetImage[]> {
  try {
    const response = await api.getImageCategory();
    return response.data ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default function SummaryIndicatorLights({ onLightsChange }: Props) {
  const [lightsData, setLightsData] = useState<LightData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLights() {
      setIsLoading(true);
      const lights = await getLightsData();
      setLightsData(lights.map(light => ({
        ...light,
        present: false,
        isFunctional: false
      })));
      setIsLoading(false);
    }
    loadLights();
  }, []);

  useEffect(() => {
    if (onLightsChange) {
      const workOrderLights: CreateWorkOrderHasDashboardLightRequest[] = lightsData.map(light => ({
        dashboardLightId: light.id,
        present: light.present,
        isFunctional: light.isFunctional
      }));
      onLightsChange(workOrderLights);
    }
  }, [lightsData, onLightsChange]);

  const handleLightChange = (index: number, field: 'present' | 'isFunctional', value: boolean) => {
    setLightsData(prev => prev.map((light, i) =>
      i === index
        ? { ...light, [field]: value }
        : light
    ));
  };

  const stats = {
    total: lightsData.length,
    evaluated: lightsData.filter(light => light.present).length,
    present: lightsData.filter(light => light.present).length,
    functioning: lightsData.filter(light => light.present && light.isFunctional).length,
    notFunctioning: lightsData.filter(light => light.present && !light.isFunctional).length,
    notPresent: lightsData.filter(light => !light.present).length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-slate-800 rounded-md flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-slate-400">Cargando luces testigo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-800 rounded-md">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2 flex items-center gap-3">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Luces Testigo del Tablero
          </h1>
          <p className="text-slate-400">
            Evalúa la presencia y funcionamiento de cada luz testigo del vehículo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
              <IndicatorLights
                lightsData={lightsData}
                onLightChange={handleLightChange}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-0">
              <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/30">
                <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Resumen
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-600/30">
                    <span className="text-slate-300">Total luces:</span>
                    <span className="text-slate-100 font-semibold text-lg">{stats.total}</span>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-300">Presentes:</span>
                    <span className="text-blue-400 font-semibold text-lg">{stats.present}</span>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-300">Funcionando:</span>
                    <span className="text-emerald-400 font-semibold text-lg">{stats.functioning}</span>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-300">Con fallas:</span>
                    <span className="text-red-400 font-semibold text-lg">{stats.notFunctioning}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-t border-slate-600/30">
                    <span className="text-slate-300">No presentes:</span>
                    <span className="text-slate-500 font-semibold">{stats.notPresent}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="text-xs text-slate-400 mb-2">Progreso de evaluación</div>
                  <div className="w-full bg-slate-600/50 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(stats.evaluated / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-slate-400 text-center">
                    {stats.evaluated} de {stats.total} evaluadas
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-600/30 space-y-2">
                  <div className="text-xs text-slate-400 mb-3">Leyenda</div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-slate-300">Presente</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-slate-300">Funcionando</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-slate-300">Con fallas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                    <span className="text-sm text-slate-300">No presente</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
