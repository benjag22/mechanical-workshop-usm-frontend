'use client'

import {cn} from "@/app/cn";
import api, {GetWorkOrder} from "@/api"
import PreviewWorkOrder from "@/app/work-orders/components/PreviewWorkOrder";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import ErrorDisplay from "@/app/components/ErrorDisplay";
import {useEffect, useState} from "react";
import {parseApiError, ParsedError} from "@/util/errorParser";
import { Search, X } from "lucide-react";

type FilterType = 'all' | 'in-progress' | 'completed';

async function getAllWorkOrders(
  set: (data: GetWorkOrder[]) => void,
  setError: (error: ParsedError) => void,
  licensePlate: string
): Promise<void> {
  try {
    const response = licensePlate
      ? await api.getAllWorkOrders({ query: { licensePlate } })
      : await api.getAllWorkOrders();
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ParsedError | null>(null);

  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [pendingSearch, setPendingSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  console.log(workOrders, searchTerm)
  useEffect(() => {
    setIsLoading(true);
    getAllWorkOrders(setWorkOrders, setError, searchTerm)
      .finally(() => setIsLoading(false));

  }, [searchTerm]);

  const handleClearSearch = () => {
    setPendingSearch("");
    setSearchTerm("");
    setWorkOrders([]);
  };

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
      <ErrorDisplay error={error} onClose={() => setError(null)} />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-6 sm:py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Órdenes de Trabajo
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Gestiona y visualiza todas las órdenes de trabajo del taller
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">

            <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-slate-600/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs sm:text-sm">Total de Órdenes</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white mt-1">
                    {totalCount}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-slate-600/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs sm:text-sm">En Progreso</p>
                  <p className="text-2xl sm:text-3xl font-bold text-amber-400 mt-1">
                    {inProgressCount}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-slate-600/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs sm:text-sm">Completadas</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-400 mt-1">
                    {completedCount}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

          </div>

          <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-slate-600/50 shadow-lg mb-4 sm:mb-6">
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Buscar por Patente
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={pendingSearch}
                onChange={(e) => setPendingSearch(e.target.value.toUpperCase())}
                placeholder="Ej: ABCD12, ABCD-12, BBBB22..."
                className={cn(
                  "w-full pl-11 pr-20 py-3 sm:py-3.5",
                  "bg-slate-800/50 border border-slate-600/50 rounded-lg",
                  "text-white placeholder-slate-500 text-base sm:text-lg",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                  "transition-all duration-200 hover:border-slate-500/50",
                  "uppercase"
                )}
              />

              <button
                onClick={() => setSearchTerm(pendingSearch.trim())}
                className="absolute inset-y-0 right-10 pr-3 flex items-center hover:scale-110 transition-transform"
              >
                <Search className="h-5 w-5 text-blue-400 hover:text-blue-300" />
              </button>
              {pendingSearch && (
                <button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
                >
                  <X className="h-5 w-5 text-slate-400 hover:text-slate-200" />
                </button>
              )}
            </div>

            {searchTerm && (
              <p className="mt-2 text-sm text-slate-400">
                Mostrando {filteredWorkOrders.length} resultado{filteredWorkOrders.length !== 1 ? 's' : ''} para <span className="text-blue-400 font-medium">{searchTerm}</span>
              </p>
            )}
          </div>

          <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/50 shadow-lg mb-6">
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="text-slate-300 font-medium text-sm sm:text-base">Filtros:</span>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setCurrentFilter('all')}
                  className={cn(
                    "px-4 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all",
                    "hover:scale-105 active:scale-95",
                    currentFilter === 'all'
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-slate-600/50 text-slate-300 hover:bg-slate-600"
                  )}
                >
                  Todas ({totalCount})
                </button>

                <button
                  onClick={() => setCurrentFilter('in-progress')}
                  className={cn(
                    "px-4 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all",
                    "hover:scale-105 active:scale-95",
                    currentFilter === 'in-progress'
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-slate-600/50 text-slate-300 hover:bg-slate-600"
                  )}
                >
                  En Progreso ({inProgressCount})
                </button>

                <button
                  onClick={() => setCurrentFilter('completed')}
                  className={cn(
                    "px-4 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all",
                    "hover:scale-105 active:scale-95",
                    currentFilter === 'completed'
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-slate-600/50 text-slate-300 hover:bg-slate-600"
                  )}
                >
                  Completadas ({completedCount})
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <LoadingSpinner
              title="Cargando órdenes de trabajo..."
              subtitle="Por favor espere"
            />
          ) : totalCount === 0 ? (
            <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-8 sm:p-12 border border-slate-600/30 text-center">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-300 mb-2">
                {searchTerm ? 'No se encontraron resultados' : 'No hay órdenes de trabajo'}
              </h3>
              {searchTerm ? (
                <button
                  onClick={handleClearSearch}
                  className={cn(
                    "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm",
                    "bg-slate-600 hover:bg-slate-500 text-white",
                    "transition-all duration-200 transform hover:scale-105"
                  )}
                >
                  <X className="w-4 h-4" />
                  Limpiar búsqueda
                </button>
              ) : null}
            </div>
          ) : filteredWorkOrders.length === 0 ? (
            <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-8 sm:p-12 border border-slate-600/30 text-center">
              <Search className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-slate-500 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-slate-300 mb-2">
                No hay órdenes con este filtro
              </h3>
              <p className="text-slate-400 text-sm sm:text-base mb-4">
                Intenta con otro filtro para ver más resultados
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredWorkOrders.map((workOrder) => (
                  <PreviewWorkOrder key={workOrder.id} {...workOrder} />
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}
