'use client'

import { cn } from "@/app/cn";
import { ReactNode } from "react";

type SuccessMessageProps = {
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
  icon?: ReactNode;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function SuccessMessage({
                                         onClose,
                                         title = "¡Operación exitosa!",
                                         message = "La operación se ha completado correctamente",
                                         buttonText = "Aceptar",
                                         icon,
                                         autoClose = false,
                                         autoCloseDelay = 3000
                                       }: SuccessMessageProps) {

  if (autoClose) {
    setTimeout(() => {
      onClose();
    }, autoCloseDelay);
  }

  const defaultIcon = (
    <svg className={cn("w-10 h-10 text-emerald-500")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center px-4",
      "bg-slate-900/50 backdrop-blur-sm",
      "animate-in fade-in duration-300"
    )}>
      <div className={cn(
        "bg-slate-800 rounded-lg shadow-2xl border-2 border-emerald-500/50",
        "max-w-md w-full p-8",
        "animate-in zoom-in-95 duration-300"
      )}>
        <div className={cn("flex flex-col items-center space-y-4")}>
          <div className={cn(
            "w-16 h-16 rounded-full bg-emerald-500/20",
            "flex items-center justify-center"
          )}>
            {icon || defaultIcon}
          </div>
          <h3 className={cn("text-2xl font-bold text-white text-center")}>
            {title}
          </h3>
          <p className={cn("text-slate-400 text-center")}>
            {message}
          </p>
          <button
            onClick={onClose}
            className={cn(
              "mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700",
              "text-white rounded-lg transition-colors font-medium"
            )}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
