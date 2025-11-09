import {use} from "react";
import {cn} from "@/app/cn";
import CarDetailCard from "@/app/work-orders/detail/components/CarDetail";
import ClientInfoCard from "@/app/work-orders/detail/components/ClientInfoCard";
import ServicesChecklistCard from "@/app/work-orders/detail/components/ServicesChecklistCard";
import VehiclePhotosCard from "@/app/work-orders/detail/components/VehiclePhotosCard";
import DashboardLightsCard from "@/app/work-orders/detail/components/DashboardLightsCard";
import MechanicsCard from "@/app/work-orders/detail/components/MechanicsCard";

type Car = {
  pattern: string;
  kms: number;
  model: string;
  brand: string;
}

type ClientInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

type Service = {
  name: string;
  time: number; // hours
  completed?: boolean;
}

type DetailWorkOrder = {
  id: number;
  checkInObservations: string;
  tableLights: Array<string>; // url's a los svg
  carPhotos: Array<string>; //url's a las imagenes sacadas del auto
  services: Array<Service>;
  mechanics: Array<string>;
  user: ClientInfo;
  carDetail: Car;
}

const mockWorkOrder: DetailWorkOrder = {
  id: 1,
  checkInObservations: "Cliente solicita revisión general y cambio de aceite. Se reporta ruido en el freno delantero derecho.",
  tableLights: [
    "/icons/check-engine.svg",
    "/icons/oil-pressure.svg",
    "/icons/brake-warning.svg"
  ],
  carPhotos: [
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?w=400",
    "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400",
    "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400"
  ],
  services: [
    { name: "Cambio de aceite y filtro", time: 1, completed: true },
    { name: "Revisión de frenos", time: 2, completed: true },
    { name: "Rotación de neumáticos", time: 1, completed: false },
    { name: "Revisión de suspensión", time: 1.5, completed: false },
    { name: "Cambio de pastillas de freno", time: 2, completed: false }
  ],
  mechanics: ["Juan Pérez", "Carlos Ruiz"],
  user: {
    firstName: "María",
    lastName: "González",
    email: "maria.gonzalez@email.com",
    phoneNumber: "+56 9 1234 5678",
    address: "Av. Principal 123, Santiago"
  },
  carDetail: {
    pattern: "ABC-123",
    kms: 45000,
    model: "Corolla",
    brand: "Toyota"
  }
};

export default function WorkOrderDetail({params}: { params: Promise<{ id: number }> }) {
  const {id} = use(params);

  const workOrder = mockWorkOrder;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Orden de Trabajo #{workOrder.id}
              </h1>
              <p className="text-slate-600 mt-1">
                {workOrder.carDetail.brand} {workOrder.carDetail.model} - {workOrder.carDetail.pattern}
              </p>
            </div>
            <div className="flex gap-3">
              <button className={cn(
                "px-4 py-2 rounded-lg font-medium",
                "bg-white border-2 border-slate-300 text-slate-700",
                "hover:bg-slate-50 transition-colors"
              )}>
                Imprimir
              </button>
              <button className={cn(
                "px-4 py-2 rounded-lg font-medium",
                "bg-blue-600 text-white",
                "hover:bg-blue-700 transition-colors"
              )}>
                Completar Orden
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ClientInfoCard client={workOrder.user} />
              <CarDetailCard car={workOrder.carDetail} />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Observaciones de Ingreso
              </h3>
              <p className="text-slate-700 leading-relaxed">
                {workOrder.checkInObservations}
              </p>
            </div>
            <ServicesChecklistCard services={workOrder.services} />
            <VehiclePhotosCard photos={workOrder.carPhotos} />
          </div>

          <div className="space-y-6">
            <MechanicsCard mechanics={workOrder.mechanics} />
            <DashboardLightsCard lights={workOrder.tableLights} />
          </div>
        </div>
      </div>
    </div>
  );
}