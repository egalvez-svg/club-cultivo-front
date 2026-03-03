"use client";

import { UserPlus } from "lucide-react";

interface PatientHeaderProps {
    onNewPatient: () => void;
}

export function PatientHeader({ onNewPatient }: PatientHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Pacientes</h1>
                <p className="text-muted-foreground mt-1 text-sm font-medium">
                    Registra y administra los pacientes de tu organización.
                </p>
            </div>
            <button
                onClick={onNewPatient}
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5 active:scale-95"
            >
                <UserPlus size={18} />
                <span>Nuevo Paciente</span>
            </button>
        </div>
    );
}
