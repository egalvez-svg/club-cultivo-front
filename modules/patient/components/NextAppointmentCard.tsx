"use client";

import { CalendarClock, MapPin, User, ChevronRight, Video } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NextAppointmentCardProps {
    date: string | null;
    time: string | null;
    reason: string | null;
    location?: string;
    isVirtual?: boolean;
}

export function NextAppointmentCard({ date, time, reason, location, isVirtual }: NextAppointmentCardProps) {
    if (!date) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white/50 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center text-center gap-4 h-full"
            >
                <div className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-300 flex items-center justify-center">
                    <CalendarClock size={32} />
                </div>
                <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Sin Turnos Pendientes</h3>
                    <p className="text-xs font-bold text-slate-400 mt-1">¿Necesitas renovar tu REPROCANN o realizar una consulta?</p>
                </div>
                <button className="px-6 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                    Agendar Turno
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white/50 shadow-xl shadow-slate-200/50 relative overflow-hidden group h-full flex flex-col justify-between"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                        <CalendarClock size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Próximo Turno</h3>
                        <p className="text-xs font-bold text-slate-800">Cita Médica</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <div className="flex flex-col items-center justify-center min-w-[60px] border-r border-primary/20 pr-4">
                            <span className="text-2xl font-black text-primary">{new Date(date).getDate()}</span>
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                                {new Date(date).toLocaleString('es-ES', { month: 'short' }).replace('.', '')}
                            </span>
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-sm font-black text-slate-800">{time} HS</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Horario Confirmado</span>
                        </div>
                    </div>

                    <div className="space-y-3 px-1">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                <FileText size={14} className="hidden" /> {/* Placeholder icon */}
                                <User size={14} />
                            </div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{reason}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                {isVirtual ? <Video size={14} /> : <MapPin size={14} />}
                            </div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                {isVirtual ? "Consulta Online (Meet)" : (location || "Sede Central")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 relative z-10">
                <button className="w-full flex items-center justify-between p-4 bg-slate-900 rounded-2xl text-white hover:bg-slate-800 transition-all group/action">
                    <div className="flex flex-col items-start">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/action:text-primary transition-colors">Confirmación</span>
                        <span className="text-xs font-black">Ya estoy aquí</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover/action:translate-x-1 transition-transform">
                        <ChevronRight size={20} />
                    </div>
                </button>
            </div>
        </motion.div>
    );
}

// Add FileText import to the top
import { FileText } from "lucide-react";
