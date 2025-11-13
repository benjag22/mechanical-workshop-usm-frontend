'use client'
import {cn} from "@/app/cn";
import CheckInToOrderContainer from "@/app/pending-check-in/components/CheckInToOrderContainer";
import FilterSection from "@/app/pending-check-in/components/FilterSection";
import api, {GetCheckInBasicResponse} from "@/api";
import {useEffect, useState} from "react";

async function getPendingCheckIns(set: (data: GetCheckInBasicResponse[]) => void): Promise<void> {
  try {
    const response = await api.getAllCheckInFull()

    if (response.data){
      set(response.data)
    }

  }catch(err){
    console.log(err);
  }
}

export default function PendingCheckInPage() {
    const [pendingCheckIns, setPendingCheckIns] = useState<GetCheckInBasicResponse[] | null>(null);

    useEffect(() => {
      getPendingCheckIns(setPendingCheckIns)
    }, []);

    if (!pendingCheckIns) {
      return <div>Loading...</div>;
    }

    return (
        <div className={cn("w-full bg-slate-700 min-h-screen p-6")}>
            <FilterSection />

            <div className={cn("mb-6")}>
                <h2 className={cn("text-2xl font-bold text-slate-100 mb-2")}>
                    Entradas pendientes
                </h2>
                <p className={cn("text-slate-300")}>
                    {pendingCheckIns.length} check-ins disponibles para generar órdenes de trabajo
                </p>
            </div>
            <div className={cn("space-y-4")}>
                {pendingCheckIns.map((checkIn) => (
                        <CheckInToOrderContainer
                            key={checkIn.checkInId}
                            checkIn={checkIn}
                        />
                    ))}
            </div>
        </div>
    );
}
