'use client'

import { cn } from "@/app/cn";
import { ReactNode } from "react";

type ConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  icon?: ReactNode;
  isLoading?: boolean;
}

export default function ConfirmDialog({
                                        isOpen,
                                        onClose,
                                        onConfirm,
                                        title = "¿Estás seguro?",
                                        message = "Esta acción no se puede deshacer",
                                        confirmText = "Confirmar",
                                        cancelText = "Cancelar",
                                        variant = "warning",
                                        icon,
                                        isLoading = false
                                      }: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      border: "border-red-500/50",
      iconBg: "bg-red-500/20",
      iconColor: "text-red-500",
      button: "bg-red-600 hover:bg-red-700"
    },
    warning: {
      border: "border-yellow-500/50",
      iconBg: "bg-yellow-500/20",
      iconColor: "text-yellow-500",
      button: "bg-yellow-600 hover:bg-yellow-700"
    },
    info: {
      border: "border-blue-500/50",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-500",
      button: "bg-blue-600 hover:bg-blue-700"
    }
  };

  const styles = variantStyles[variant];

  const defaultIcon = (
    <svg className={cn("w-10 h-10", styles.iconColor)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center px-4",
      "bg-slate-900/50 backdrop-blur-sm",
      "animate-in fade-in duration-300"
    )}>
      <div className={cn(
        "bg-slate-800 rounded-lg shadow-2xl border-2",
        styles.border,
        "max-w-md w-full p-8",
        "animate-in zoom-in-95 duration-300"
      )}>
        <div className={cn("flex flex-col items-center space-y-4")}>
          <div className={cn(
            "w-16 h-16 rounded-full",
            styles.iconBg,
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
          <div className={cn("flex gap-3 w-full mt-6")}>
            <button
              onClick={onClose}
              disabled={isLoading}
              className={cn(
                "flex-1 px-6 py-2.5 bg-slate-600 hover:bg-slate-700",
                "text-white rounded-lg transition-colors font-medium",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                "flex-1 px-6 py-2.5",
                styles.button,
                "text-white rounded-lg transition-colors font-medium",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-2"
              )}
            >
              {isLoading ? (
                <>
                  <div className={cn("w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin")} />
                  <span>Procesando...</span>
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
