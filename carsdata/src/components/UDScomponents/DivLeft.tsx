
'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { useModule } from '@/src/utils/ModuleContext';

const DivLeft = () => {
    const { selectedModule, changeSelectedModule } = useModule();
    const router = useRouter();

    const handleSendBack = (iconIndex: string) => {
        changeSelectedModule(iconIndex);
        router.push(`/UDS/${iconIndex === "1" ? "mcu" : iconIndex === "2" ? "battery" : iconIndex === "3" ? "engine" : iconIndex === "4" ? "doors" : iconIndex === "5" ? "hvac" : "send-requests"}`);
    };

    return (
        <div className="w-[10%] h-screen bg-blue-950 p-6 shadow-xl flex flex-col justify-center space-y-4">
            <div onClick={() => handleSendBack("1")} className={selectedModule === "1" ? "bg-white/50 p-1 rounded-lg" : "text-cyan-50"}>MCU</div>
            <div onClick={() => handleSendBack("2")} className={selectedModule === "2" ? "bg-white/50 p-1 rounded-lg" : "text-cyan-50"}>Battery</div>
            <div onClick={() => handleSendBack("3")} className={selectedModule === "3" ? "bg-white/50 p-1 rounded-lg" : "text-cyan-50"}>Engine</div>
            <div onClick={() => handleSendBack("4")} className={selectedModule === "4" ? "bg-white/50 p-1 rounded-lg" : "text-cyan-50"}>Doors</div>
            <div onClick={() => handleSendBack("5")} className={selectedModule === "5" ? "bg-white/50 p-1 rounded-lg" : "text-cyan-50"}>HVAC</div>
            <div onClick={() => handleSendBack("6")} className={selectedModule === "6" ? "bg-white/50 p-1 rounded-lg" : "text-cyan-50"}>Send requests</div>
        </div>
    );
}

export default DivLeft;
