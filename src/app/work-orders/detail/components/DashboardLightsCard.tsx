import {cn} from "@/app/cn";
import {AlertTriangle} from "lucide-react";
import Image from "next/image";

export default function DashboardLightsCard({lights}: { lights: string[] }) {
  const lightNames = [
    "Check Engine",
    "Presión de Aceite",
    "Advertencia de Frenos"
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-100 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          Luces del Tablero
        </h3>
      </div>

      {lights.length > 0 ? (
        <div className="space-y-3">
          {lights.map((light, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg",
                "bg-red-50 border border-red-200"
              )}
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-red-200">
                <Image
                  src={light}
                  alt={lightNames[index] || `Luz ${index + 1}`}
                  width={24}
                  height={24}
                />
              </div>
              <span className="text-sm font-medium text-slate-900">
                {lightNames[index] || `Luz ${index + 1}`}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-sm text-center py-4">
          No se reportaron luces encendidas
        </p>
      )}
    </div>
  );
}