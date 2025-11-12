'use client'

import {cn} from "@/app/cn";
import {ReactNode, useCallback, useState} from "react";
import ClientInfoDetailComponent from "@/app/check-in/components/ClientInfoDetailComponent";
import PatentListComponent from "@/app/check-in/components/PatentListComponent";
import ListOfConditionsComponent from "@/app/check-in/components/ListOfConditionsComponent";
import SelectToolsComponent from "@/app/check-in/components/SelectToolsComponent";
import api, {CreateCheckInRequest, CreateClientRequest} from "@/api";
import {produce} from "immer";

type Section = {
  index: number;
  name: string;
  children: ReactNode;
}

export default function CheckInPage() {
  const [checkInRequest, setCheckInRequest] = useState<CreateCheckInRequest>({
    mechanicalConditionsIds: [],
    newTools: [],
    toolsIds: [],
    reason: "",
    recordState: {
      entryDate: new Date().toISOString(),
      entryTime: new Date().toISOString(),
      mileage: 0
    },
    gasLevel: "",
  });
  const handleClientData = useCallback((clientData: CreateClientRequest) => {
    setCheckInRequest(prev =>
      produce(prev, (draft) => {
        draft.client = clientData;
        draft.clientId = undefined;
      })
    );
  }, []);

  const handleMechanicalConditions = useCallback((conditionIds: number[]) => {
    setCheckInRequest(prev =>
      produce(prev, (draft) => {
        draft.mechanicalConditionsIds = conditionIds;
      })
    );
  }, []);

  console.log(checkInRequest)

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
      modelId?: number;
    };
    carModel?: {
      modelName: string;
      modelType: string;
      modelYear?: number;
      brandId?: number;
    };
    carBrand?: {
      brandName: string;
    };
    reason: string;
    gasLevel: string;
    mileage: number;
  }) => {
    setCheckInRequest(prev =>
      produce(prev, (draft) => {
        if (carData.carId) {
          draft.carId = carData.carId;
          draft.car = undefined;
          draft.carModel = undefined;
          draft.carBrand = undefined;
        }
        else if (carData.car) {
          draft.carId = undefined;
          draft.car = carData.car;
          draft.carModel = carData.carModel;
          draft.carBrand = carData.carBrand;
        }
        draft.reason = carData.reason;
        draft.gasLevel = carData.gasLevel;
        draft.recordState.mileage = carData.mileage;
        draft.recordState.entryDate = new Date().toISOString();
        draft.recordState.entryTime = new Date().toISOString();
      })
    );
  }, []);

  const sections: Section[] = [
    {
      index: 0,
      name: "Client information",
      children: <ClientInfoDetailComponent onClientDataChange={handleClientData} />
    },
    {
      index: 1,
      name: "Car detail",
      children: <PatentListComponent
        onCarDataChange={handleCarData}
      />
    },
    {
      index: 2,
      name: "Car condition",
      children: <ListOfConditionsComponent
        onConditionsChange={handleMechanicalConditions}
        selectedConditionIds={checkInRequest.mechanicalConditionsIds}
      />
    },
    {
      index: 3,
      name: "Tools",
      children: <SelectToolsComponent
        onToolsChange={handleTools}
        selectedToolIds={checkInRequest.toolsIds}
        selectedNewTools={checkInRequest.newTools.map(t => t.name)}
      />
    }
  ]

  const [nSections, setNSections] = useState<number>(0);

  async function handleFinish() {
    try {
      await api.createCheckIn({body:checkInRequest})

    } catch (error) {
      console.error(error);
    }
  }

  function renderButtons(n: number) {
    switch (n) {
      case 0:
        return (
          <button
            onClick={() => setNSections(prevState => prevState + 1)}
            className={cn(
              "px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md",
              "transition-all duration-200 ease-in-out font-medium text-sm",
              "shadow-sm hover:shadow-md"
            )}
          >
            Siguiente
          </button>
        )
      case sections.length - 1:
        return (
          <>
            <button
              onClick={() => setNSections(prevState => prevState - 1)}
              className={cn(
                "px-6 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-md",
                "transition-all duration-200 ease-in-out font-medium text-sm",
                "shadow-sm hover:shadow-md"
              )}
            >
              Atrás
            </button>
            <button
              onClick={handleFinish}
              className={cn(
                "px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md",
                "transition-all duration-200 ease-in-out font-medium text-sm",
                "shadow-sm hover:shadow-md"
              )}
            >
              Finalizar
            </button>
          </>
        )
      default:
        return (
          <>
            <button
              onClick={() => setNSections(prevState => prevState - 1)}
              className={cn(
                "px-6 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-md",
                "transition-all duration-200 ease-in-out font-medium text-sm",
                "shadow-sm hover:shadow-md"
              )}
            >
              Atrás
            </button>
            <button
              onClick={() => setNSections(prevState => prevState + 1)}
              className={cn(
                "px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md",
                "transition-all duration-200 ease-in-out font-medium text-sm",
                "shadow-sm hover:shadow-md"
              )}
            >
              Siguiente
            </button>
          </>
        )
    }
  }

  return (
    <div className={cn("flex flex-col bg-slate-800 w-full h-screen")}>
      <div className={cn("flex flex-col px-8 py-6 bg-slate-700/30")}>
        <div className={cn("flex items-center justify-center space-x-3")}>
          {sections.map((s, index) => (
            <div key={s.index} className={cn("flex items-center")}>
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full",
                "transition-all duration-300 ease-in-out text-sm font-medium",
                nSections === s.index
                  ? "bg-blue-600 text-white shadow-lg"
                  : nSections > s.index
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-600 text-slate-300"
              )}>
                {nSections > s.index ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span>{s.index + 1}</span>
                )}
              </div>

              {index < sections.length - 1 && (
                <div className={cn(
                  "w-8 h-0.5 mx-2 transition-all duration-300",
                  nSections > s.index
                    ? "bg-emerald-600"
                    : "bg-slate-600"
                )} />
              )}
            </div>
          ))}
        </div>

        <div className={cn("flex items-center justify-center mt-4")}>
          <p className={cn("text-slate-300 text-sm")}>
            Paso {nSections + 1} de {sections.length}
          </p>
        </div>
      </div>

      <div className={cn("flex-1 bg-slate-700/20 m-3 rounded-lg overflow-hidden")}>
        <div className={cn("h-full flex flex-col p-4 overflow-y-auto")}>
          {sections.map((section) => (
            <div
              key={section.index}
              className={cn(
                "w-full h-full",
                nSections === section.index ? "block" : "hidden"
              )}
            >
              {section.children}
            </div>
          ))}
        </div>
      </div>

      <div className={cn("px-8 py-6 bg-slate-700/30")}>
        <div className={cn("flex items-center justify-center space-x-4")}>
          {renderButtons(nSections)}
        </div>
      </div>
    </div>
  )
}