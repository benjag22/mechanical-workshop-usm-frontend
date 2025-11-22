import {Car, Calendar, Hash} from "lucide-react";
import {GetCar} from "@/api";

export default function CarDetailCard({car}: { car: GetCar }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-100 rounded-lg">
          <Car className="w-5 h-5 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          Detalles del Vehículo
        </h3>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-slate-500 mb-1">Patente</p>
          <p className="text-2xl font-bold text-slate-900 tracking-wider uppercase">
            {car.licensePlate}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-sm text-slate-500">Marca</p>
            <p className="text-slate-900 font-medium">{car.brandName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Modelo</p>
            <p className="text-slate-900 font-medium">{car.modelName}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <Car className="w-3 h-3" />
              Tipo
            </p>
            <p className="text-slate-900 font-medium capitalize">
              {car.modelType}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Año
            </p>
            <p className="text-slate-900 font-medium">{car.modelYear}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200">
          <p className="text-sm text-slate-500 flex items-center gap-1 mb-1">
            <Hash className="w-3 h-3" />
            VIN
          </p>
          <p className="text-slate-900 font-mono text-sm break-all">
            {car.VIN}
          </p>
        </div>
      </div>
    </div>
  );
}
