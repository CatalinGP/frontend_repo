'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const DivLeft = ({ children }: { children: React.ReactNode }) => {
    const [pathname, setPathname] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPathname(window.location.pathname);
        }
    }, []);

    return (
        <div className="flex h-full">
            <nav className="w-[10%] h-screen bg-blue-950 p-6 shadow-xl flex flex-col justify-center space-y-4">
                <Link href="/UDS/mcu" className={pathname === "/UDS/mcu" ? "bg-white/50 p-1 rounded-lg" : "text-cyan-50"}>MCU</Link>
                <Link href="/UDS/battery" className={pathname === "/UDS/battery" ? "bg-white/50 p-1 rounded-lg" : "text-cyan-50"}>Battery</Link>
                <Link href="/UDS/engine" className={pathname === "/UDS/engine" ? "bg-white/50 p-1 rounded-lg" : "text-cyan-50"}>Engine</Link>
                <Link href="/UDS/doors" className={pathname === "/UDS/doors" ? "bg-white/50 p-1 rounded-lg" : "text-cyan-50"}>Doors</Link>
                <Link href="/UDS/hvac" className={pathname === "/UDS/hvac" ? "bg-white/50 p-1 rounded-lg" : "text-cyan-50"}>HVAC</Link>
                <Link href="/UDS/send-requests" className={pathname === "/UDS/send-requests" ? "bg-white/50 p-1 rounded-lg" : "text-cyan-50"}>Send requests</Link>
            </nav>
            <>
                {children}
            </>
        </div>
    );
}

export default DivLeft;
