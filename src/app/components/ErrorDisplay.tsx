'use client'

import { cn } from "@/app/cn";
import { ParsedError } from "@/util/errorParser";
import { useEffect, useState } from "react";

interface ErrorDisplayProps {
  error: ParsedError | null;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function ErrorDisplay({
                                       error,
                                       onClose,
                                       autoClose = false,
                                       autoCloseDelay = 5000
                                     }: ErrorDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);

      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);

        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [error, autoClose, autoCloseDelay]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  if (!error || !isVisible) return null;

  const hasFieldErrors = error.fieldErrors && error.fieldErrors.length > 0;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-start justify-center pt-20 px-4",
      "bg-slate-900/50 backdrop-blur-sm",
      "animate-in fade-in duration-300"
    )}>
      <div className={cn(
        "bg-slate-800 rounded-lg shadow-2xl border-2 border-red-500/50",
        "max-w-2xl w-full",
        "animate-in slide-in-from-top-4 duration-300"
      )}>
        <div className={cn(
          "flex items-start justify-between p-6 border-b border-slate-700"
        )}>
          <div className={cn("flex items-start space-x-3")}>
            <div className={cn(
              "flex-shrink-0 w-10 h-10 rounded-full",
              "bg-red-500/20 flex items-center justify-center"
            )}>
              <svg
                className={cn("w-6 h-6 text-red-500")}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h3 className={cn("text-lg font-semibold text-white")}>
                Error en la operación
              </h3>
              {error.code && (
                <p className={cn("text-sm text-slate-400 mt-1")}>
                  Código: {error.code}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className={cn(
              "text-slate-400 hover:text-white transition-colors",
              "rounded-lg p-1 hover:bg-slate-700"
            )}
          >
            <svg className={cn("w-5 h-5")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={cn("p-6 space-y-4")}>
          <div className={cn(
            "bg-red-500/10 border border-red-500/30 rounded-lg p-4"
          )}>
            <p className={cn("text-red-400 text-sm font-medium")}>
              {error.message}
            </p>
          </div>

          {hasFieldErrors && (
            <div className={cn("space-y-2")}>
              <p className={cn("text-slate-300 text-sm font-medium")}>
                Errores de validación:
              </p>
              <div className={cn("space-y-2 max-h-64 overflow-y-auto")}>
                {error.fieldErrors!.map((fieldError, index) => (
                  <div
                    key={index}
                    className={cn(
                      "bg-slate-700/50 border border-slate-600 rounded-lg p-3",
                      "flex items-start space-x-3"
                    )}
                  >
                    <div className={cn(
                      "flex-shrink-0 w-6 h-6 rounded-full",
                      "bg-red-500/20 flex items-center justify-center mt-0.5"
                    )}>
                      <svg
                        className={cn("w-4 h-4 text-red-400")}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className={cn("flex-1 min-w-0")}>
                      <p className={cn("text-slate-300 text-sm font-medium")}>
                        {fieldError.field}
                      </p>
                      <p className={cn("text-slate-400 text-sm mt-0.5")}>
                        {fieldError.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={cn("px-6 py-4 bg-slate-700/30 border-t border-slate-700")}>
          <button
            onClick={handleClose}
            className={cn(
              "w-full px-4 py-2.5 bg-slate-600 hover:bg-slate-500",
              "text-white rounded-lg transition-colors font-medium text-sm"
            )}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
