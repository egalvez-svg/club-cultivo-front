"use client";

import { CalendarPlus } from "lucide-react";

interface AppointmentHeaderProps {
    onNewAppointment: () => void;
}

export function AppointmentHeader({ onNewAppointment }: AppointmentHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Turnos</h1>
                <p className="text-muted-foreground mt-1 text-sm font-medium">
                    Agenda y administra los turnos de tu organizacion.
                </p>
            </div>
            <button
                onClick={onNewAppointment}
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5 active:scale-95"
            >
                <CalendarPlus size={18} />
                <span>Agendar Turno</span>
            </button>
        </div>
    );
}
