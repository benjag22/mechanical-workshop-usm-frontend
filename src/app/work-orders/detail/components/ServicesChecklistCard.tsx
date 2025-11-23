"use client";

import {cn} from "@/app/cn";
import {CheckCircle2, Circle, Clock, Wrench, Save, Lock} from "lucide-react";
import {useState, useMemo} from "react";
import api, {CreateWorkOrderRealizedServiceResponse, GetServiceState} from "@/api";

async function saveProgress(workOrderId:number, serviceIds : Array<number>) {
  try {
    const response = await api.toggleRealizedServicesFinalized({
      path: {workOrderId},
      body: serviceIds
    })
    if(response.data){
      return response.data
    }else{
      return [];
    }

  }catch (error) {
    console.log(error);
    throw error;
  }
}

type ServicesChecklistCardProps = {
  workOrderId: number;
  services: GetServiceState[];
  isCompleted: boolean;
}

export default function ServicesChecklistCard({
                                                workOrderId,
                                                services: initialServices,
                                                isCompleted
                                              }: ServicesChecklistCardProps) {
  const [services, setServices] = useState(initialServices);
  const [savedServices, setSavedServices] = useState(initialServices);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = useMemo(() => {
    return services.some((service, index) =>
      service.finalized !== savedServices[index]?.finalized
    );
  }, [services, savedServices]);

  const getChangedServiceIds = () => {
    return services
      .filter((service, index) =>
        service.finalized !== savedServices[index]?.finalized
      )
      .map(service => service.id);
  };

  const toggleService = (index: number) => {
    if (isCompleted) return;

    setServices(prev => prev.map((s, i) =>
      i === index ? {...s, finalized: !s.finalized} : s
    ));
  };

  const handleSaveProgress = async () => {
    if (!hasChanges || isSaving || isCompleted) return;

    setIsSaving(true);

    try {
      const changedIds = getChangedServiceIds();
      const response = await saveProgress(workOrderId, changedIds);

      if (response && response.length > 0) {
        const updatedServices = services.map(service => {
          const updatedService = response.find(
            (r: CreateWorkOrderRealizedServiceResponse) => r.workServiceId === service.id
          );
          return updatedService
            ? {...service, finalized: updatedService.finalized}
            : service;
        });

        setServices(updatedServices);
        setSavedServices(updatedServices);
      }
    } catch (error) {
      console.error(error);
      setServices(savedServices);
    } finally {
      setIsSaving(false);
    }
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
          {isCompleted && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
              <Lock className="w-3 h-3" />
              Bloqueado
            </span>
          )}
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
            key={service.id}
            onClick={() => toggleService(index)}
            disabled={isSaving || isCompleted}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
              !isCompleted ? "hover:bg-slate-50" : "",
              (isSaving || isCompleted) ? "opacity-50 cursor-not-allowed" : "",
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

      {!isCompleted && (
        <div className="mt-4">
          <button
            onClick={handleSaveProgress}
            disabled={!hasChanges || isSaving}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all",
              hasChanges && !isSaving
                ? "bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            <Save className="w-5 h-5" />
            {isSaving ? "Guardando..." : hasChanges ? "Guardar Progreso" : "Sin Cambios"}
          </button>
        </div>
      )}

      {isCompleted && (
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-sm text-slate-600 text-center flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            Esta orden de trabajo está completada. No se pueden modificar los servicios.
          </p>
        </div>
      )}
    </div>
  );
}
