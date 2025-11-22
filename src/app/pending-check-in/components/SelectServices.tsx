'use client'

import { cn } from "@/app/cn";
import { useState, useEffect } from "react";
import api, { CreateWorkServiceRequest, GetService } from "@/api"

type ServiceSelection = {
  id: number;
  name: string;
  estimatedTime: string;
  isExisting: boolean;
}

type Props = {
  onServicesChange?: (
    serviceIds: number[],
    newServices: CreateWorkServiceRequest[]
  ) => void;
}

export default function SelectServices({ onServicesChange }: Props) {
  const [availableServices, setAvailableServices] = useState<GetService[]>([]);
  const [selectedServices, setSelectedServices] = useState<ServiceSelection[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [showExistingList, setShowExistingList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [addServiceState, setAddServiceState] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [serviceHours, setServiceHours] = useState("0");
  const [serviceMinutes, setServiceMinutes] = useState("0");
  const [errors, setErrors] = useState({ name: '', hours: '', minutes: '' });

  useEffect(() => {
    async function loadServices() {
      try {
        setIsLoadingServices(true);
        const response = await api.getAllWorkServices();
        if (response.data) {
          setAvailableServices(response.data);
        } else {
          setAvailableServices([]);
        }
      } catch (error) {
        console.error(error);
        setAvailableServices([]);
      } finally {
        setIsLoadingServices(false);
      }
    }
    loadServices();
  }, []);

  useEffect(() => {
    if (onServicesChange) {
      const serviceIds = selectedServices
        .filter(s => s.isExisting)
        .map(s => s.id);

      const newServices = selectedServices
        .filter(s => !s.isExisting)
        .map(s => ({
          serviceName: s.name,
          estimatedTime: s.estimatedTime
        }));

      onServicesChange(serviceIds, newServices);
    }
  }, [selectedServices, onServicesChange]);

  const isServiceAlreadySelected = (name: string): boolean => {
    return selectedServices.some(s =>
      s.name.toLowerCase() === name.toLowerCase()
    );
  };

  const handleSelectExistingService = (service: GetService) => {
    if (isServiceAlreadySelected(service.name)) {
      alert('Este servicio ya está seleccionado');
      return;
    }

    const newSelectedService: ServiceSelection = {
      id: service.id,
      name: service.name,
      estimatedTime: service.estimatedTime,
      isExisting: true
    };

    setSelectedServices([...selectedServices, newSelectedService]);
    setShowExistingList(false);
    setSearchTerm('');
  };

  const formatTimeToHHMM = (hours: string, minutes: string): string => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const addService = () => {
    const newErrors = { name: '', hours: '', minutes: '' };

    if (!serviceName.trim()) {
      newErrors.name = 'El nombre del servicio es requerido';
    } else if (isServiceAlreadySelected(serviceName)) {
      newErrors.name = 'Este servicio ya está seleccionado';
    }

    const hours = parseInt(serviceHours);
    const minutes = parseInt(serviceMinutes);

    if (!serviceHours.trim()) {
      newErrors.hours = 'Las horas son requeridas';
    } else if (isNaN(hours) || hours < 0) {
      newErrors.hours = 'Ingresa un valor válido';
    }

    if (!serviceMinutes.trim()) {
      newErrors.minutes = 'Los minutos son requeridos';
    } else if (isNaN(minutes) || minutes < 0 || minutes > 59) {
      newErrors.minutes = 'Debe estar entre 0 y 59';
    }

    if (hours === 0 && minutes === 0) {
      newErrors.hours = 'El tiempo debe ser mayor a 0';
    }

    if (newErrors.name || newErrors.hours || newErrors.minutes) {
      setErrors(newErrors);
      return;
    }

    const newService: ServiceSelection = {
      id: Date.now(),
      name: serviceName.trim(),
      estimatedTime: formatTimeToHHMM(serviceHours, serviceMinutes),
      isExisting: false
    };

    setSelectedServices([...selectedServices, newService]);
    setServiceName("");
    setServiceHours("");
    setServiceMinutes("");
    setErrors({ name: '', hours: '', minutes: '' });
    setAddServiceState(false);
  };

  const removeService = (id: number) => {
    setSelectedServices(prev => prev.filter(s => s.id !== id));
  };

  const cancelAdd = () => {
    setServiceName("");
    setServiceHours("");
    setServiceMinutes("");
    setErrors({ name: '', hours: '', minutes: '' });
    setAddServiceState(false);
  };


  const parseTime = (timeString: string): { hours: number; minutes: number } => {
    const parts = timeString.split(':');
    return {
      hours: parseInt(parts[0]) || 0,
      minutes: parseInt(parts[1]) || 0
    };
  };

  const formatHours = (timeString: string) => {
    const { hours, minutes } = parseTime(timeString);

    if (hours === 0 && minutes === 0) return '0 minutos';

    const parts = [];
    if (hours > 0) {
      parts.push(hours === 1 ? `${hours} hora` : `${hours} horas`);
    }
    if (minutes > 0) {
      parts.push(minutes === 1 ? `${minutes} minuto` : `${minutes} minutos`);
    }

    return parts.join(' y ');
  };

  const getTotalMinutes = () => {
    return selectedServices.reduce((total, service) => {
      const { hours, minutes } = parseTime(service.estimatedTime);
      return total + (hours * 60) + minutes;
    }, 0);
  };

  const formatTotalTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0 && minutes === 0) return '0 minutos';

    const parts = [];
    if (hours > 0) {
      parts.push(hours === 1 ? `${hours} hora` : `${hours} horas`);
    }
    if (minutes > 0) {
      parts.push(minutes === 1 ? `${minutes} minuto` : `${minutes} minutos`);
    }

    return parts.join(' y ');
  };

  const filteredAvailableServices = availableServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const notSelected = !isServiceAlreadySelected(service.name);
    return matchesSearch && notSelected;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-slate-100 text-xl font-semibold mb-2">
          Servicios a Realizar
        </h2>
        <p className="text-slate-300 text-sm">
          Selecciona servicios existentes o agrega nuevos servicios personalizados
        </p>
      </div>

      <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-semibold flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Seleccionar Servicios Existentes
          </h2>
          <button
            onClick={() => setShowExistingList(!showExistingList)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
              showExistingList
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            )}
          >
            {showExistingList ? 'Cerrar lista' : 'Ver servicios'}
          </button>
        </div>

        {showExistingList && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar servicio..."
                className="w-full px-4 py-2.5 pl-10 rounded-lg bg-slate-800/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <svg className="w-5 h-5 absolute left-3 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {isLoadingServices ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-slate-400">Cargando servicios...</span>
              </div>
            ) : filteredAvailableServices.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p>No se encontraron servicios disponibles</p>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredAvailableServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleSelectExistingService(service)}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-600/30 hover:border-blue-500/50 hover:bg-slate-700/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium">{service.name}</p>
                        <div className="flex items-center gap-1 text-amber-400 text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatHours(service.estimatedTime)}
                        </div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 shadow-lg">
        <h2 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Agregar Nuevo Servicio
        </h2>

        {addServiceState ? (
          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Nombre del Servicio
              </label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => {
                  setServiceName(e.target.value);
                  setErrors({ ...errors, name: '' });
                }}
                placeholder="Escribe el nombre del servicio..."
                className={cn(
                  "w-full px-4 py-2.5 rounded-lg",
                  "bg-slate-800/50 border text-white placeholder-slate-400",
                  "focus:outline-none focus:ring-2 transition-all",
                  errors.name
                    ? "border-red-500 focus:ring-red-500/50"
                    : "border-slate-600 focus:ring-blue-500/50 focus:border-blue-500"
                )}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Tiempo Estimado
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="relative">
                    <input
                      type="number"
                      value={serviceHours}
                      onChange={(e) => {
                        setServiceHours(e.target.value);
                        setErrors({ ...errors, hours: '' });
                      }}
                      placeholder="0"
                      min="0"
                      className={cn(
                        "w-full px-4 py-2.5 pr-16 rounded-lg",
                        "bg-slate-800/50 border text-white placeholder-slate-400",
                        "focus:outline-none focus:ring-2 transition-all",
                        errors.hours
                          ? "border-red-500 focus:ring-red-500/50"
                          : "border-slate-600 focus:ring-blue-500/50 focus:border-blue-500"
                      )}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                      horas
                    </span>
                  </div>
                  {errors.hours && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.hours}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      type="number"
                      value={serviceMinutes}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (e.target.value === '' || (value >= 0 && value <= 59)) {
                          setServiceMinutes(e.target.value);
                          setErrors({ ...errors, minutes: '' });
                        }
                      }}
                      placeholder="0"
                      min="0"
                      max="59"
                      className={cn(
                        "w-full px-4 py-2.5 pr-20 rounded-lg",
                        "bg-slate-800/50 border text-white placeholder-slate-400",
                        "focus:outline-none focus:ring-2 transition-all",
                        errors.minutes
                          ? "border-red-500 focus:ring-red-500/50"
                          : "border-slate-600 focus:ring-blue-500/50 focus:border-blue-500"
                      )}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                      minutos
                    </span>
                  </div>
                  {errors.minutes && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.minutes}
                    </p>
                  )}
                </div>
              </div>
              {!errors.hours && !errors.minutes && (
                <p className="text-slate-400 text-xs mt-2">
                  Ejemplo: 2 horas y 30 minutos
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={addService}
                className={cn(
                  "flex-1 px-6 py-3 rounded-lg font-medium",
                  "bg-blue-600 hover:bg-blue-700 text-white",
                  "transition-all duration-200 transform hover:scale-[1.01]",
                  "shadow-lg hover:shadow-xl",
                  "flex items-center justify-center gap-2"
                )}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Agregar Servicio
              </button>
              <button
                onClick={cancelAdd}
                className={cn(
                  "px-6 py-3 rounded-lg font-medium",
                  "bg-red-500 hover:bg-red-600 text-white",
                  "transition-all duration-200 transform hover:scale-[1.01]",
                  "shadow-lg hover:shadow-xl"
                )}
              >
                ✕ Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddServiceState(true)}
            className={cn(
              "w-full flex items-center justify-center gap-3 p-6 rounded-xl",
              "border-2 border-dashed border-blue-400/50 bg-blue-500/10",
              "text-blue-100 hover:text-white transition-all duration-200",
              "hover:bg-blue-500/20 hover:border-blue-400",
              "transform hover:scale-[1.01] shadow-lg hover:shadow-xl"
            )}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-lg font-medium">Crear Servicio Nuevo</span>
          </button>
        )}
      </div>

      {selectedServices.length > 0 && (
        <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl border border-slate-600/50 shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-600/50">
            <div className="flex justify-between items-center">
              <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Servicios Seleccionados ({selectedServices.length})
              </h3>
              <button
                onClick={() => setSelectedServices([])}
                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
              >
                Limpiar todo
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-600/30">
            {selectedServices.map((service, index) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-4 hover:bg-slate-700/30 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-slate-100 font-medium">{service.name}</h4>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        service.isExisting
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-amber-500/20 text-amber-400"
                      )}>
                        {service.isExisting ? 'Existente' : 'Nuevo'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-amber-400 font-semibold text-sm">{formatHours(service.estimatedTime)}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeService(service.id)}
                  className={cn(
                    "p-2 rounded-lg text-red-400 hover:text-red-300",
                    "hover:bg-red-500/10 transition-all duration-200",
                    "opacity-0 group-hover:opacity-100"
                  )}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-600/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">
                Total: <span className="font-semibold text-white">{selectedServices.length}</span>
                {' '}(<span className="text-blue-400">{selectedServices.filter(s => s.isExisting).length} existentes</span>,{' '}
                <span className="text-amber-400">{selectedServices.filter(s => !s.isExisting).length} nuevos</span>)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-300">Tiempo Total:</span>
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-amber-400 text-lg font-bold">
                  {formatTotalTime(getTotalMinutes())}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedServices.length === 0 && (
        <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-12 border border-slate-600/30 text-center">
          <svg className="w-16 h-16 mx-auto text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-slate-400 text-lg">No hay servicios seleccionados</p>
          <p className="text-slate-500 text-sm mt-2">Selecciona servicios existentes o agrega nuevos</p>
        </div>
      )}
    </div>
  );
}
