"use client";

import { UserPlus } from "lucide-react";

interface UserHeaderProps {
    onAddUser: () => void;
}

export function UserHeader({ onAddUser }: UserHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Gestión de Personal</h1>
                <p className="text-muted-foreground mt-1 text-sm font-medium">
                    Administra los integrantes y operarios de tu organización.
                </p>
            </div>
            <button
                onClick={onAddUser}
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5 active:scale-95"
            >
                <UserPlus size={18} />
                <span>Añadir Operario</span>
            </button>
        </div>
    );
}
