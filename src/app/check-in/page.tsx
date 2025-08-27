'use client'
import {cn} from "@/app/cn";
import {useState} from "react";

type Section = {
    index: number;
    name: string;
}

export default function CheckInPage() {
    const sections: Section[] = [
        {index: 0, name: "Client information"},
        {index: 1, name: "Car"},
        {index: 2, name: "Car detail"},
        {index: 3, name: "Car condition"}
    ]

    const [nSections, setNSections] = useState<number>(0);

    function renderButtons(n: number) {
        switch (n) {
            case 0:
                return (
                    <button
                        onClick={() => setNSections(prevState => prevState + 1)}
                        className={cn(
                            "px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md",
                            "transition-all duration-200 ease-in-out font-medium text-sm",
                            "shadow-sm hover:shadow-md"
                        )}
                    >
                        Siguiente
                    </button>
                )
            case sections.length - 1:
                return (
                    <>
                        <button
                            onClick={() => setNSections(prevState => prevState - 1)}
                            className={cn(
                                "px-6 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-md",
                                "transition-all duration-200 ease-in-out font-medium text-sm",
                                "shadow-sm hover:shadow-md"
                            )}
                        >
                            Atrás
                        </button>
                        <button
                            className={cn(
                                "px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md",
                                "transition-all duration-200 ease-in-out font-medium text-sm",
                                "shadow-sm hover:shadow-md"
                            )}
                        >
                            Finalizar
                        </button>
                    </>
                )
            default:
                return (
                    <>
                        <button
                            onClick={() => setNSections(prevState => prevState - 1)}
                            className={cn(
                                "px-6 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-md",
                                "transition-all duration-200 ease-in-out font-medium text-sm",
                                "shadow-sm hover:shadow-md"
                            )}
                        >
                            Atrás
                        </button>
                        <button
                            onClick={() => setNSections(prevState => prevState + 1)}
                            className={cn(
                                "px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md",
                                "transition-all duration-200 ease-in-out font-medium text-sm",
                                "shadow-sm hover:shadow-md"
                            )}
                        >
                            Siguiente
                        </button>
                    </>
                )
        }
    }

    return (
        <div className={cn("flex flex-col bg-slate-800 w-full h-screen")}>
            <div className={cn("flex flex-col px-8 py-6 bg-slate-700/30")}>
                <h1 className={cn("text-white text-xl font-medium mb-6 text-center")}>
                    {sections[nSections].name}
                </h1>

                <div className={cn("flex items-center justify-center space-x-3")}>
                    {sections.map((s, index) => (
                        <div key={s.index} className={cn("flex items-center")}>
                            <div className={cn(
                                "flex items-center justify-center w-10 h-10 rounded-full",
                                "transition-all duration-300 ease-in-out text-sm font-medium",
                                nSections === s.index
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : nSections > s.index
                                        ? "bg-emerald-600 text-white"
                                        : "bg-slate-600 text-slate-300"
                            )}>
                                {nSections > s.index ? (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <span>{s.index + 1}</span>
                                )}
                            </div>

                            {index < sections.length - 1 && (
                                <div className={cn(
                                    "w-8 h-0.5 mx-2 transition-all duration-300",
                                    nSections > s.index
                                        ? "bg-emerald-600"
                                        : "bg-slate-600"
                                )} />
                            )}
                        </div>
                    ))}
                </div>

                <div className={cn("flex items-center justify-center mt-4")}>
                    <p className={cn("text-slate-300 text-sm")}>
                        Paso {nSections + 1} de {sections.length}
                    </p>
                </div>
            </div>

            <div className={cn("flex-1 bg-slate-700/20 mx-6 my-6 rounded-lg")}>
                <div className={cn("p-8 h-full flex items-center justify-center")}>
                    <div className={cn("text-center")}>
                        <h2 className={cn("text-white text-xl mb-2 font-medium")}>
                            {sections[nSections].name}
                        </h2>
                        <p className={cn("text-slate-400 text-sm")}>
                            Contenido de la sección aparecerá aquí
                        </p>
                    </div>
                </div>
            </div>

            <div className={cn("px-8 py-6 bg-slate-700/30")}>
                <div className={cn("flex items-center justify-center space-x-4")}>
                    {renderButtons(nSections)}
                </div>
            </div>
        </div>
    )
}
