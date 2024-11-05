'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';

type ModuleContextType = {
    selectedModule: string;
    changeSelectedModule: (newSelect: string) => void;
};

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const ModuleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize state from localStorage or set default to "1"
    const [selectedModule, setSelectedModule] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedModule = localStorage.getItem('selectedModule');
            return storedModule ? storedModule : "1"; // Default to "1" if nothing is stored
        }
        return "1"; 
    });

    const changeSelectedModule = (newSelect: string) => {
        setSelectedModule(newSelect);
        // Store the selected module in localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('selectedModule', newSelect);
        }
    };

    return (
        <ModuleContext.Provider value={{ selectedModule, changeSelectedModule }}>
            {children}
        </ModuleContext.Provider>
    );
};

export const useModule = () => {
    const context = useContext(ModuleContext);
    if (context === undefined) {
        throw new Error("useModule must be used within a ModuleProvider");
    }
    return context;
};
