import {cn} from "@/app/cn";
import Link from "next/link";

type WorkOrder = {
  id: number;
  mechanics: string[];
  estimatedDeliveryDate: string;
  estimatedDeliveryHours: string;
}

export default function PreviewWorkOrder({id, mechanics, estimatedDeliveryDate, estimatedDeliveryHours}: WorkOrder) {
  return (
    <div className={cn(
      "bg-slate-700/50 rounded-lg p-6 border border-slate-600/50",
      "hover:bg-slate-700/70 transition-all duration-200",
      "shadow-lg"
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">
          Orden #{id}
        </h3>
        <span className="text-slate-400 text-sm">
          {estimatedDeliveryDate}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-slate-300 text-sm mb-2">Mecánicos asignados:</p>
        <div className="flex flex-wrap gap-2">
          {mechanics.map((mechanic, index) => (
            <span
              key={index}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium",
                "bg-slate-600/50 text-slate-200 border border-slate-500/50"
              )}
            >
              {mechanic}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-600/50">
        <span className="text-slate-400 text-sm">
          Tiempo estimado:
        </span>
        <span className="text-blue-400 font-semibold">
          {estimatedDeliveryHours}
        </span>
      </div>

      <Link
        href={`/work-orders/detail/${id}`}
        className={cn(
          "mt-4 w-full py-2.5 rounded-lg font-medium",
          "bg-blue-600 hover:bg-blue-700 text-white",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800",
          "block text-center"
        )}
      >
        Ver detalles
      </Link>
    </div>
  )
}