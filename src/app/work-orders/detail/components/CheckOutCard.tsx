'use client';

import { ClipboardCheck, Clock, Gauge, FileText } from 'lucide-react';
import { CheckOutResponse } from '@/api';

type CheckOutCardProps = {
  checkOut: CheckOutResponse;
}

export default function CheckOutCard({ checkOut }: CheckOutCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <ClipboardCheck className="w-5 h-5 text-blue-700" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          Check Out Generado
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
          <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-1">
              Hora de Salida
            </p>
            <p className="text-base font-semibold text-slate-900">
              {formatDate(checkOut.entryTime)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
          <Gauge className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-1">
              Kilometraje
            </p>
            <p className="text-base font-semibold text-slate-900">
              {checkOut.mileage.toLocaleString('es-ES')} km
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
          <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-2">
              Diagnóstico del Vehículo
            </p>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {checkOut.vehicleDiagnosis}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-slate-600 font-medium">
            Check Out ID: #{checkOut.id}
          </span>
        </div>
      </div>
    </div>
  );
}
