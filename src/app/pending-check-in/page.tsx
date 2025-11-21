'use client'

import {cn} from "@/app/cn";
import CheckInToOrderContainer from "@/app/pending-check-in/components/CheckInToOrderContainer";
import FilterSection from "@/app/pending-check-in/components/FilterSection";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import api, {GetCheckInBasicResponse} from "@/api";
import {useEffect, useState} from "react";
import { parseApiError, ParsedError } from "@/util/errorParser";
import ErrorDisplay from "@/app/components/ErrorDisplay";

async function getPendingCheckIns(
  set: (data: GetCheckInBasicResponse[]) => void,
  setError: (error: ParsedError) => void
): Promise<void> {
  try {
    const response = await api.getAllCheckInFull()

    if (response.data){
      set(response.data)
    } else if (response.error) {
      const parsedError = parseApiError(response.error, "Error al cargar los check-ins pendientes");
      setError(parsedError);
    }
  } catch(err) {
    const parsedError = parseApiError(err, "Error inesperado al cargar los check-ins");
    setError(parsedError);
  }
}

export default function PendingCheckInPage() {
  const [pendingCheckIns, setPendingCheckIns] = useState<GetCheckInBasicResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ParsedError | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getPendingCheckIns(setPendingCheckIns, setError)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <LoadingSpinner
        title="Cargando check-ins pendientes..."
        subtitle="Por favor espere"
      />
    );
  }

  if (!pendingCheckIns || pendingCheckIns.length === 0) {
    return (
      <>
        <ErrorDisplay
          error={error}
          onClose={() => setError(null)}
        />
        <div className={cn("w-full bg-slate-700 min-h-screen p-6")}>
          <div className={cn("flex flex-col items-center justify-center h-[70vh]")}>
            <div className={cn(
              "bg-slate-800 rounded-lg p-12 shadow-xl border border-slate-600",
              "flex flex-col items-center space-y-4 max-w-md"
            )}>
              <div className={cn(
                "w-20 h-20 rounded-full bg-slate-700/50",
                "flex items-center justify-center"
              )}>
                <svg
                  className={cn("w-10 h-10 text-slate-400")}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className={cn("text-xl font-bold text-slate-200")}>
                No hay check-ins pendientes
              </h3>
              <p className={cn("text-slate-400 text-center text-sm")}>
                No se encontraron check-ins disponibles para generar órdenes de trabajo
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ErrorDisplay
        error={error}
        onClose={() => setError(null)}
      />

      <div className={cn("w-full bg-slate-700 min-h-screen p-6")}>
        <FilterSection />

        <div className={cn("mb-6")}>
          <h2 className={cn("text-2xl font-bold text-slate-100 mb-2")}>
            Entradas pendientes
          </h2>
          <p className={cn("text-slate-300 flex items-center gap-2")}>
                      <span className={cn(
                        "inline-flex items-center justify-center",
                        "bg-blue-500/20 text-blue-400 rounded-full",
                        "px-3 py-1 text-sm font-semibold"
                      )}>
                        {pendingCheckIns.length}
                      </span>
            check-ins disponibles para generar órdenes de trabajo
          </p>
        </div>

        <div className={cn("space-y-4")}>
          {pendingCheckIns.map((checkIn) => (
            <CheckInToOrderContainer
              key={checkIn.checkInId}
              checkIn={checkIn}
            />
          ))}
        </div>
      </div>
    </>
  );
}
