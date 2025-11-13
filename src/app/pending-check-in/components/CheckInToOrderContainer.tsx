import {cn} from "@/app/cn";
import {GetCheckInBasicResponse} from "@/api";

import Link from "next/link";

type CheckInToOrderContainerProps = {
    checkIn: GetCheckInBasicResponse;
}

export default function CheckInToOrderContainer({ checkIn }: CheckInToOrderContainerProps) {

    return (
        <div className={cn(
            "flex flex-col lg:flex-row w-full bg-slate-600 rounded-lg p-4 mb-4",
            "border border-slate-500 hover:bg-slate-500 transition-colors duration-200",
            "shadow-md hover:shadow-lg"
        )}>
            <div className={cn("flex-1 space-y-3")}>
                <div className={cn("flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2")}>
                    <div className={cn("flex-1")}>
                        <h3 className={cn("text-lg font-semibold text-slate-100")}>
                            {checkIn.brandName} {checkIn.modelName} ({checkIn.modelYear})
                        </h3>
                        <p className={cn("text-slate-300 text-sm font-mono")}>
                            Patente: {checkIn.licensePlate}
                        </p>
                    </div>
                    <div className={cn("text-right")}>
                        <p className={cn("text-slate-200 font-medium")}>
                            {checkIn.clientName}
                        </p>
                        <p className={cn("text-slate-400 text-sm")}>
                            {checkIn.clientEmail}
                        </p>
                    </div>
                </div>

                <div className={cn("space-y-2")}>
                    <div>
                        <span className={cn("text-slate-300 text-sm font-medium")}>Motivo: </span>
                        <span className={cn("text-slate-100")}>{checkIn.reason}</span>
                    </div>
                </div>

                {checkIn.conditions.length > 0 && (
                    <div className={cn("space-y-1")}>
                        <span className={cn("text-slate-300 text-sm font-medium")}>Condiciones reportadas:</span>
                        <div className={cn("flex flex-wrap gap-2")}>
                            {checkIn.conditions.map((condition, index) => (
                                <span
                                    key={index}
                                    className={cn(
                                        "inline-flex items-center px-2 py-1 rounded-full text-xs",
                                        "bg-slate-700 text-slate-200 border border-slate-600"
                                    )}
                                >
                                    {condition.partName}: {condition.state}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className={cn("flex items-center lg:ml-6 mt-4 lg:mt-0")}>
                <Link
                    href={`pending-check-in/generate/${checkIn.checkInId}`}
                    className={cn(
                        "w-full h-full flex items-center justify-center lg:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700",
                        "text-white font-medium rounded-lg transition-colors duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                        "focus:ring-offset-slate-600 shadow-md hover:shadow-lg"
                    )}
                >
                    <p>
                        Generar orden de trabajo
                    </p>
                </Link>
            </div>
        </div>
    );
}
