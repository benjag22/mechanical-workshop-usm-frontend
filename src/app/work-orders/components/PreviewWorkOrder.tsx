import {cn} from "@/app/cn";
import Link from "next/link";
import {TrimmedWorkOrder} from "@/api"

export default function PreviewWorkOrder({...props}: TrimmedWorkOrder) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDeliveryTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={cn(
      "bg-slate-700/50 rounded-lg p-6 border border-slate-600/50",
      "hover:bg-slate-700/70 transition-all duration-200",
      "shadow-lg"
    )}>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-white font-semibold text-lg">
            Orden #{props.id}
          </h3>
          <span className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium",
            props.isCompleted
              ? "bg-green-500/20 text-green-400 border border-green-500/50"
              : "bg-amber-500/20 text-amber-400 border border-amber-500/50"
          )}>
            {props.isCompleted ? '✓ Completada' : 'En progreso'}
          </span>
        </div>
        <span className="text-slate-400 text-sm">
          {formatDate(props.createdAt)}
        </span>
      </div>

      <div className="mb-4 p-3 bg-slate-800/30 rounded-lg border border-slate-600/30">
        <p className="text-slate-400 text-xs mb-2">Cliente</p>
        <div className="space-y-1">
          <p className="text-white font-medium">
            {props.clientFirstName} {props.clientLastName}
          </p>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-slate-300 text-sm">{props.clientCellphoneNumber}</span>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <div>
          <p className="text-slate-400 text-xs">Vehículo</p>
          <p className="text-white font-semibold text-lg font-mono">
            {props.carLicensePlate}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-slate-400 text-xs mb-2">Mecánico Líder</p>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold text-sm">
            { props.mechanicLeaderFullName?.charAt(0).toUpperCase() ?? ""}
          </div>
          <span className="text-slate-200 font-medium">
            {props.mechanicLeaderFullName ?? ""}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-600/50">
        <span className="text-slate-400 text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Entrega estimada:
        </span>
        <span className="text-blue-400 font-semibold">
          {formatDeliveryTime(props.deliveryTime)}
        </span>
      </div>

      {props.signatureUrl && (
        <div className="mt-3 pt-3 border-t border-slate-600/50">
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd" />
            </svg>
            <span className="font-medium">Con firma digital</span>
          </div>
        </div>
      )}

      <Link
        href={`/work-orders/detail/${props.id}`}
        className={cn(
          "mt-4 w-full py-2.5 rounded-lg font-medium",
          "bg-blue-600 hover:bg-blue-700 text-white",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800",
          "block text-center",
          "flex items-center justify-center gap-2"
        )}
      >
        <span>Ver detalles</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  )
}