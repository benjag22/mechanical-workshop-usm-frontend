"use client"

import {cn} from "@/app/cn";
import React, {useState, useEffect} from "react";
import {Car, Hash, Calendar, Gauge, Fuel, FileText, ArrowLeft, Tag, Loader2} from "lucide-react";
import api, {GetCarModelResponse, SingleCarBrandResponse} from "@/api";

type NewCarData = {
  VIN: string;
  licensePlate: string;
  modelId?: number;
  modelName: string;
  modelType: string;
  modelYear?: number;
  brandId?: number;
  brandName?: string;
  isNewBrand: boolean;
  isNewModel: boolean;
  reason: string;
  mileage: number;
  fuelLevel: string;
}

type NewCarDetailComponentProps = {
  prefilledPatent?: string | null;
  onBackAction: () => void;
  onCarDataChange: (carData: {
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
  }) => void;
}

export default function NewCarDetailComponent({ prefilledPatent, onBackAction, onCarDataChange }: NewCarDetailComponentProps){
  const [carData, setCarData] = useState<NewCarData>({
    VIN: '',
    licensePlate: prefilledPatent || '',
    modelId: undefined,
    modelName: '',
    modelType: '',
    modelYear: undefined,
    brandId: undefined,
    brandName: '',
    isNewBrand: false,
    isNewModel: false,
    reason: '',
    mileage: 0,
    fuelLevel: "FULL"
  });

  const [brands, setBrands] = useState<SingleCarBrandResponse[]>([]);
  const [allModels, setAllModels] = useState<GetCarModelResponse[]>([]);
  const [filteredModels, setFilteredModels] = useState<GetCarModelResponse[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);

  useEffect(() => {
    async function loadBrands() {
      try {
        setLoadingBrands(true);
        const brandsResponse = await api.getAllCarBrands();
        const modelsResponse = await api.getAllCarModels();

        if(brandsResponse && modelsResponse){
          setBrands(brandsResponse.data ?? []);
          setAllModels(modelsResponse.data ?? []);
        }
      } catch (error) {
        console.error(error);
        setBrands([]);
        setAllModels([]);
      } finally {
        setLoadingBrands(false);
      }
    }

    loadBrands();
  }, []);

  useEffect(() => {
    if (carData.brandId && !carData.isNewBrand) {
      const modelsForBrand = allModels.filter(model => model.brandId === carData.brandId);
      setFilteredModels(modelsForBrand);
    } else {
      setFilteredModels([]);
    }
  }, [carData.brandId, carData.isNewBrand, allModels]);

  useEffect(() => {
    if (carData.VIN && carData.licensePlate && carData.modelName && carData.modelType) {
      const updateData: {
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
      } = {
        reason: carData.reason,
        gasLevel: carData.fuelLevel,
        mileage: carData.mileage
      };

      if (!carData.isNewModel && carData.modelId) {
        updateData.carModelID = carData.modelId;
        updateData.car = {
          VIN: carData.VIN,
          licensePlate: carData.licensePlate,
        };
      }

      else if (carData.isNewModel) {
        updateData.car = {
          VIN: carData.VIN,
          licensePlate: carData.licensePlate,
        };
        updateData.carModel = {
          modelName: carData.modelName,
          modelType: carData.modelType,
          modelYear: carData.modelYear,
        };

        if (!carData.isNewBrand && carData.brandId) {
          updateData.carBrandID = carData.brandId;
        }

        else if (carData.isNewBrand && carData.brandName) {
          updateData.carBrand = {
            brandName: carData.brandName
          };
        }
      }

      onCarDataChange(updateData);
    }
  }, [carData, onCarDataChange]);

  const handleInputChange = (field: keyof NewCarData, value: string | number | boolean | undefined) => {
    setCarData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBrandChange = (value: string) => {
    if (value === "new") {
      setCarData(prev => ({
        ...prev,
        isNewBrand: true,
        brandId: undefined,
        brandName: '',
        modelId: undefined,
        modelName: '',
        modelType: '',
        modelYear: undefined,
        isNewModel: true
      }));
    } else if (value) {
      const brandId = parseInt(value);
      setCarData(prev => ({
        ...prev,
        isNewBrand: false,
        brandId: brandId,
        brandName: '',
        modelId: undefined,
        modelName: '',
        modelType: '',
        modelYear: undefined,
        isNewModel: false
      }));
    } else {
      setCarData(prev => ({
        ...prev,
        isNewBrand: false,
        brandId: undefined,
        brandName: '',
        modelId: undefined,
        modelName: '',
        modelType: '',
        modelYear: undefined,
        isNewModel: false
      }));
    }
  };

  const handleModelChange = (value: string) => {
    if (value === "new") {
      setCarData(prev => ({
        ...prev,
        isNewModel: true,
        modelId: undefined,
        modelName: '',
        modelType: '',
        modelYear: undefined
      }));
    } else if (value) {
      const modelId = parseInt(value);
      const selectedModel = allModels.find(m => m.id === modelId);

      if (selectedModel) {
        setCarData(prev => ({
          ...prev,
          isNewModel: false,
          modelId: modelId,
          modelName: selectedModel.modelName,
          modelType: selectedModel.modelType,
          modelYear: selectedModel.modelYear
        }));
      }
    } else {
      setCarData(prev => ({
        ...prev,
        isNewModel: false,
        modelId: undefined,
        modelName: '',
        modelType: '',
        modelYear: undefined
      }));
    }
  };

  return(
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center mb-2 lg:mb-4">
        <button
          onClick={onBackAction}
          className={cn(
            "flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 mr-4",
            "bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-all duration-200"
          )}
        >
          <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
        </button>
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-white">Nuevo Vehículo</h2>
          <p className="text-gray-400 text-sm lg:text-base">Complete la información del vehículo</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 lg:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div className="space-y-1 lg:space-y-2">
              <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                <Tag className="w-3 h-3 lg:w-4 lg:h-4" />
                Patente <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={carData.licensePlate}
                onChange={(e) => handleInputChange('licensePlate', e.target.value.toUpperCase())}
                className={cn(
                  "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                  "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base uppercase",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                  "transition-all duration-200 hover:border-gray-600/50"
                )}
                placeholder="BCDF12"
                maxLength={6}
              />
            </div>

            <div className="space-y-1 lg:space-y-2">
              <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                <Hash className="w-3 h-3 lg:w-4 lg:h-4" />
                VIN <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={carData.VIN}
                onChange={(e) => handleInputChange('VIN', e.target.value.toUpperCase())}
                className={cn(
                  "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                  "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base uppercase",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                  "transition-all duration-200 hover:border-gray-600/50"
                )}
                placeholder="1HGBH41JXMN109186"
                maxLength={17}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div className="space-y-1 lg:space-y-2">
              <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                <Car className="w-3 h-3 lg:w-4 lg:h-4" />
                Marca <span className="text-red-400">*</span>
              </label>
              {loadingBrands ? (
                <div className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  <span className="text-gray-400 text-sm">Cargando marcas...</span>
                </div>
              ) : (
                <select
                  value={carData.isNewBrand ? "new" : (carData.brandId?.toString() || "")}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className={cn(
                    "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                    "text-white backdrop-blur-sm text-sm lg:text-base",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                    "transition-all duration-200 hover:border-gray-600/50"
                  )}
                >
                  <option value="">Seleccione una marca</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>{brand.brandName}</option>
                  ))}
                  <option value="new"> Nueva Marca</option>
                </select>
              )}
            </div>

            {carData.isNewBrand && (
              <div className="space-y-1 lg:space-y-2">
                <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Car className="w-3 h-3 lg:w-4 lg:h-4" />
                  Nombre de Nueva Marca <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={carData.brandName}
                  onChange={(e) => handleInputChange('brandName', e.target.value)}
                  className={cn(
                    "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                    "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                    "transition-all duration-200 hover:border-gray-600/50"
                  )}
                  placeholder="Toyota, Honda, Ford..."
                />
              </div>
            )}

            {!carData.isNewBrand && carData.brandId && (
              <div className="space-y-1 lg:space-y-2">
                <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Car className="w-3 h-3 lg:w-4 lg:h-4" />
                  Modelo <span className="text-red-400">*</span>
                </label>
                <select
                  value={carData.isNewModel ? "new" : (carData.modelId?.toString() || "")}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className={cn(
                    "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                    "text-white backdrop-blur-sm text-sm lg:text-base",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                    "transition-all duration-200 hover:border-gray-600/50"
                  )}
                >
                  <option value="">Seleccione un modelo</option>
                  {filteredModels.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.modelName} {model.modelYear ? `(${model.modelYear})` : ''}
                    </option>
                  ))}
                  <option value="new">Nuevo Modelo</option>
                </select>
              </div>
            )}
          </div>

          {(carData.isNewBrand || carData.isNewModel) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-1 lg:space-y-2">
                <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Car className="w-3 h-3 lg:w-4 lg:h-4" />
                  Nombre del Modelo <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={carData.modelName}
                  onChange={(e) => handleInputChange('modelName', e.target.value)}
                  className={cn(
                    "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                    "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                    "transition-all duration-200 hover:border-gray-600/50"
                  )}
                  placeholder="Corolla, Civic, Focus..."
                />
              </div>

              <div className="space-y-1 lg:space-y-2">
                <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Car className="w-3 h-3 lg:w-4 lg:h-4" />
                  Tipo de Vehículo <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={carData.modelType}
                  onChange={(e) => handleInputChange('modelType', e.target.value)}
                  className={cn(
                    "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                    "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                    "transition-all duration-200 hover:border-gray-600/50"
                  )}
                  placeholder="Sedán, SUV, Hatchback..."
                />
              </div>

              <div className="space-y-1 lg:space-y-2">
                <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
                  Año
                </label>
                <input
                  type="number"
                  value={carData.modelYear || ''}
                  onChange={(e) => handleInputChange('modelYear', e.target.value ? parseInt(e.target.value) : undefined)}
                  className={cn(
                    "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                    "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                    "transition-all duration-200 hover:border-gray-600/50"
                  )}
                  placeholder="2024"
                  min={1900}
                  max={new Date().getFullYear() + 1}
                />
              </div>
            </div>
          )}

          <div className="space-y-1 lg:space-y-2">
            <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
              <FileText className="w-3 h-3 lg:w-4 lg:h-4" />
              Motivo de Ingreso
            </label>
            <textarea
              value={carData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              className={cn(
                "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                "transition-all duration-200 hover:border-gray-600/50",
                "resize-none h-16 lg:h-20"
              )}
              placeholder="Describa el motivo del ingreso del vehículo"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div className="space-y-1 lg:space-y-2">
              <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                <Gauge className="w-3 h-3 lg:w-4 lg:h-4" />
                Kilometraje
              </label>
              <input
                type="number"
                value={carData.mileage || ''}
                onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
                className={cn(
                  "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                  "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                  "transition-all duration-200 hover:border-gray-600/50"
                )}
                placeholder="Ej: 45000"
              />
            </div>

            <div className="space-y-1 lg:space-y-2">
              <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                <Fuel className="w-3 h-3 lg:w-4 lg:h-4" />
                Nivel de Combustible
              </label>
              <select
                value={carData.fuelLevel}
                onChange={(e) => handleInputChange('fuelLevel', e.target.value)}
                className={cn(
                  "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                  "text-white backdrop-blur-sm text-sm lg:text-base",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                  "transition-all duration-200 hover:border-gray-600/50"
                )}
              >
                <option value="FULL">Lleno</option>
                <option value="THREE_QUARTERS">3/4</option>
                <option value="HALF">1/2</option>
                <option value="ONE_QUARTER">1/4</option>
                <option value="LOW">Reserva</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
