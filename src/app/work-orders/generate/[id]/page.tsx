'use client'
import { use } from 'react'

type GenerateByIdCheckInPageProps = {
    id:number;
}

export default function GenerateByIdCheckIn({params}:{params: Promise<GenerateByIdCheckInPageProps>}){
    const {id} = use(params);
    return (
        <div>
            <p>Check In con ID: {id}</p>
        </div>
    )
}
