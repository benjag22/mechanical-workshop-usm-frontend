'use client'
import {cn} from "@/app/cn";
import CheckInToOrderContainer from "@/app/pending-check-in/components/CheckInToOrderContainer";
import FilterSection from "@/app/pending-check-in/components/FilterSection";

type ConditionStates = {
    nameCondition: string;
    state: string;
}
type ClientInfo = {
    firstName: string;
    lastName: string;
    emailAddress: string;
    address: string;
    cellphoneNumber: string;
}
type Car = {
    patent: string;
    VIN: string;
    modelName: string;
    year: number;
    brand: string;

}
export type CheckIn = {
    id: number;
    reason: string;
    observations: string;
    tools: string[];
    conditions: ConditionStates[];
    carAssociated: Car;
    clientAssociated: ClientInfo;

}
const checkIns: CheckIn[] = [
    {
        id: 1,
        reason: "Mantención preventiva",
        observations: "Cliente solicitó revisión general y cambio de aceite.",
        tools: ["Llave dinamométrica", "Elevador hidráulico", "Scanner OBD2"],
        conditions: [
            {nameCondition: "Parachoques delantero", state: "Rayado"},
            {nameCondition: "Puerta trasera derecha", state: "Abollado"},
        ],
        carAssociated: {
            patent: "KJ-DF45",
            VIN: "3N1AB7AP7GY289675",
            modelName: "Corolla",
            year: 2019,
            brand: "Toyota",
        },
        clientAssociated: {
            firstName: "Juan",
            lastName: "Pérez",
            emailAddress: "juan.perez@gmail.com",
            address: "Av. Providencia 1234, Santiago",
            cellphoneNumber: "+56 9 8765 4321",
        },
    },
    {
        id: 2,
        reason: "Reparación por choque leve",
        observations: "Golpe en puerta delantera izquierda, sin daño estructural.",
        tools: ["Gata hidráulica", "Juego de llaves combinadas", "Pistola de calor"],
        conditions: [
            {nameCondition: "Puerta delantera izquierda", state: "Abollado"},
            {nameCondition: "Foco delantero derecho", state: "Trizado"},
        ],
        carAssociated: {
            patent: "HZ-RF23",
            VIN: "1HGCM82633A123456",
            modelName: "Civic",
            year: 2020,
            brand: "Honda",
        },
        clientAssociated: {
            firstName: "María",
            lastName: "González",
            emailAddress: "maria.gonzalez@hotmail.com",
            address: "Los Leones 456, Providencia",
            cellphoneNumber: "+56 9 7654 3210",
        },
    },
    {
        id: 3,
        reason: "Problema eléctrico",
        observations: "Cliente indica que luces interiores no encienden.",
        tools: ["Multímetro", "Destornillador plano", "Tester de fusibles"],
        conditions: [
            {nameCondition: "Fusibles", state: "Malo"},
            {nameCondition: "Tablero central", state: "Rayado"},
        ],
        carAssociated: {
            patent: "JB-HC87",
            VIN: "2T1BURHE6GC123987",
            modelName: "Yaris",
            year: 2021,
            brand: "Toyota",
        },
        clientAssociated: {
            firstName: "Felipe",
            lastName: "Ramírez",
            emailAddress: "felipe.ramirez@gmail.com",
            address: "Av. Apoquindo 8900, Las Condes",
            cellphoneNumber: "+56 9 9988 7766",
        },
    },
    {
        id: 4,
        reason: "Cambio de neumáticos",
        observations: "Neumáticos delanteros desgastados, cliente trae repuestos.",
        tools: ["Llave de cruz", "Compresor de aire", "Torque wrench"],
        conditions: [
            {nameCondition: "Tapabarros delantero izquierdo", state: "Roto"},
            {nameCondition: "Emblema frontal", state: "Ausente"},
        ],
        carAssociated: {
            patent: "LT-ZP56",
            VIN: "5YJSA1E26HF123654",
            modelName: "Model 3",
            year: 2022,
            brand: "Tesla",
        },
        clientAssociated: {
            firstName: "Camila",
            lastName: "Soto",
            emailAddress: "camila.soto@gmail.com",
            address: "Av. Alemania 234, Temuco",
            cellphoneNumber: "+56 9 6543 2109",
        },
    },
    {
        id: 5,
        reason: "Chequeo sistema de frenos",
        observations: "Cliente siente frenos suaves, revisar pastillas y discos.",
        tools: ["Llave de impacto", "Calibrador de frenos", "Lámpara portátil"],
        conditions: [
            {nameCondition: "Parachoques trasero", state: "Rayado"},
            {nameCondition: "Manilla puerta trasera", state: "Ausente"},
        ],
        carAssociated: {
            patent: "CP-MK78",
            VIN: "JHMCM56557C123321",
            modelName: "CX-5",
            year: 2018,
            brand: "Mazda",
        },
        clientAssociated: {
            firstName: "Rodrigo",
            lastName: "Muñoz",
            emailAddress: "rodrigo.munoz@yahoo.com",
            address: "Colo Colo 890, Concepción",
            cellphoneNumber: "+56 9 7890 1234",
        },
    },
];
export default function PendingCheckInPage() {
    return (
        <div className={cn("w-full bg-slate-700 min-h-screen p-6")}>
            <FilterSection />

            <div className={cn("mb-6")}>
                <h2 className={cn("text-2xl font-bold text-slate-100 mb-2")}>
                    Entradas pendientes
                </h2>
                <p className={cn("text-slate-300")}>
                    {checkIns.length} check-ins disponibles para generar órdenes de trabajo
                </p>
            </div>
            <div className={cn("space-y-4")}>
                {checkIns.length > 0 ? (
                    checkIns.map((checkIn) => (
                        <CheckInToOrderContainer
                            key={checkIn.id}
                            checkIn={checkIn}
                        />
                    ))
                ) : (
                    <div className={cn("text-center py-12")}>
                        <p className={cn("text-slate-400 text-lg")}>
                            No hay check-ins pendientes
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
