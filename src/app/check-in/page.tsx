'use client'

import {cn} from "@/app/cn";
import {ReactNode, useCallback, useState} from "react";
import ClientInfoDetailComponent from "@/app/check-in/components/ClientInfoDetailComponent";
import PatentListComponent from "@/app/check-in/components/PatentListComponent";
import ListOfConditionsByType from "@/app/check-in/components/ListOfConditionsByType";
import SelectToolsComponent from "@/app/check-in/components/SelectToolsComponent";
import api, {CreateCheckInRequest, CreateClientRequest } from "@/api";
import {produce} from "immer";
import ErrorDisplay from "@/app/components/ErrorDisplay";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import SuccessMessage from "@/app/components/SuccessMessage";
import { parseApiError, ParsedError } from "@/util/errorParser";

type Section = {
  index: number;
  name: string;
  children: ReactNode;
}

export default function CheckInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ParsedError | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const initialCheckInRequest: CreateCheckInRequest = {
    exteriorConditionsIds: [],
    interiorConditionsIds: [],
    electricalConditionsIds: [],
    newTools: [],
    toolsIds: [],
    reason: "",
    recordState: {
      mileage: 0
    },
    gasLevel: "",
  };

  const [checkInRequest, setCheckInRequest] = useState<CreateCheckInRequest>(initialCheckInRequest);

  const handleClientData = useCallback((clientData: CreateClientRequest) => {
    setCheckInRequest(prev =>
      produce(prev, (draft) => {
        draft.client = clientData;
        draft.clientId = undefined;
      })
    );
  }, []);

  const handleMechanicalConditions = useCallback((conditionIds: number[], type: "INTERIOR" | "EXTERIOR" | "ELECTRICAL") => {
    setCheckInRequest(prev =>
      produce(prev, (draft) => {
        switch (type) {
          case "INTERIOR":
            draft.interiorConditionsIds = conditionIds;
            break;
          case "EXTERIOR":
            draft.exteriorConditionsIds = conditionIds;
            break;
          case "ELECTRICAL":
            draft.electricalConditionsIds = conditionIds;
            break;
        }
      })
    );
  }, []);

  const handleTools = useCallback((toolIds: number[], newTools: string[]) => {
    setCheckInRequest(prev =>
      produce(prev, (draft) => {
        draft.toolsIds = toolIds;
        draft.newTools = newTools.map((tool) => ({name: tool}));
      })
    );
  }, []);

  const handleCarData = useCallback((carData: {
    carId?: number;
    car?: {
      VIN: string;
      licensePlate: string;
    };
    carModelID?: number;
    carModel?: {
      modelName: string;
      modelType: string;
      modelYear?: number;
    };
    carBrandID?: number;
    carBrand?: {
      brandName: string;
    };
    reason: string;
    gasLevel: string;
    mileage: number;
  }) => {
    setCheckInRequest(prev =>
      produce(prev, (draft) => {
        draft.carId = undefined;
        draft.car = undefined;
        draft.carModelID = undefined;
        draft.carModel = undefined;
        draft.carBrandID = undefined;
        draft.carBrand = undefined;

        if (carData.carId) {
          draft.carId = carData.carId;
        }
        else if (carData.car) {
          draft.car = carData.car;

          if (carData.carModelID) {
            draft.carModelID = carData.carModelID;
          }
          else if (carData.carModel) {
            draft.carModel = carData.carModel;

            if (carData.carBrandID) {
              draft.carBrandID = carData.carBrandID;
            }
            else if (carData.carBrand) {
              draft.carBrand = carData.carBrand;
            }
          }
        }

        draft.reason = carData.reason;
        draft.gasLevel = carData.gasLevel;
        draft.recordState.mileage = carData.mileage;
      })
    );
  }, []);

  const sections: Section[] = [
    {
      index: 0,
      name: "Información del Cliente",
      children: <ClientInfoDetailComponent key={`client-${formKey}`} onClientDataChange={handleClientData} />
    },
    {
      index: 1,
      name: "Detalles del Vehículo",
      children: <PatentListComponent key={`patent-${formKey}`} onCarDataChange={handleCarData} />
    },
    {
      index: 2,
      name: "Condiciones de Interior",
      children: (
        <ListOfConditionsByType
          key={`interior-${formKey}`}
          type="INTERIOR"
          onConditionsChange={handleMechanicalConditions}
        />
      )
    },
    {
      index: 3,
      name: "Condiciones de Exterior",
      children: (
        <ListOfConditionsByType
          key={`exterior-${formKey}`}
          type="EXTERIOR"
          onConditionsChange={handleMechanicalConditions}
        />
      )
    },
    {
      index: 4,
      name: "Condiciones Eléctricas",
      children: (
        <ListOfConditionsByType
          key={`electrical-${formKey}`}
          type="ELECTRICAL"
          onConditionsChange={handleMechanicalConditions}
        />
      )
    },
    {
      index: 5,
      name: "Herramientas",
      children: (
        <SelectToolsComponent
          key={`tools-${formKey}`}
          onToolsChange={handleTools}
          selectedToolIds={checkInRequest.toolsIds}
          selectedNewTools={checkInRequest.newTools.map(t => t.name)}
        />
      )
    }
  ];

  const [nSections, setNSections] = useState<number>(0);

  const resetForm = useCallback(() => {
    setCheckInRequest(initialCheckInRequest);
    setNSections(0);
    setFormKey(prev => prev + 1);
  }, []);

  async function handleFinish() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.createCheckIn({body: checkInRequest});

      if (response.data) {
        setShowSuccess(true);
      } else if (response.error) {
        const parsedError = parseApiError(response.error, "Error al procesar el check-in");
        setError(parsedError);
      }
    } catch (err) {
      const parsedError = parseApiError(err, "Error inesperado al realizar el check-in");
      setError(parsedError);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSuccessClose = useCallback(() => {
    setShowSuccess(false);
    resetForm();
  }, [resetForm]);

  function renderButtons(n: number) {
    const isFirstStep = n === 0;
    const isLastStep = n === sections.length - 1;

    return (
      <div className={cn("flex items-center gap-4")}>
        {!isFirstStep && (
          <button
            onClick={() => setNSections(prev => prev - 1)}
            disabled={isLoading}
            className={cn(
              "px-6 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-md",
              "transition-all duration-200 ease-in-out font-medium text-sm",
              "shadow-sm hover:shadow-md flex items-center gap-2",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <svg className={cn("w-4 h-4")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Atrás
          </button>
        )}

        {isLastStep ? (
          <button
            onClick={handleFinish}
            disabled={isLoading}
            className={cn(
              "px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md",
              "transition-all duration-200 ease-in-out font-medium text-sm",
              "shadow-sm hover:shadow-md flex items-center gap-2",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <svg className={cn("w-4 h-4")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Finalizar Check-in
          </button>
        ) : (
          <button
            onClick={() => setNSections(prev => prev + 1)}
            disabled={isLoading}
            className={cn(
              "px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md",
              "transition-all duration-200 ease-in-out font-medium text-sm",
              "shadow-sm hover:shadow-md flex items-center gap-2",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            Siguiente
            <svg className={cn("w-4 h-4")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <LoadingSpinner
          title="Procesando check-in..."
          subtitle="Por favor espere"
        />
      )}

      <ErrorDisplay
        error={error}
        onClose={() => setError(null)}
      />

      {showSuccess && (
        <SuccessMessage
          onClose={handleSuccessClose}
          title="¡Check-in exitoso!"
          message="El check-in se ha registrado correctamente"
          buttonText="Aceptar"
        />
      )}

      <div className={cn("flex flex-col bg-slate-800 w-full h-screen")}>
        <div className={cn("flex flex-col px-8 py-6 bg-slate-700/30 border-b border-slate-600/50")}>
          <div className={cn("flex items-center justify-center space-x-3 overflow-x-auto pb-2")}>
            {sections.map((s, index) => (
              <div key={s.index} className={cn("flex items-center flex-shrink-0")}>
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full",
                  "transition-all duration-300 ease-in-out text-sm font-medium",
                  nSections === s.index
                    ? "bg-blue-600 text-white shadow-lg ring-2 ring-blue-400"
                    : nSections > s.index
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-600 text-slate-300"
                )}>
                  {nSections > s.index ? (
                    <svg className={cn("w-5 h-5")} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span>{s.index + 1}</span>
                  )}
                </div>

                {index < sections.length - 1 && (
                  <div className={cn(
                    "w-12 h-0.5 mx-2 transition-all duration-300 rounded-full",
                    nSections > s.index
                      ? "bg-emerald-600"
                      : "bg-slate-600"
                  )} />
                )}
              </div>
            ))}
          </div>

          <div className={cn("flex flex-col items-center justify-center mt-4 space-y-1")}>
            <p className={cn("text-slate-300 text-sm font-medium")}>
              Paso {nSections + 1} de {sections.length}
            </p>
            <p className={cn("text-slate-400 text-xs")}>
              {sections[nSections].name}
            </p>
          </div>
        </div>

        <div className={cn("flex-1 bg-slate-700/20 m-3 rounded-lg overflow-hidden")}>
          <div className={cn("h-full flex flex-col p-4 overflow-y-auto")}>
            {sections.map((section) => (
              <div
                key={section.index}
                className={cn(
                  "w-full h-full transition-opacity duration-300",
                  nSections === section.index ? "block" : "hidden"
                )}
              >
                {section.children}
              </div>
            ))}
          </div>
        </div>

        <div className={cn("px-8 py-6 bg-slate-700/30 border-t border-slate-600/50")}>
          <div className={cn("flex items-center justify-center")}>
            {renderButtons(nSections)}
          </div>
        </div>
      </div>
    </>
  );
}
