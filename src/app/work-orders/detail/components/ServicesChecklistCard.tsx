"use client";

import {cn} from "@/app/cn";
import {Wrench, Clock, CheckCircle2, Circle} from "lucide-react";
import {useState} from "react";

type Service = {
  name: string;
  time: number;
  completed?: boolean;
}

export default function ServicesChecklistCard({services: initialServices}: { services: Service[] }) {
  const [services, setServices] = useState(initialServices);

  const toggleService = (index: number) => {
    setServices(prev => prev.map((service, i) =>
      i === index ? {...service, completed: !service.completed} : service
    ));
  };

  const totalTime = services.reduce((acc, service) => acc + service.time, 0);
  const completedTime = services
    .filter(s => s.completed)
    .reduce((acc, service) => acc + service.time, 0);

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
            {completedTime}h / {totalTime}h
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
              service.completed
                ? "border-green-200 bg-green-50/50"
                : "border-slate-200 bg-white"
            )}
          >
            {service.completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
            ) : (
              <Circle className="w-6 h-6 text-slate-300 flex-shrink-0" />
            )}
            <div className="flex-1 text-left">
              <p className={cn(
                "font-medium",
                service.completed
                  ? "text-green-900 line-through"
                  : "text-slate-900"
              )}>
                {service.name}
              </p>
            </div>
            <span className={cn(
              "text-sm font-medium px-2 py-1 rounded",
              service.completed
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-600"
            )}>
              {service.time}h
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">Progreso</span>
          <span className="text-sm font-semibold text-slate-900">
            {Math.round((completedTime / totalTime) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
            style={{width: `${(completedTime / totalTime) * 100}%`}}
          />
        </div>
      </div>
    </div>
  );
}
