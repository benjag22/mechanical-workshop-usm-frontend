'use client'
import {ReactNode, use, useState} from 'react'
import {cn} from "@/app/cn"
import DrawableCanvas from "@/app/components/DrawableCanvas"

type Section = {
    index: number
    name: string
    children?: ReactNode
}

type GenerateByIdCheckInPageProps = {
    id: number
}

export default function GenerateByIdCheckIn({params}: { params: Promise<GenerateByIdCheckInPageProps> }) {
    const {id} = use(params)
    const [drawingData, setDrawingData] = useState<string>('')
    const [nSections, setNSections] = useState<number>(0)
    const vehicleImageUrl = "/bg-conditions.jpg"

    const sections: Section[] = [
        {index: 0, name: "General Information"},
        {index: 1, name: "Services"},
        {
            index: 2,
            name: "Car condition",
            children: (
                <DrawableCanvas
                    backgroundImage={vehicleImageUrl}
                    width={900}
                    height={650}
                    strokeColor="red"
                    strokeWidth={3}
                    onDrawingChange={setDrawingData}
                    className="mb-6"
                />
            )
        },
        {
            index: 3,
            name: "Client Signature",
            children: <DrawableCanvas width={1000} height={600} strokeColor="black"/>
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
                                  children
                              }: {
        variant: 'primary' | 'secondary' | 'success'
        onClick?: () => void
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
                className={cn(
                    "px-8 py-3 rounded-lg font-medium text-sm",
                    "transition-all duration-200 ease-in-out transform hover:scale-[1.01]",
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
                        <h2 className="text-slate-100 text-xl font-semibold mb-1">
                            {sections[nSections].name}
                        </h2>
                        <p className="text-slate-300 text-sm">
                            Paso {nSections + 1} de {sections.length}
                        </p>
                    </div>
                </div>

                <div className="bg-slate-400 rounded-2xl p-8 shadow-2xl border border-slate-200">
                    <div className="min-h-[400px] flex items-center justify-center mb-4">
                        {sections[nSections].children || (
                            <div className="text-center">
                                <div
                                    className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                </div>
                                <h3 className="text-slate-600 text-lg font-medium mb-2">
                                    {sections[nSections].name}
                                </h3>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center gap-4">
                        {!isFirstStep && (
                            <NavigationButton
                                variant="secondary"
                                onClick={() => navigateStep('prev')}
                            >
                                ← Atrás
                            </NavigationButton>
                        )}

                        {isLastStep ? (
                            <NavigationButton variant="success">
                                ✓ Finalizar
                            </NavigationButton>
                        ) : (
                            <NavigationButton
                                variant="primary"
                                onClick={() => navigateStep('next')}
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
