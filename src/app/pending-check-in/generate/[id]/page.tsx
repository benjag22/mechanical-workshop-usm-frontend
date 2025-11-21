'use client'

import {ReactNode, use, useCallback, useState} from 'react'
import {cn} from "@/app/cn"
import DrawableCanvas from "@/app/components/DrawableCanvas"
import ImageGallery, {ImageFile} from "@/app/components/ImageGallery"
import SelectServices from "@/app/pending-check-in/components/SelectServices"
import SummaryIndicatorLights from "@/app/pending-check-in/components/SummaryIndicatorLights"
import SelectMechanics from "@/app/pending-check-in/components/SelectMechanics"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import SuccessMessage from "@/app/components/SuccessMessage"
import ErrorDisplay from "@/app/components/ErrorDisplay"
import api, {
  CreateMechanicRequest,
  CreateWorkOrderHasDashboardLightRequest,
  CreateWorkOrderRequest,
  CreateWorkServiceRequest
} from "@/api"
import {produce} from "immer"
import {parseApiError, ParsedError} from "@/util/errorParser"
import {useRouter} from "next/navigation"

type Section = {
  index: number
  name: string
  children?: ReactNode
}

export default function GenerateByIdCheckIn({params}: { params: Promise<{ id: number }> }) {
  const {id} = use(params)
  const router = useRouter()
  const [nSections, setNSections] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<ParsedError | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const [signature, setSignature] = useState<File | null>(null)
  const [carImages, setCarImages] = useState<ImageFile[]>([])

  const initialRequest: CreateWorkOrderRequest = {
    recordId: +id,
    mechanicIds: [],
    newMechanics: []
  }

  const [request, setRequest] = useState<CreateWorkOrderRequest>(initialRequest)

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    const hasMechanics = (request.mechanicIds && request.mechanicIds.length > 0) ||
      (request.newMechanics && request.newMechanics.length > 0)
    const hasLeader = request.leaderMechanicId || request.newLeaderMechanic

    if (!hasMechanics && !hasLeader) {
      errors.push('Debes seleccionar al menos un mecánico')
    }

    const hasServices = (request.serviceIds && request.serviceIds.length > 0) ||
      (request.newServices && request.newServices.length > 0)

    if (!hasServices) {
      errors.push('Debes seleccionar al menos un servicio')
    }

    if (!signature) {
      errors.push('Debes firmar antes de finalizar')
    }

    if (carImages.length === 0) {
      errors.push('Debes agregar al menos una imagen del vehículo')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  async function sendData() {
    setIsSubmitting(true)
    setError(null)

    try {
      const validation = validateForm()

      if (!validation.isValid) {
        setError({
          message: "Por favor completa todos los campos requeridos",
          fieldErrors: validation.errors.map(err => ({
            field: "Validación",
            message: err
          }))
        })
        return
      }

      const payload = {
        payload: request,
        carPictures: carImages.map((image) => image.file),
        signature: signature ? signature : new File([], "signature"),
      }

      const response = await api.createFull({body: payload})

      if (response.data) {
        setShowSuccess(true)
      } else if (response.error) {
        const parsedError = parseApiError(response.error, "Error al crear la orden de trabajo")
        setError(parsedError)
      }
    } catch (err) {
      const parsedError = parseApiError(err, "Error inesperado al crear la orden de trabajo")
      setError(parsedError)
    } finally {
      setIsSubmitting(false)
    }
  }


  const handleSuccessClose = useCallback(() => {
    setShowSuccess(false)
    router.push('/pending-check-in')
  }, [router])

  const handleMechanicData = useCallback((
    mechanicIds: number[],
    newMechanics: CreateMechanicRequest[],
    newLeaderMechanic?: CreateMechanicRequest,
    leaderMechanicId?: number
  ) => {
    setRequest(prevState => produce(prevState, draft => {
      draft.leaderMechanicId = leaderMechanicId ? leaderMechanicId : undefined
      draft.newLeaderMechanic = newLeaderMechanic ? newLeaderMechanic : undefined
      draft.mechanicIds = mechanicIds
      draft.newMechanics = newMechanics
    }))
  }, [])

  const handleServices = useCallback((
    serviceIds: number[],
    newServices: CreateWorkServiceRequest[]
  ) => {
    setRequest(prevState => produce(prevState, draft => {
      draft.serviceIds = serviceIds
      draft.newServices = newServices
    }))
  }, [])

  const handleLightsData = useCallback((
    lights: CreateWorkOrderHasDashboardLightRequest[]
  ) => {
    setRequest(prevState => produce(prevState, draft => {
      draft.dashboardLightsActive = lights
    }))
  }, [])

  const handleImagesChange = useCallback((images: ImageFile[]) => {
    setCarImages(images)
  }, [])

  const handleSignatureChange = useCallback((file: File | null) => {
    setSignature(file)
  }, [])

  const sections: Section[] = [
    {
      index: 0,
      name: "Mecánicos asignados",
      children: <SelectMechanics key={`mechanics-${formKey}`} onMechanicsChange={handleMechanicData} />
    },
    {
      index: 1,
      name: "Luces indicadoras",
      children: <SummaryIndicatorLights key={`lights-${formKey}`} onLightsChange={handleLightsData}/>
    },
    {
      index: 2,
      name: "Servicios",
      children: <SelectServices key={`services-${formKey}`} onServicesChange={handleServices}/>
    },
    {
      index: 3,
      name: "Condición del vehículo",
      children: (
        <ImageGallery
          key={`images-${formKey}`}
          onImagesChange={handleImagesChange}
          maxImages={15}
          maxFileSize={10}
          acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
        />
      )
    },
    {
      index: 4,
      name: "Firma del cliente",
      children: (
        <DrawableCanvas
          key={`signature-${formKey}`}
          width={1000}
          height={600}
          strokeColor="#000000"
          backgroundColor="#ffffff"
          onSignatureChange={handleSignatureChange}
        />
      )
    }
  ]

  const isFirstStep = nSections === 0
  const isLastStep = nSections === sections.length - 1

  const navigateStep = (direction: 'prev' | 'next') => {
    setNSections(prev => direction === 'next' ? prev + 1 : prev - 1)
  }

  const StepIndicator = ({section, index}: { section: Section, index: number }) => (
    <div key={section.index} className="flex items-center flex-shrink-0">
      <div className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full",
        "transition-all duration-300 ease-in-out text-sm font-semibold",
        nSections === section.index
          ? "bg-blue-600 text-white shadow-lg ring-2 ring-blue-400"
          : nSections > section.index
            ? "bg-emerald-600 text-white"
            : "bg-slate-600 text-slate-300"
      )}>
        {nSections > section.index ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"/>
          </svg>
        ) : (
          <span>{section.index + 1}</span>
        )}
      </div>

      {index < sections.length - 1 && (
        <div className={cn(
          "w-12 h-0.5 mx-2 transition-all duration-300 rounded-full",
          nSections > section.index ? "bg-emerald-600" : "bg-slate-600"
        )}/>
      )}
    </div>
  )

  const NavigationButton = ({
                              variant,
                              onClick,
                              disabled,
                              children
                            }: {
    variant: 'primary' | 'secondary' | 'success'
    onClick?: () => void
    disabled?: boolean
    children: ReactNode
  }) => {
    const variants = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg",
      secondary: "bg-slate-600 hover:bg-slate-700 text-white shadow-sm hover:shadow-md",
      success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg"
    }

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "px-6 py-2.5 rounded-lg font-medium text-sm",
          "transition-all duration-200 ease-in-out",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "flex items-center gap-2",
          variants[variant]
        )}
      >
        {children}
      </button>
    )
  }

  return (
    <>
      {isSubmitting && (
        <LoadingSpinner
          title="Creando orden de trabajo..."
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
          title="¡Orden de trabajo creada!"
          message="La orden de trabajo se ha creado exitosamente"
          buttonText="Volver a check-ins pendientes"
        />
      )}

      <div className={cn("flex flex-col bg-slate-800 w-full h-screen")}>
        <div className={cn("flex flex-col px-8 py-6 bg-slate-700/30 border-b border-slate-600/50")}>
          <div className={cn("text-center mb-4")}>
            <h1 className={cn("text-white text-3xl font-bold mb-2")}>
              Generar Orden de Trabajo
            </h1>
            <p className={cn("text-slate-400 text-sm")}>
              Check-in ID: #{id}
            </p>
          </div>

          <div className={cn("flex items-center justify-center space-x-3 overflow-x-auto pb-2")}>
            {sections.map((section, index) => (
              <StepIndicator key={section.index} section={section} index={index}/>
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
                {section.children || <></>}
              </div>
            ))}
          </div>
        </div>

        <div className={cn("px-8 py-6 bg-slate-700/30 border-t border-slate-600/50")}>
          <div className={cn("flex items-center justify-center gap-4")}>
            {!isFirstStep && (
              <NavigationButton
                variant="secondary"
                onClick={() => navigateStep('prev')}
                disabled={isSubmitting}
              >
                <svg className={cn("w-4 h-4")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Atrás
              </NavigationButton>
            )}

            {isLastStep ? (
              <NavigationButton
                variant="success"
                onClick={sendData}
                disabled={isSubmitting}
              >
                <svg className={cn("w-4 h-4")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Finalizar y crear orden
              </NavigationButton>
            ) : (
              <NavigationButton
                variant="primary"
                onClick={() => navigateStep('next')}
                disabled={isSubmitting}
              >
                Siguiente
                <svg className={cn("w-4 h-4")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </NavigationButton>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
