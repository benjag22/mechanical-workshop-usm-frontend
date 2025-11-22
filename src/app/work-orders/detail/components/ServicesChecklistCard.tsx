"use client";

import {cn} from "@/app/cn";
import {Wrench, Clock, CheckCircle2, Circle} from "lucide-react";
import {useState} from "react";
import {GetServiceState} from "@/api";

export default function ServicesChecklistCard({services: initialServices}: { services: GetServiceState[] }) {
  const [services, setServices] = useState(initialServices);

  const toggleService = (index: number) => {
    setServices(prev => prev.map((service, i) =>
      i === index ? {...service, finalized: !service.finalized} : service
    ));
  };

  const parseTimeToHours = (time: string): number => {
    if (!time) return 0;

    const [hours, minutes] = time.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes)) return 0;

    return hours + (minutes / 60);
  };

  const formatHoursToTime = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const totalTime = services.reduce((acc, service) =>
    acc + parseTimeToHours(service.estimatedTime), 0
  );

  const completedTime = services
    .filter(s => s.finalized)
    .reduce((acc, service) =>
      acc + parseTimeToHours(service.estimatedTime), 0
    );

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Wrench className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Servicios a Realizar
          </h3>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">
            {formatHoursToTime(completedTime)} / {formatHoursToTime(totalTime)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {services.map((service, index) => (
          <button
            key={index}
            onClick={() => toggleService(index)}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
              "hover:bg-slate-50",
              service.finalized
                ? "border-green-200 bg-green-50/50"
                : "border-slate-200 bg-white"
            )}
          >
            {service.finalized ? (
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
            ) : (
              <Circle className="w-6 h-6 text-slate-300 flex-shrink-0" />
            )}
            <div className="flex-1 text-left">
              <p className={cn(
                "font-medium",
                service.finalized
                  ? "text-green-900 line-through"
                  : "text-slate-900"
              )}>
                {service.name}
              </p>
            </div>
            <span className={cn(
              "text-sm font-medium px-2 py-1 rounded",
              service.finalized
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-600"
            )}>
              {service.estimatedTime}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">Progreso</span>
          <span className="text-sm font-semibold text-slate-900">
            {totalTime > 0 ? Math.round((completedTime / totalTime) * 100) : 0}%
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
            style={{width: `${totalTime > 0 ? (completedTime / totalTime) * 100 : 0}%`}}
          />
        </div>
      </div>
    </div>
  );
}
