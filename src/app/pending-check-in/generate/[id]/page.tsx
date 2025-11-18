'use client'
import {ReactNode, use, useCallback, useState} from 'react'
import {cn} from "@/app/cn"
import DrawableCanvas from "@/app/components/DrawableCanvas"
import ImageGallery, {ImageFile} from "@/app/components/ImageGallery"
import SelectServices from "@/app/pending-check-in/components/SelectServices";
import SummaryIndicatorLights from "@/app/pending-check-in/components/SummaryIndicatorLights";
import SelectMechanics from "@/app/pending-check-in/components/SelectMechanics"
import api, {
  CreateMechanicRequest,
  CreateWorkOrderHasDashboardLightRequest,
  CreateWorkOrderRequest,
  CreateWorkServiceRequest
} from "@/api"
import {produce} from "immer";

type Section = {
  index: number
  name: string
  children?: ReactNode
}

export default function GenerateByIdCheckIn({params}: { params: Promise<{ id: number }> }) {
  const {id} = use(params)
  const [nSections, setNSections] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [signature, setSignature] = useState<File | null>(null)
  const [carImages, setCarImages] = useState<ImageFile[]>([])
  const [request, setRequest] = useState<CreateWorkOrderRequest>({
    recordId: id,
    mechanicIds: [],
    newMechanics: []
  })

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    // Validar mecánicos
    const hasMechanics = (request.mechanicIds && request.mechanicIds.length > 0) ||
      (request.newMechanics && request.newMechanics.length > 0)
    const hasLeader = request.leaderMechanicId || request.newLeaderMechanic

    if (!hasMechanics && !hasLeader) {
      errors.push('Debes seleccionar al menos un mecánico')
    }

    // Validar servicios
    const hasServices = (request.serviceIds && request.serviceIds.length > 0) ||
      (request.newServices && request.newServices.length > 0)

    if (!hasServices) {
      errors.push('Debes seleccionar al menos un servicio')
    }

    // Validar firma
    if (!signature) {
      errors.push('Debes firmar antes de finalizar')
    }

    // Validar imágenes (opcional, puedes eliminar si no son obligatorias)
    if (carImages.length === 0) {
      errors.push('Debes agregar al menos una imagen del vehículo')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  async function sendData() {
    try {
      setIsSubmitting(true)
      const validation = validateForm()
      if (!validation.isValid) {
        return
      }

      const payload = {
        payload: request,
        carPictures: carImages.map((image) => image.file),
        signature: signature ? signature : new File([], "signature"),
      }

      console.log(payload)

      const response = await api.createFull({body: payload})
      console.log(response)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

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
  }, []);

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
      name: "Mechanics to work",
      children: <SelectMechanics onMechanicsChange={handleMechanicData} />
    },
    {
      index: 1,
      name: "Lights Indicators",
      children: <SummaryIndicatorLights onLightsChange={handleLightsData}/>
    },
    {
      index: 2,
      name: "Services",
      children: <SelectServices onServicesChange={handleServices}/>
    },
    {
      index: 3,
      name: "Car condition",
      children: (
        <ImageGallery
          onImagesChange={handleImagesChange}
          maxImages={15}
          maxFileSize={10}
          acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
        />
      )
    },
    {
      index: 4,
      name: "Client Signature",
      children: (
        <DrawableCanvas
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
    <div key={section.index} className="flex items-center">
      <div className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full",
        "transition-all duration-300 ease-in-out text-sm font-semibold",
        nSections === section.index ? "bg-blue-600 text-white shadow-lg ring-2" : "",
        nSections > section.index ? "bg-emerald-500 text-white shadow-md" : "",
        nSections < section.index ? "bg-slate-300 text-slate-600" : ""
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
          "w-10 lg:w-18 md:w-14 h-1 mx-3 rounded-full transition-all duration-300",
          nSections > section.index ? "bg-emerald-400" : "bg-slate-300"
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
      primary: "bg-blue-700 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl",
      secondary: "bg-red-400 hover:bg-red-500 text-black shadow-md hover:shadow-lg",
      success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl"
    }

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "px-8 py-3 rounded-lg font-medium text-sm",
          "transition-all duration-200 ease-in-out transform hover:scale-[1.01]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
          variants[variant]
        )}
      >
        {children}
      </button>
    )
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-500 p-6">
      <div className="w-full mx-auto">
        <div className="text-center mb-2">
          <h1 className="text-white text-3xl font-bold mb-2">
            Orden de Trabajo
          </h1>
        </div>

        <div className="bg-slate-600/20 backdrop-blur-sm rounded-2xl p-8 mb-4 border border-slate-500/30">
          <div className="flex items-center justify-center mb-2">
            {sections.map((section, index) => (
              <StepIndicator key={section.index} section={section} index={index}/>
            ))}
          </div>

          <div className="text-center">
            <p className="text-slate-300 text-sm">
              Paso {nSections + 1} de {sections.length}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-500 rounded-2xl p-8 shadow-2xl border border-slate-900">
          <div className="min-h-[400px] flex items-center justify-center mb-4">
            {sections[nSections].children || (<></>)}
          </div>

          <div className="flex justify-center gap-4">
            {!isFirstStep && (
              <NavigationButton
                variant="secondary"
                onClick={() => navigateStep('prev')}
                disabled={isSubmitting}
              >
                ← Atrás
              </NavigationButton>
            )}

            {isLastStep ? (
              <NavigationButton
                variant="success"
                onClick={sendData}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  '✓ Finalizar'
                )}
              </NavigationButton>
            ) : (
              <NavigationButton
                variant="primary"
                onClick={() => navigateStep('next')}
                disabled={isSubmitting}
              >
                Siguiente →
              </NavigationButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
