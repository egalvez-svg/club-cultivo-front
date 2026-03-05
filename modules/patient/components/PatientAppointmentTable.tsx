"use client";

import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Search,
    ChevronRight
} from "lucide-react";
import { Appointment } from "@/lib/services/appointment";
import { cn } from "@/lib/utils";

interface PatientAppointmentTableProps {
    appointments: Appointment[] | undefined;
    isLoading: boolean;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onCancel?: (id: string) => void;
    isCancelling?: boolean;
}

const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

const formatTime = (date: string): string => {
    return new Date(date).toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const StatusBadge = ({ status }: { status: Appointment["status"] }) => {
    switch (status) {
        case "PENDING":
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 font-black text-[10px] border border-amber-500/20 uppercase tracking-widest">
                    <AlertCircle size={12} /> Pendiente
                </span>
            );
        case "COMPLETED":
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-black text-[10px] border border-emerald-500/20 uppercase tracking-widest">
                    <CheckCircle2 size={12} /> Completado
                </span>
            );
        case "CANCELLED":
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 font-black text-[10px] border border-red-500/20 uppercase tracking-widest">
                    <XCircle size={12} /> Cancelado
                </span>
            );
    }
};

export function PatientAppointmentTable({
    appointments,
    isLoading,
    searchTerm,
    onSearchChange,
    onCancel,
    isCancelling,
}: PatientAppointmentTableProps) {
    const filtered = appointments?.filter((a) => {
        const reason = a.reason.toLowerCase();
        const term = searchTerm.toLowerCase();
        return reason.includes(term);
    });

    return (
        <div className="space-y-6">
            {/* Search Bar - Simpler for patients */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Buscar por motivo del turno..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all text-sm font-bold text-slate-700 shadow-sm"
                />
            </div>

            {/* List / Table Area */}
            <div className="space-y-4">
                {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="animate-pulse bg-white/60 rounded-3xl p-6 border border-white/40 h-24" />
                    ))
                ) : filtered?.length === 0 ? (
                    <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-[2.5rem] border border-white/50 border-dashed">
                        <Calendar size={48} className="mx-auto mb-4 text-slate-300" />
                        <h3 className="text-lg font-black text-slate-800">No se encontraron turnos</h3>
                        <p className="text-sm font-medium text-slate-400 mt-1">Intenta con otro término o solicita un nuevo turno.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filtered?.map((a, index) => (
                            <motion.div
                                key={a.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white/60 hover:bg-white backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:border-primary/20 transition-colors">
                                        <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">
                                            {new Date(a.date).toLocaleString("es-AR", { month: "short" })}
                                        </span>
                                        <span className="text-xl font-black text-slate-800 leading-none">
                                            {new Date(a.date).getDate()}
                                        </span>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-slate-800">
                                            <span className="font-black text-lg">{formatDate(a.date)}</span>
                                            <span className="text-slate-300">•</span>
                                            <div className="flex items-center gap-1.5 text-slate-500 font-bold">
                                                <Clock size={14} className="text-primary" />
                                                <span>{formatTime(a.date)} hs</span>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-slate-400 line-clamp-1">{a.reason}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                                    <StatusBadge status={a.status} />

                                    {a.status === "PENDING" && onCancel && (
                                        <button
                                            onClick={() => onCancel(a.id)}
                                            disabled={isCancelling}
                                            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                        >
                                            Cancelar
                                        </button>
                                    )}

                                    <div className="hidden md:block">
                                        <ChevronRight size={20} className="text-slate-300 group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
