"use client";

import { useState } from "react";
import { cn } from "@/app/cn";
import { Shield, X, Loader2, CheckCircle, XCircle } from "lucide-react";

type AuthorizationPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onAuthorize: (rut: string) => Promise<boolean>;
  workOrderId: number;
};

export default function AuthorizationPopup({
                                             isOpen,
                                             onClose,
                                             onAuthorize,
                                             workOrderId,
                                           }: AuthorizationPopupProps) {
  const [rut, setRut] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authResult, setAuthResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const formatRut = (value: string) => {
    const cleaned = value.replace(/[^0-9kK]/g, "").toUpperCase();
    if (cleaned.length === 0) return "";
    const rutBody = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);
    return dv ? `${rutBody}-${dv}` : rutBody;
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value);
    setRut(formatted);
    setAuthResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rut || rut.length < 9) {
      setAuthResult({
        success: false,
        message: "Por favor ingresa un RUT válido",
      });
      return;
    }

    setIsLoading(true);
    setAuthResult(null);

    try {
      const isAuthorized = await onAuthorize(rut);

      if (isAuthorized) {
        setAuthResult({
          success: true,
          message: "¡Autorización exitosa! Redirigiendo...",
        });
      } else {
        setAuthResult({
          success: false,
          message: "No tienes autorización. No eres el líder de esta orden de trabajo.",
        });
      }
    } catch (error) {
      setAuthResult({
        success: false,
        message: "Error al verificar autorización. Intenta nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setRut("");
    setAuthResult(null);
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={cn(
            "bg-gradient-to-br from-slate-800 to-slate-900",
            "rounded-2xl shadow-2xl border border-slate-700",
            "w-full max-w-md p-6 relative",
            "transform transition-all duration-300"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            disabled={isLoading}
            className={cn(
              "absolute top-4 right-4 p-2 rounded-lg",
              "text-slate-400 hover:text-white hover:bg-slate-700",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Autorización Requerida
              </h2>
              <p className="text-sm text-slate-400">
                Orden de Trabajo #{workOrderId}
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Ingresa tu RUT para verificar autorización
              </label>
              <input
                type="text"
                value={rut}
                onChange={handleRutChange}
                placeholder="12345678-9"
                maxLength={10}
                disabled={isLoading || authResult?.success === true}
                autoFocus
                className={cn(
                  "w-full px-4 py-3 rounded-lg",
                  "bg-slate-700/50 border",
                  authResult?.success === false
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-600 focus:ring-blue-500",
                  "text-white placeholder-slate-500",
                  "focus:outline-none focus:ring-2 focus:border-transparent",
                  "transition-all duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              />
            </div>

            {authResult && (
              <div
                className={cn(
                  "flex items-start gap-3 p-4 rounded-lg border animate-in fade-in slide-in-from-top-2 duration-300",
                  authResult.success
                    ? "bg-green-500/10 border-green-500/50"
                    : "bg-red-500/10 border-red-500/50"
                )}
              >
                {authResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      authResult.success ? "text-green-400" : "text-red-400"
                    )}
                  >
                    {authResult.message}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className={cn(
                  "flex-1 px-4 py-3 rounded-lg font-medium",
                  "bg-slate-700 text-slate-300",
                  "hover:bg-slate-600 transition-all duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || !rut || rut.length < 9 || authResult?.success === true}
                className={cn(
                  "flex-1 px-4 py-3 rounded-lg font-medium",
                  "bg-blue-600 text-white",
                  "hover:bg-blue-700 transition-all duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "flex items-center justify-center gap-2"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  "Verificar"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-400 text-center">
              Solo los mecánicos líderes pueden acceder a esta orden de trabajo
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
