import Image from "next/image";
import { cn } from "@/app/cn";
import { CreateImageRequest } from "@/api";

type LightData = CreateImageRequest & {
  present: boolean;
  is_functional: boolean;
};

type IndicatorLightsProps = {
  lightsData: LightData[];
  onLightChange: (index: number, field: 'present' | 'is_functional', value: boolean) => void;
}

export default function IndicatorLights({ lightsData, onLightChange }: IndicatorLightsProps) {
  const handlePresentChange = (index: number, present: boolean) => {
    onLightChange(index, 'present', present);
    if (!present) {
      onLightChange(index, 'is_functional', false);
    }
  };

  if (lightsData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <p className="text-lg font-medium">Cargando luces testigo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pr-4">
      {lightsData.map((light, index) => (
        <div
          key={light.id}
          className={cn(
            "bg-slate-700/50 rounded-xl p-6 border transition-all duration-200",
            light.present
              ? "border-blue-500/50 shadow-lg shadow-blue-500/10"
              : "border-slate-600/30"
          )}
        >
          <div className="flex items-center gap-4 mb-6">
            {light.url && (
              <div className="flex-shrink-0 bg-slate-600/50 rounded-lg p-3">
                <Image
                  src={light.url}
                  alt={light.alt}
                  width={80}
                  height={80}
                  className="filter brightness-0 invert opacity-80"
                />
              </div>
            )}
            <div className="flex-1">
                            <span className="text-slate-200 text-lg font-medium leading-tight block">
                                {light.alt}
                            </span>
              {light.present && (
                <span className={cn(
                  "text-xs font-medium mt-1 inline-block",
                  light.is_functional ? "text-emerald-400" : "text-red-400"
                )}>
                                    {light.is_functional ? "✓ Funcionando" : "✗ Con fallas"}
                                </span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-slate-300 text-sm mb-3 font-medium">¿Está presente?</p>
            <div className="flex gap-3">
              <button
                onClick={() => handlePresentChange(index, true)}
                className={cn(
                  "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  "flex items-center justify-center gap-2",
                  light.present
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 ring-2 ring-blue-400"
                    : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                )}
              >
                {light.present && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                Sí
              </button>
              <button
                onClick={() => handlePresentChange(index, false)}
                className={cn(
                  "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  "flex items-center justify-center gap-2",
                  !light.present
                    ? "bg-slate-500 text-white shadow-lg shadow-slate-500/25 ring-2 ring-slate-400"
                    : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                )}
              >
                {!light.present && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                No
              </button>
            </div>
          </div>

          {light.present && (
            <div className="animate-in fade-in-50 slide-in-from-top-2 duration-300">
              <p className="text-slate-300 text-sm mb-3 font-medium">¿Funciona correctamente?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => onLightChange(index, 'is_functional', true)}
                  className={cn(
                    "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    "flex items-center justify-center gap-2",
                    light.is_functional
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 ring-2 ring-emerald-400"
                      : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                  )}
                >
                  {light.is_functional && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  Sí
                </button>
                <button
                  onClick={() => onLightChange(index, 'is_functional', false)}
                  className={cn(
                    "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    "flex items-center justify-center gap-2",
                    !light.is_functional
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/25 ring-2 ring-red-400"
                      : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                  )}
                >
                  {!light.is_functional && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                  No
                </button>
              </div>
            </div>
          )}

          {!light.present && (
            <div className="flex items-center gap-2 mt-4 px-3 py-2 bg-slate-600/30 rounded-lg">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
              <span className="text-slate-400 text-sm">Luz no presente en el vehículo</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}