'use client'

import {use, useEffect, useState} from "react";
import {cn} from "@/app/cn";
import CarDetailCard from "@/app/work-orders/detail/components/CarDetail";
import ClientInfoCard from "@/app/work-orders/detail/components/ClientInfoCard";
import ServicesChecklistCard from "@/app/work-orders/detail/components/ServicesChecklistCard";
import VehiclePhotosCard from "@/app/work-orders/detail/components/VehiclePhotosCard";
import DashboardLightsCard from "@/app/work-orders/detail/components/DashboardLightsCard";
import MechanicsCard from "@/app/work-orders/detail/components/MechanicsCard";
import api, {GetWorkOrderFull} from "@/api"
import LoadingSpinner from "@/app/components/LoadingSpinner";

async function getOrderDetail(workOrderId:number, set:(data: GetWorkOrderFull | null) => void){
  try {
    const response = await api.getWorkOrderFullById({path:{id:workOrderId}})
    if (response.data){
      set(response.data)
    }else{
      set(null)
    }
  }catch(error){
    console.log(error);
  }
}

export default function WorkOrderDetail({params}: { params: Promise<{ id: number }> }) {
  const {id} = use(params);
  const [workOrder, setWorkOrder] = useState<null | GetWorkOrderFull>(null);

  useEffect(()=>{
    getOrderDetail(id,setWorkOrder)
  }, [])
  if(!workOrder) {
    return (
      <LoadingSpinner title={"Cargando Orden de trabajo..."} subtitle={"Porfavor espere"}></LoadingSpinner>
    )
  }
  console.log(workOrder.services)
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
                {workOrder.vehicle.brandName} {workOrder.vehicle.modelName} - {workOrder.vehicle.licensePlate}
              </p>
            </div>
            <div className="flex gap-3">
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
              <ClientInfoCard client={workOrder.customer} />
              <CarDetailCard car={workOrder.vehicle} />
            </div>
            <ServicesChecklistCard services={workOrder.services} />
            <VehiclePhotosCard photos={workOrder.carImages} />
          </div>

          <div className="space-y-6">
            <MechanicsCard mechanics={workOrder.mechanics} />
            <DashboardLightsCard lights={workOrder.dashboardLights ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}
