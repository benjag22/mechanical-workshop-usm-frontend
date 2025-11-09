import {Car} from "lucide-react";

type CarDetail = {
  pattern: string;
  kms: number;
  model: string;
  brand: string;
}

export default function CarDetailCard({car}: { car: CarDetail }) {
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
          <p className="text-2xl font-bold text-slate-900 tracking-wider">
            {car.pattern}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-sm text-slate-500">Marca</p>
            <p className="text-slate-900 font-medium">{car.brand}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Modelo</p>
            <p className="text-slate-900 font-medium">{car.model}</p>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-sm text-slate-500">Kilometraje</p>
          <p className="text-slate-900 font-medium">
            {car.kms.toLocaleString()} km
          </p>
        </div>
      </div>
    </div>
  );
}
