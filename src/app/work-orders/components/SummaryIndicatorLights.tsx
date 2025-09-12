"use client";

import { useState } from "react";
import IndicatorLights, { lights, LightData } from "@/app/work-orders/components/IndicatorLights";

export default function SummaryIndicatorLights() {
    const [lightsData, setLightsData] = useState<LightData[]>(() =>
        lights.map(light => ({
            ...light,
            status: {
                present: false,
                functioning: false,
                evaluated: false
            }
        }))
    );

    const handleLightChange = (index: number, field: 'present' | 'functioning', value: boolean) => {
        setLightsData(prev => prev.map((light, i) =>
            i === index
                ? {
                    ...light,
                    status: {
                        ...light.status,
                        [field]: value,
                        evaluated: field === 'present' ? true : light.status.evaluated
                    }
                }
                : light
        ));
    };

    const stats = {
        total: lightsData.length,
        present: lightsData.filter(light => light.status.present).length,
        functioning: lightsData.filter(light => light.status.present && light.status.functioning).length,
        notFunctioning: lightsData.filter(light => light.status.present && !light.status.functioning).length,
        notPresent: lightsData.filter(light => !light.status.present && light.status.evaluated).length,
        notEvaluated: lightsData.filter(light => !light.status.evaluated).length
    };

    return (
        <div className="min-h-screen w-full bg-slate-800">
            <div className="max-w-7xl mx-auto p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-100 mb-2">
                        Luces Testigo del Tablero
                    </h1>
                    <p className="text-slate-400">
                        Evalúa la presencia y funcionamiento de cada luz testigo
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
                                <h2 className="text-xl font-semibold text-slate-100 mb-6">
                                    Resumen
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-600/30">
                                        <span className="text-slate-300">Total luces:</span>
                                        <span className="text-slate-100 font-semibold">{stats.total}</span>
                                    </div>

                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-slate-300">Presentes:</span>
                                        <span className="text-blue-400 font-semibold">{stats.present}</span>
                                    </div>

                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-slate-300">Funcionando:</span>
                                        <span className="text-emerald-400 font-semibold">{stats.functioning}</span>
                                    </div>

                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-slate-300">Con fallas:</span>
                                        <span className="text-red-400 font-semibold">{stats.notFunctioning}</span>
                                    </div>

                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-slate-300">No presentes:</span>
                                        <span className="text-amber-400 font-semibold">{stats.notPresent}</span>
                                    </div>

                                    <div className="flex justify-between items-center py-2 border-t border-slate-600/30 pt-4">
                                        <span className="text-slate-300">Sin evaluar:</span>
                                        <span className="text-slate-400 font-semibold">{stats.notEvaluated}</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div className="flex justify-between text-sm text-slate-300 mb-2">
                                        <span>Progreso</span>
                                        <span>{Math.round(((stats.total - stats.notEvaluated) / stats.total) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-600 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${((stats.total - stats.notEvaluated) / stats.total) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                        <span className="text-sm text-slate-300">Funcionando</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <span className="text-sm text-slate-300">Con fallas</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                                        <span className="text-sm text-slate-300">No presente</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                                        <span className="text-sm text-slate-300">Sin evaluar</span>
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
