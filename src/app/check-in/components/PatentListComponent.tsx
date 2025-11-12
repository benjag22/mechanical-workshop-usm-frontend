"use client"

import {cn} from "@/app/cn";
import {useState, useEffect} from "react";
import {Search, Car, Plus, Loader2} from "lucide-react";
import NewCarDetailComponent from "./NewCarDetailComponent";
import ExistsCarDetailComponent from "./ExistsCarDetailComponent";
import api from "@/api";

type GetCarResponse = {
  id: number;
  VIN: string;
  licensePlate: string;
  modelId: number;
  modelName: string;
}

type GetCarFullResponse = {
  id: number;
  VIN: string;
  licensePlate: string;
  modelId: number;
  modelName: string;
  modelType: string;
  modelYear: number;
  brandId: number;
  brandName: string;
}

type PatentListComponentProps = {
  onCarDataChange: (carData: {
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
  }) => void;
}

export default function PatentListComponent({ onCarDataChange }: PatentListComponentProps){
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewCarForm, setShowNewCarForm] = useState(false);
  const [selectedCarFull, setSelectedCarFull] = useState<GetCarFullResponse | null>(null);
  const [cars, setCars] = useState<GetCarResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCarDetail, setLoadingCarDetail] = useState(false);

  useEffect(() => {
    async function loadCars() {
      try {
        setLoading(true);
        const response = await api.getAllCars();
        setCars(response.data || []);
      } catch (error) {
        console.error("Error loading cars:", error);
        setCars([]);
      } finally {
        setLoading(false);
      }
    }

    loadCars();
  }, []);

  const filteredCars = cars.filter(car =>
    car.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCarSelect = async (car: GetCarResponse) => {
    try {
      setLoadingCarDetail(true);
      const response = await api.getCarFullById({path: {id: car.id}});

      if (response.data) {
        setSelectedCarFull(response.data);
        setShowNewCarForm(false);
      } else {
        console.error("No se pudieron cargar los detalles del vehículo");
      }
    } catch (error) {
      console.error("Error loading car details:", error);
    } finally {
      setLoadingCarDetail(false);
    }
  };

  const handleNewCar = () => {
    setShowNewCarForm(true);
    setSelectedCarFull(null);
  };

  const handleBack = () => {
    setShowNewCarForm(false);
    setSelectedCarFull(null);
  };

  if (loadingCarDetail) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-gray-400">Cargando detalles del vehículo...</p>
        </div>
      </div>
    );
  }

  if (selectedCarFull) {
    return (
      <ExistsCarDetailComponent
        car={selectedCarFull}
        onBackAction={handleBack}
        onCarDataChange={onCarDataChange}
      />
    );
  }

  if (showNewCarForm) {
    return (
      <NewCarDetailComponent
        prefilledPatent={searchTerm || null}
        onBackAction={handleBack}
        onCarDataChange={onCarDataChange}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-gray-400">Cargando vehículos...</p>
        </div>
      </div>
    );
  }

  return(
    <div className="min-h-full flex flex-col">
      <div className="flex-shrink-0 text-center mb-4 lg:mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-white mb-1 lg:mb-2">Seleccionar Vehículo</h2>
        <p className="text-gray-400 text-sm lg:text-base">Busque la patente o registre un nuevo vehículo</p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col space-y-4 lg:space-y-6">
        <div className="flex-shrink-0 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 lg:w-4 lg:h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar patente (ej: BCDF12)"
            className={cn(
              "w-full pl-10 lg:pl-12 pr-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
              "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
              "transition-all duration-200 hover:border-gray-600/50"
            )}
          />
        </div>

        <div className="p-2 flex-1 min-h-0 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 auto-rows-max">
            <button
              onClick={handleNewCar}
              className={cn(
                "flex w-full items-center justify-center p-3 lg:p-4 bg-blue-600/20 hover:bg-blue-600/30",
                "border-2 border-dashed border-blue-500/50 hover:border-blue-400/70 rounded-lg",
                "text-blue-300 hover:text-blue-200 transition-all duration-200",
                "backdrop-blur-sm hover:scale-[1.001]",
                "min-h-[60px] lg:min-h-[72px]"
              )}
            >
              <Plus className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              <span className="font-medium text-sm lg:text-base">Nuevo Vehículo</span>
            </button>

            {filteredCars.map((car) => (
              <button
                key={car.id}
                onClick={() => handleCarSelect(car)}
                className={cn(
                  "flex w-full items-center p-3 lg:p-4 bg-gray-800/50 hover:bg-gray-700/50",
                  "border border-gray-700/50 hover:border-gray-600/50 rounded-lg",
                  "text-white transition-all duration-200 backdrop-blur-sm hover:scale-[1.001]",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                  "min-h-[60px] lg:min-h-[72px]"
                )}
              >
                <Car className="w-4 h-4 lg:w-5 lg:h-5 mr-3 text-gray-400 flex-shrink-0" />
                <div className="flex flex-col items-start text-left">
                  <span className="font-medium text-sm lg:text-base">{car.licensePlate}</span>
                  <span className="text-xs lg:text-sm text-gray-400">
                                        {car.modelName}
                                    </span>
                </div>
              </button>
            ))}
          </div>

          {filteredCars.length === 0 && searchTerm && (
            <div className="flex items-center justify-center min-h-[200px] lg:min-h-[250px]">
              <div className="text-center">
                <div className="mb-4 lg:mb-6">
                  <Search className="w-12 h-12 lg:w-16 lg:h-16 text-gray-500 mx-auto mb-3 lg:mb-4" />
                </div>
                <p className="text-gray-400 text-sm lg:text-base mb-4 lg:mb-6">
                  No se encontró la patente <span className="font-semibold text-white">{searchTerm}</span>
                </p>
                <button
                  onClick={handleNewCar}
                  className={cn(
                    "px-6 lg:px-8 py-3 lg:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg",
                    "transition-all duration-200 hover:scale-101 text-sm lg:text-base font-medium",
                    "shadow-lg hover:shadow-blue-500/25"
                  )}
                >
                  Registrar nuevo vehículo
                </button>
              </div>
            </div>
          )}

          {!searchTerm && filteredCars.length > 0 && (
            <div className="mt-4 lg:mt-6 text-center">
              <p className="text-gray-500 text-xs lg:text-sm">
                {filteredCars.length} vehículo{filteredCars.length !== 1 ? 's' : ''} registrado{filteredCars.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          {cars.length === 0 && !loading && (
            <div className="flex items-center justify-center min-h-[200px] lg:min-h-[250px]">
              <div className="text-center">
                <div className="mb-4 lg:mb-6">
                  <Car className="w-12 h-12 lg:w-16 lg:h-16 text-gray-500 mx-auto mb-3 lg:mb-4" />
                </div>
                <p className="text-gray-400 text-sm lg:text-base mb-2">
                  No hay vehículos registrados
                </p>
                <p className="text-gray-500 text-xs lg:text-sm mb-4">
                  Comience registrando un nuevo vehículo
                </p>
                <button
                  onClick={handleNewCar}
                  className={cn(
                    "px-6 lg:px-8 py-3 lg:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg",
                    "transition-all duration-200 hover:scale-101 text-sm lg:text-base font-medium",
                    "shadow-lg hover:shadow-blue-500/25"
                  )}
                >
                  Registrar vehículo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
