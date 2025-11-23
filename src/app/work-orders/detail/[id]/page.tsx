'use client'

import {use, useEffect, useState} from "react";
import {cn} from "@/app/cn";
import CarDetailCard from "@/app/work-orders/detail/components/CarDetail";
import ClientInfoCard from "@/app/work-orders/detail/components/ClientInfoCard";
import ServicesChecklistCard from "@/app/work-orders/detail/components/ServicesChecklistCard";
import VehiclePhotosCard from "@/app/work-orders/detail/components/VehiclePhotosCard";
import DashboardLightsCard from "@/app/work-orders/detail/components/DashboardLightsCard";
import MechanicsCard from "@/app/work-orders/detail/components/MechanicsCard";
import CheckOutCard from "@/app/work-orders/detail/components/CheckOutCard";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import CheckOutModal from "@/app/work-orders/detail/components/CheckOutModal";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import SuccessMessage from "@/app/components/SuccessMessage";
import api, {GetWorkOrderFull, CreateCheckOutRequest} from "@/api"
import {CheckCircle, ClipboardCheck} from "lucide-react";

async function completeWorkOrder(workOrderId: number) {
  try {
    const response = await api.markWorkOrderAsCompleted({path:{workOrderId}})
    return response;
  } catch (e) {
    console.error(e)
    throw e;
  }
}

async function generateCheckOut(data: CreateCheckOutRequest ){
  try {
    const response = await api.createCheckOut({body:data})
    return response;
  }catch (e) {
    console.error( e)
    throw e;
  }
}

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
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
  const [isConfirmCompleteOpen, setIsConfirmCompleteOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showSuccessComplete, setShowSuccessComplete] = useState(false);
  const [showSuccessCheckOut, setShowSuccessCheckOut] = useState(false);

  useEffect(()=>{
    getOrderDetail(id,setWorkOrder)
  }, [id])

  const handleCompleteOrder = async () => {
    if (!workOrder) return;

    setIsCompleting(true);
    try {
      await completeWorkOrder(workOrder.id);
      await getOrderDetail(id, setWorkOrder);
      setShowSuccessComplete(true);
    } catch (error) {
      console.log(error)
    } finally {
      setIsCompleting(false);
    }
  };

  const handleCheckOut = async (data: CreateCheckOutRequest) => {
    try {
      await generateCheckOut(data);
      setIsCheckOutModalOpen(false);
      await getOrderDetail(id, setWorkOrder);
      setShowSuccessCheckOut(true);
    } catch (error) {
      throw error;
    }
  };

  if(!workOrder) {
    return (
      <LoadingSpinner title={"Cargando Orden de trabajo..."} subtitle={"Porfavor espere"}></LoadingSpinner>
    )
  }

  const hasCheckOut = !!workOrder.checkOut;

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
              <div className="flex gap-2 mt-2">
                {workOrder.completed && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    <CheckCircle className="w-4 h-4" />
                    Completada
                  </span>
                )}
                {hasCheckOut && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    <ClipboardCheck className="w-4 h-4" />
                    Check Out Realizado
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              {!hasCheckOut && (
                <button
                  onClick={() => setIsCheckOutModalOpen(true)}
                  disabled={isCompleting}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium flex items-center gap-2",
                    "bg-blue-700 text-white",
                    "hover:bg-blue-800 transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  <ClipboardCheck className="w-5 h-5" />
                  Generar Check Out
                </button>
              )}

              <button
                onClick={() => setIsConfirmCompleteOpen(true)}
                disabled={isCompleting || workOrder.completed}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium flex items-center gap-2",
                  "bg-green-600 text-white",
                  "hover:bg-green-700 transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <CheckCircle className="w-5 h-5" />
                {isCompleting ? "Completando..." : workOrder.completed ? "Completada" : "Completar Orden"}
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
            <ServicesChecklistCard
              isCompleted={workOrder.completed}
              workOrderId={workOrder.id}
              services={workOrder.services}
            />
            <VehiclePhotosCard photos={workOrder.carImages} />
          </div>

          <div className="space-y-6">
            <MechanicsCard mechanics={workOrder.mechanics} />
            <DashboardLightsCard lights={workOrder.dashboardLights ?? []} />
            {hasCheckOut && workOrder.checkOut && (
              <CheckOutCard checkOut={workOrder.checkOut} />
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmCompleteOpen}
        onClose={() => setIsConfirmCompleteOpen(false)}
        onConfirm={handleCompleteOrder}
        title="¿Completar Orden de Trabajo?"
        message={`¿Está seguro de que desea marcar la orden #${workOrder.id} como completada? Esta acción indica que todos los trabajos han sido finalizados.`}
        confirmText="Sí, Completar"
        cancelText="Cancelar"
        isDangerous={false}
      />

      {!hasCheckOut && (
        <CheckOutModal
          isOpen={isCheckOutModalOpen}
          onClose={() => setIsCheckOutModalOpen(false)}
          onSubmit={handleCheckOut}
          workOrderId={workOrder.id}
        />
      )}

      {showSuccessComplete && (
        <SuccessMessage
          onClose={() => setShowSuccessComplete(false)}
          title="¡Orden Completada!"
          message={`La orden de trabajo #${workOrder.id} ha sido marcada como completada exitosamente.`}
          buttonText="Entendido"
          icon={<CheckCircle className="w-10 h-10 text-emerald-500" />}
        />
      )}

      {showSuccessCheckOut && (
        <SuccessMessage
          onClose={() => setShowSuccessCheckOut(false)}
          title="¡Check Out Generado!"
          message={`El check out para la orden #${workOrder.id} ha sido generado exitosamente.`}
          buttonText="Entendido"
          icon={<ClipboardCheck className="w-10 h-10 text-emerald-500" />}
        />
      )}
    </div>
  );
}
