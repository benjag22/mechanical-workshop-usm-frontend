'use client';

import { useState } from 'react';
import { cn } from '@/app/cn';
import { X, Gauge, FileText } from 'lucide-react';
import { CreateCheckOutRequest } from '@/api';

type CheckOutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCheckOutRequest) => Promise<void>;
  workOrderId: number;
}

export default function CheckOutModal({
                                        isOpen,
                                        onClose,
                                        onSubmit,
                                        workOrderId,
                                      }: CheckOutModalProps) {
  const [mileage, setMileage] = useState('');
  const [vehicleDiagnosis, setVehicleDiagnosis] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mileage || !vehicleDiagnosis.trim()) {
      alert('Por favor complete todos los campos');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        workOrderId,
        mileage: parseInt(mileage, 10),
        vehicleDiagnosis: vehicleDiagnosis.trim(),
      });

      setMileage('');
      setVehicleDiagnosis('');
    } catch (error) {
      console.error('Error al generar check out:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setMileage('');
      setVehicleDiagnosis('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full">

          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-700" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Generar Check Out
                </h2>
                <p className="text-sm text-slate-700 mt-1 font-medium">
                  Orden de Trabajo #{workOrderId}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Kilometraje */}
            <div>
              <label
                htmlFor="mileage"
                className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2"
              >
                <Gauge className="w-4 h-4 text-blue-600" />
                Kilometraje del Vehículo
              </label>
              <input
                id="mileage"
                type="number"
                min="0"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="Ej: 45000"
                disabled={isSubmitting}
                className={cn(
                  "w-full px-4 py-3 rounded-lg border-2 border-slate-300",
                  "focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none",
                  "transition-all placeholder:text-slate-400",
                  "text-slate-900 font-medium text-lg",
                  "disabled:bg-slate-50 disabled:cursor-not-allowed"
                )}
                required
              />
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Ingrese el kilometraje actual del vehículo
              </p>
            </div>
            <div>
              <label
                htmlFor="diagnosis"
                className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                Diagnóstico del Vehículo
              </label>
              <textarea
                id="diagnosis"
                value={vehicleDiagnosis}
                onChange={(e) => setVehicleDiagnosis(e.target.value)}
                placeholder="Describa el estado actual del vehículo, trabajos realizados y recomendaciones..."
                rows={6}
                disabled={isSubmitting}
                className={cn(
                  "w-full px-4 py-3 rounded-lg border-2 border-slate-300",
                  "focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none",
                  "transition-all placeholder:text-slate-400 resize-none",
                  "text-slate-900 font-medium",
                  "disabled:bg-slate-50 disabled:cursor-not-allowed"
                )}
                required
              />
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Mínimo 10 caracteres
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className={cn(
                  "flex-1 px-4 py-3 rounded-lg font-semibold",
                  "bg-slate-200 text-slate-800",
                  "hover:bg-slate-300 transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !mileage || !vehicleDiagnosis.trim()}
                className={cn(
                  "flex-1 px-4 py-3 rounded-lg font-semibold",
                  "bg-blue-700 text-white",
                  "hover:bg-blue-800 transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isSubmitting ? 'Generando...' : 'Generar Check Out'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
