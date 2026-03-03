"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface UIContextType {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
    openSidebar: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);
    const openSidebar = () => setIsSidebarOpen(true);

    // Cerrar el sidebar automáticamente cuando cambia la ruta (al hacer clic en un link)
    useEffect(() => {
        closeSidebar();
    }, [pathname]);

    return (
        <UIContext.Provider value={{
            isSidebarOpen,
            toggleSidebar,
            closeSidebar,
            openSidebar
        }}>
            {children}
        </UIContext.Provider>
    );
}

export const useUI = () => {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error("useUI must be used within a UIProvider");
    }
    return context;
};
