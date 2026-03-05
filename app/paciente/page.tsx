"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Loader2, User, MapPin, Building2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Components from the new module
import { ReprocannStatusCard } from "@/modules/patient/components/ReprocannStatusCard";
import { ConsumptionStatsCard } from "@/modules/patient/components/ConsumptionStatsCard";
import { NextAppointmentCard } from "@/modules/patient/components/NextAppointmentCard";

// Services
import { patientService, PatientDashboardData } from "@/lib/services/patient";

export default function PatientDashboardPage() {
    const { token } = useAuth();
    const [data, setData] = useState<PatientDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPatientDashboard = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const dashboardData = await patientService.getPatientDashboard(token);
                setData(dashboardData);
            } catch (err: any) {
                console.error("Error fetching patient dashboard:", err);
                setError(err.message || "Error al cargar el dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetchPatientDashboard();
    }, [token]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">Cargando tu información...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center max-w-md mx-auto">
                <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
                    <User size={40} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-800">Ups, hubo un problema</h2>
                    <p className="text-slate-500 font-medium mt-2">{error || "No se pudo cargar la información del perfil."}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    const userName = data.patient.fullName || "Paciente";
    const nextAppointment = data.pendingAppointments.length > 0 ? data.pendingAppointments[0] : null;

    return (
        <div className="space-y-10 pb-20">
            {/* Header / Welcome */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <User size={16} />
                        </div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Panel del Paciente</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                        ¡Hola, <span className="text-primary">{userName.split(' ')[0]}</span>! 👋
                    </h1>
                    <p className="text-slate-400 font-bold mt-1 text-sm">
                        Aquí tienes el resumen de tu tratamiento y estado legal.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm border border-white/50 rounded-2xl shadow-sm"
                >
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tu Club</p>
                        <p className="text-xs font-black text-slate-800">{data.organization.name}</p>
                    </div>
                </motion.div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Reprocann Status */}
                <ReprocannStatusCard
                    reprocanNumber={data.reprocan.reprocanNumber}
                    expirationDate={data.reprocan.expirationDate}
                    createdAt={data.reprocan.createdAt}
                    status={data.reprocan.status}
                    daysRemaining={data.reprocan.daysRemaining}
                />

                {/* Consumption Stats */}
                <ConsumptionStatsCard
                    consumedGrams={data.consumption.consumedThisMonth}
                    monthlyLimit={data.consumption.monthlyAllowance}
                    available={data.consumption.available}
                    progressPercent={data.consumption.progressPercent}
                    lastDispensationDate={data.consumption.lastDispensation?.createdAt ? new Date(data.consumption.lastDispensation.createdAt).toLocaleDateString() : undefined}
                />

                {/* Next Appointment */}
                <NextAppointmentCard
                    date={nextAppointment?.date || null}
                    time={nextAppointment?.date ? new Date(nextAppointment.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null}
                    reason={nextAppointment?.reason || "Consulta de Seguimiento"}
                    isVirtual={false}
                />
            </div>

            {/* Quick Actions / External Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Mi Historial", sub: "Ver recibos y consumos", icon: User, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Catálogo", sub: "Cepa y productos", icon: MapPin, color: "text-primary", bg: "bg-primary/10" },
                    { label: "REPROCAN", sub: "Sitio oficial Argentina", icon: ExternalLink, color: "text-slate-500", bg: "bg-slate-500/10", href: "https://reprocann.magyp.gob.ar/" },
                    { label: "Soporte", sub: "Contacto con el club", icon: Building2, color: "text-rose-500", bg: "bg-rose-500/10" },
                ].map((action, i) => (
                    <motion.a
                        key={action.label}
                        href={action.href || "#"}
                        target={action.href ? "_blank" : undefined}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + (i * 0.05) }}
                        className="p-5 bg-white/60 hover:bg-white border border-white/50 rounded-2xl shadow-sm transition-all group/card flex items-center gap-4"
                    >
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover/card:scale-110", action.bg, action.color)}>
                            <action.icon size={22} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-800">{action.label}</p>
                            <p className="text-[10px] font-bold text-slate-400">{action.sub}</p>
                        </div>
                    </motion.a>
                ))}
            </div>
        </div>
    );
}
