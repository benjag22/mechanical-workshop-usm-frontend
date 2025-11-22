import {cn} from "@/app/cn";
import {AlertTriangle, CheckCircle2} from "lucide-react";
import Image from "next/image";
import {GetWorkOrderHasDashboardLight} from "@/api";

export default function DashboardLightsCard({lights}: { lights: GetWorkOrderHasDashboardLight[] }) {
  const nonFunctionalLights = lights.filter(light => !light.isFunctional);
  const functionalLights = lights.filter(light => light.isFunctional);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <div className={cn(
          "p-2 rounded-lg",
          nonFunctionalLights.length > 0 ? "bg-red-100" : "bg-green-100"
        )}>
          <AlertTriangle className={cn(
            "w-5 h-5",
            nonFunctionalLights.length > 0 ? "text-red-600" : "text-green-600"
          )} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          Luces del Tablero
        </h3>
        <span className="ml-auto text-sm font-medium text-slate-500">
          {lights.length}
        </span>
      </div>

      {lights.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No se registraron luces del tablero</p>
        </div>
      ) : (
        <div className="space-y-4">
          {nonFunctionalLights.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <h4 className="text-sm font-semibold text-red-900">
                  Luces Encendidas ({nonFunctionalLights.length})
                </h4>
              </div>
              {nonFunctionalLights.map((light) => (
                <div
                  key={light.imageId}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                    "bg-red-50 border border-red-200 hover:bg-red-100"
                  )}
                >
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-red-200 flex-shrink-0">
                    <Image
                      src={light.url}
                      alt={light.alt}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-slate-900 block truncate">
                      {light.alt}
                    </span>
                    <span className="text-xs text-red-600 font-medium">
                      Requiere atención
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {functionalLights.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <h4 className="text-sm font-semibold text-green-900">
                  Luces Funcionales ({functionalLights.length})
                </h4>
              </div>
              {functionalLights.map((light) => (
                <div
                  key={light.imageId}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                    "bg-green-50 border border-green-200 hover:bg-green-100"
                  )}
                >
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-green-200 flex-shrink-0">
                    <Image
                      src={light.url}
                      alt={light.alt}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-slate-900 block truncate">
                      {light.alt}
                    </span>
                    <span className="text-xs text-green-600 font-medium">
                      Funcionando correctamente
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
¿
      {nonFunctionalLights.length > 0 && functionalLights.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Total de luces registradas</span>
            <span className="font-semibold">{lights.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}
