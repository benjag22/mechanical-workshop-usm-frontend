'use client'

import {cn} from "@/app/cn";
import api, {GetWorkOrder} from "@/api"
import PreviewWorkOrder from "@/app/work-orders/components/PreviewWorkOrder";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import ErrorDisplay from "@/app/components/ErrorDisplay";
import {useEffect, useState} from "react";
import {parseApiError, ParsedError} from "@/util/errorParser";

type FilterType = 'all' | 'in-progress' | 'completed';

async function getAllWorkOrders(
  set: (data: GetWorkOrder[]) => void,
  setError: (error: ParsedError) => void
): Promise<void> {
  try {
    const response = await api.getAllWorkOrders();

    if (response.data) {
      set(response.data);
    } else if (response.error) {
      const parsedError = parseApiError(response.error, "Error al cargar las órdenes de trabajo");
      setError(parsedError);
    }
  } catch (err) {
    const parsedError = parseApiError(err, "Error inesperado al cargar las órdenes de trabajo");
    setError(parsedError);
  }
}

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<GetWorkOrder[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ParsedError | null>(null);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');

  useEffect(() => {
    setIsLoading(true);
    getAllWorkOrders(setWorkOrders, setError)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <LoadingSpinner
        title="Cargando órdenes de trabajo..."
        subtitle="Por favor espere"
      />
    );
  }

  const filteredWorkOrders = workOrders?.filter(wo => {
    if (currentFilter === 'in-progress') return !wo.isCompleted;
    if (currentFilter === 'completed') return wo.isCompleted;
    return true;
  }) || [];

  const totalCount = workOrders?.length || 0;
  const inProgressCount = workOrders?.filter(wo => !wo.isCompleted).length || 0;
  const completedCount = workOrders?.filter(wo => wo.isCompleted).length || 0;

  return (
    <>
      <ErrorDisplay
        error={error}
        onClose={() => setError(null)}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Órdenes de Trabajo
            </h1>
            <p className="text-slate-400">
              Gestiona y visualiza todas las órdenes de trabajo del taller
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total de Órdenes</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {totalCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">En Progreso</p>
                  <p className="text-3xl font-bold text-amber-400 mt-1">
                    {inProgressCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Completadas</p>
                  <p className="text-3xl font-bold text-green-400 mt-1">
                    {completedCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/50 shadow-lg mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="text-slate-300 font-medium">Filtros:</span>
              </div>

              <button
                onClick={() => setCurrentFilter('all')}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  currentFilter === 'all'
                    ? "bg-blue-600 text-white"
                    : "bg-slate-600/50 text-slate-300 hover:bg-slate-600"
                )}
              >
                Todas ({totalCount})
              </button>

              <button
                onClick={() => setCurrentFilter('in-progress')}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  currentFilter === 'in-progress'
                    ? "bg-blue-600 text-white"
                    : "bg-slate-600/50 text-slate-300 hover:bg-slate-600"
                )}
              >
                En Progreso ({inProgressCount})
              </button>

              <button
                onClick={() => setCurrentFilter('completed')}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  currentFilter === 'completed'
                    ? "bg-blue-600 text-white"
                    : "bg-slate-600/50 text-slate-300 hover:bg-slate-600"
                )}
              >
                Completadas ({completedCount})
              </button>
            </div>
          </div>

          {totalCount === 0 ? (
            <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-12 border border-slate-600/30 text-center">
              <svg className="w-20 h-20 mx-auto text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">
                No hay órdenes de trabajo
              </h3>
              <p className="text-slate-400 mb-6">
                Comienza creando tu primera orden de trabajo
              </p>
              <a
                href="/pending-check-in"
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium",
                  "bg-blue-600 hover:bg-blue-700 text-white",
                  "transition-all duration-200 transform hover:scale-105",
                  "shadow-lg hover:shadow-xl"
                )}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Crear Orden de Trabajo
              </a>
            </div>
          ) : filteredWorkOrders.length === 0 ? (
            <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-12 border border-slate-600/30 text-center">
              <svg className="w-20 h-20 mx-auto text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">
                No hay órdenes con este filtro
              </h3>
              <p className="text-slate-400">
                Intenta con otro filtro para ver más resultados
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkOrders.map((workOrder) => (
                  <PreviewWorkOrder
                    key={workOrder.id}
                    {...workOrder}
                  />
                ))}
              </div>

              {filteredWorkOrders.length > 9 && (
                <div className="mt-8 flex justify-center">
                  <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl border border-slate-600/50 shadow-lg p-2 flex items-center gap-2">
                    <button className={cn(
                      "p-2 rounded-lg transition-all",
                      "bg-slate-600 hover:bg-slate-500 text-white"
                    )}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {[1, 2, 3].map((page) => (
                      <button
                        key={page}
                        className={cn(
                          "px-4 py-2 rounded-lg font-medium transition-all",
                          page === 1
                            ? "bg-blue-600 text-white"
                            : "bg-slate-600/50 text-slate-300 hover:bg-slate-600"
                        )}
                      >
                        {page}
                      </button>
                    ))}

                    <button className={cn(
                      "p-2 rounded-lg transition-all",
                      "bg-slate-600 hover:bg-slate-500 text-white"
                    )}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
