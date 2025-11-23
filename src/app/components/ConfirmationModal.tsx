'use client'

import { cn } from "@/app/cn";
import { AlertTriangle } from "lucide-react";

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export default function ConfirmationModal({
                                            isOpen,
                                            onClose,
                                            onConfirm,
                                            title = "¿Está seguro?",
                                            message = "Esta acción no se puede deshacer",
                                            confirmText = "Confirmar",
                                            cancelText = "Cancelar",
                                            isDangerous = false
                                          }: ConfirmationModalProps) {

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center px-4",
      "bg-slate-900/50 backdrop-blur-sm",
      "animate-in fade-in duration-300"
    )}>
      <div className={cn(
        "bg-white rounded-xl shadow-2xl border border-slate-200",
        "max-w-md w-full p-6",
        "animate-in zoom-in-95 duration-300"
      )}>
        <div className="flex flex-col space-y-4">
          {/* Icono */}
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            isDangerous ? "bg-red-100" : "bg-blue-100"
          )}>
            <AlertTriangle className={cn(
              "w-6 h-6",
              isDangerous ? "text-red-600" : "text-blue-600"
            )} />
          </div>

          {/* Título */}
          <h3 className="text-xl font-bold text-slate-900">
            {title}
          </h3>

          {/* Mensaje */}
          <p className="text-slate-600">
            {message}
          </p>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-lg font-medium",
                "bg-slate-100 text-slate-700",
                "hover:bg-slate-200 transition-colors"
              )}
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-lg font-medium text-white",
                "transition-colors",
                isDangerous
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
