"use client"

import {cn} from "@/app/cn";
import {useState} from "react";
import {Search, Car, Plus} from "lucide-react";
import NewCarDetailComponent from "./NewCarDetailComponent";
import ExistsCarDetailComponent from "./ExistsCarDetailComponent";

type Patent = {
    code: string;
}

type ExistsCar = {
    id: number;
    patent: string;
    VIN: string;
    modelName: string;
    brandName: string;
    year: number;
    type: string;
}

const existingPatents: Patent[] = [
    { code: "BCDF12" },
    { code: "GHIJ34" },
    { code: "KLMN56" },
    { code: "PQRS78" },
    { code: "TUVW90" },
    { code: "XYZA12" },
    { code: "BCDE34" },
    { code: "FGHI56" }
];

const existingCars: ExistsCar[] = [
    { id: 1, patent: "BCDF12", VIN: "1HGBH41JXMN109186", modelName: "Corolla", brandName: "Toyota", year: 2020, type: "Sedán" },
    { id: 2, patent: "GHIJ34", VIN: "2HGBH41JXMN109187", modelName: "Civic", brandName: "Honda", year: 2019, type: "Sedán" },
    { id: 3, patent: "KLMN56", VIN: "3HGBH41JXMN109188", modelName: "Focus", brandName: "Ford", year: 2021, type: "Hatchback" },
    { id: 4, patent: "PQRS78", VIN: "4HGBH41JXMN109189", modelName: "Hilux", brandName: "Toyota", year: 2022, type: "Pick-up" }
];

export default function PatentListComponent(){
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatent, setSelectedPatent] = useState<string | null>(null);
    const [showNewCarForm, setShowNewCarForm] = useState(false);
    const [selectedCar, setSelectedCar] = useState<ExistsCar | null>(null);

    const filteredPatents = existingPatents.filter(patent =>
        patent.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePatentSelect = (patentCode: string) => {
        const existingCar = existingCars.find(car => car.patent === patentCode);

        if (existingCar) {
            setSelectedCar(existingCar);
            setSelectedPatent(patentCode);
            setShowNewCarForm(false);
        } else {
            setSelectedPatent(patentCode);
            setShowNewCarForm(true);
            setSelectedCar(null);
        }
    };

    const handleNewCar = () => {
        setShowNewCarForm(true);
        setSelectedPatent(null);
        setSelectedCar(null);
    };

    if (selectedCar) {
        return <ExistsCarDetailComponent car={selectedCar} onBackAction={() => setSelectedCar(null)} />;
    }

    if (showNewCarForm) {
        return <NewCarDetailComponent
            prefilledPatent={selectedPatent}
            onBackAction={() => {
                setShowNewCarForm(false);
                setSelectedPatent(null);
            }}
        />;
    }

    return(
        <div className="min-h-full flex flex-col">
            <div className="flex-shrink-0 text-center mb-4 lg:mb-6">
                <h2 className="text-xl lg:text-2xl font-bold text-white mb-1 lg:mb-2">Seleccionar Vehículo</h2>
                <p className="text-gray-400 text-sm lg:text-base">Busque la patente o registre un nuevo vehículo</p>
            </div>

            <div className="flex-1 min-h-0 flex flex-col space-y-4 lg:space-y-6">
                <div className="flex-shrink-0 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 lg:w-4 lg:h-4" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar patente (ej: BCDF12)"
                        className={cn(
                            "w-full pl-10 lg:pl-12 pr-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                            "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base",
                            "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                            "transition-all duration-200 hover:border-gray-600/50"
                        )}
                    />
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 auto-rows-max">
                        <button
                            onClick={handleNewCar}
                            className={cn(
                                "flex items-center justify-center p-3 lg:p-4 bg-blue-600/20 hover:bg-blue-600/30",
                                "border-2 border-dashed border-blue-500/50 hover:border-blue-400/70 rounded-lg",
                                "text-blue-300 hover:text-blue-200 transition-all duration-200",
                                "backdrop-blur-sm hover:scale-[1.01]",
                                "min-h-[60px] lg:min-h-[72px]"
                            )}
                        >
                            <Plus className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                            <span className="font-medium text-sm lg:text-base">Nuevo Vehículo</span>
                        </button>

                        {filteredPatents.map((patent) => {
                            const hasCarData = existingCars.some(car => car.patent === patent.code);
                            return (
                                <button
                                    key={patent.code}
                                    onClick={() => handlePatentSelect(patent.code)}
                                    className={cn(
                                        "flex items-center p-3 lg:p-4 bg-gray-800/50 hover:bg-gray-700/50",
                                        "border border-gray-700/50 hover:border-gray-600/50 rounded-lg",
                                        "text-white transition-all duration-200 backdrop-blur-sm hover:scale-[1.01]",
                                        "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                                        "min-h-[60px] lg:min-h-[72px]"
                                    )}
                                >
                                    <Car className="w-4 h-4 lg:w-5 lg:h-5 mr-3 text-gray-400 flex-shrink-0" />
                                    <div className="flex flex-col items-start text-left">
                                        <span className="font-medium text-sm lg:text-base">{patent.code}</span>
                                        <span className="text-xs lg:text-sm text-gray-400">
                                            {hasCarData ? "Datos disponibles" : "Requiere registro"}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {filteredPatents.length === 0 && searchTerm && (
                        <div className="flex items-center justify-center min-h-[200px] lg:min-h-[250px]">
                            <div className="text-center">
                                <div className="mb-4 lg:mb-6">
                                    <Search className="w-12 h-12 lg:w-16 lg:h-16 text-gray-500 mx-auto mb-3 lg:mb-4" />
                                </div>
                                <p className="text-gray-400 text-sm lg:text-base mb-4 lg:mb-6">
                                    No se encontró la patente <span className="font-semibold text-white">{searchTerm}</span>
                                </p>
                                <button
                                    onClick={handleNewCar}
                                    className={cn(
                                        "px-6 lg:px-8 py-3 lg:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg",
                                        "transition-all duration-200 hover:scale-101 text-sm lg:text-base font-medium",
                                        "shadow-lg hover:shadow-blue-500/25"
                                    )}
                                >
                                    Registrar nuevo vehículo
                                </button>
                            </div>
                        </div>
                    )}

                    {!searchTerm && filteredPatents.length > 0 && (
                        <div className="mt-4 lg:mt-6 text-center">
                            <p className="text-gray-500 text-xs lg:text-sm">
                                {filteredPatents.length} patente{filteredPatents.length !== 1 ? 's' : ''} disponible{filteredPatents.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
