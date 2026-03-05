"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";
import { DashboardData } from "@/lib/services/dashboard";

interface TodayAppointmentsProps {
    appointments: DashboardData["todayAppointments"];
}

export function TodayAppointments({ appointments }: TodayAppointmentsProps) {
    return (
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm h-fit">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-primary" />
                    <h2 className="text-lg font-semibold">Turnos Hoy</h2>
                </div>
                <Link
                    href="/appointments"
                    className="text-xs font-bold text-primary hover:underline"
                >
                    Ver todos
                </Link>
            </div>
            <div className="space-y-4">
                {appointments.map((appt) => (
                    <div key={appt.id} className="flex gap-4 p-3 rounded-xl bg-muted/30">
                        <div className="text-center min-w-[40px]">
                            <p className="text-xs font-bold text-primary uppercase">{appt.time}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">{appt.patientName}</p>
                            <p className="text-xs text-muted-foreground">{appt.reason}</p>
                        </div>
                    </div>
                ))}
                {appointments.length === 0 && (
                    <div className="text-center py-4 text-xs text-muted-foreground">Sin turnos para hoy</div>
                )}
            </div>
            <Link
                href="/appointments"
                className="block w-full mt-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors text-center"
            >
                Agendar Turno
            </Link>
        </div>
    );
}
