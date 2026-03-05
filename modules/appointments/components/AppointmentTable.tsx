"use client";

import { motion } from "framer-motion";
import {
    Search,
    Calendar,
    Clock,
    User,
    Phone,
    MoreVertical,
    CheckCircle2,
    XCircle,
    AlertCircle,
} from "lucide-react";
import { Appointment } from "@/lib/services/appointment";

interface AppointmentTableProps {
    appointments: Appointment[] | undefined;
    isLoading: boolean;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onActionClick: (appointment: Appointment, rect: DOMRect) => void;
    activeMenuId: string | null;
}

const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatTime = (date: string): string => {
    return new Date(date).toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getDisplayName = (a: Appointment): string => {
    return a.patient?.fullName ?? a.guestName ?? "Sin nombre";
};

const StatusBadge = ({ status }: { status: Appointment["status"] }) => {
    switch (status) {
        case "PENDING":
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold text-[10px] border border-amber-500/20">
                    <AlertCircle size={10} /> Pendiente
                </span>
            );
        case "COMPLETED":
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px] border border-emerald-500/20">
                    <CheckCircle2 size={10} /> Completado
                </span>
            );
        case "CANCELLED":
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 font-bold text-[10px] border border-red-500/20">
                    <XCircle size={10} /> Cancelado
                </span>
            );
    }
};

const TypeBadge = ({ appointment }: { appointment: Appointment }) => {
    if (appointment.patientId) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 font-bold text-[11px]">
                <User size={10} /> Paciente
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-violet-500/10 text-violet-600 font-bold text-[11px]">
            <User size={10} /> Visitante
        </span>
    );
};

export function AppointmentTable({
    appointments,
    isLoading,
    searchTerm,
    onSearchChange,
    onActionClick,
    activeMenuId,
}: AppointmentTableProps) {
    const filtered = appointments?.filter((a) => {
        const name = getDisplayName(a).toLowerCase();
        const reason = a.reason.toLowerCase();
        const term = searchTerm.toLowerCase();
        return name.includes(term) || reason.includes(term);
    });

    return (
        <div className="glass rounded-[2rem] border border-white/50 shadow-xl bg-white/40 backdrop-blur-md">
            <div className="p-6 border-b border-white/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o motivo..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-white/60 border-2 border-transparent rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all text-sm font-medium"
                    />
                </div>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden p-4 space-y-4">
                {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="animate-pulse bg-white/60 rounded-2xl p-4 border border-white/40 space-y-3">
                            <div className="flex gap-3">
                                <div className="h-10 w-10 bg-muted rounded-xl" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 w-2/3 bg-muted rounded" />
                                    <div className="h-3 w-1/3 bg-muted rounded" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : filtered?.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        <Calendar size={40} className="mx-auto mb-4 opacity-30" />
                        <p className="font-bold">Sin resultados</p>
                    </div>
                ) : (
                    filtered?.map((a, index) => (
                        <motion.div
                            key={a.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 space-y-3"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {getDisplayName(a).charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm leading-none">{getDisplayName(a)}</p>
                                        {a.guestPhone && (
                                            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                                <Phone size={10} /> {a.guestPhone}
                                            </p>
                                        )}
                                        {a.patient?.documentNumber && (
                                            <p className="text-[10px] text-muted-foreground mt-1">
                                                DNI: {a.patient.documentNumber}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        onActionClick(a, rect);
                                    }}
                                    className="p-2 rounded-lg hover:bg-white transition-colors"
                                >
                                    <MoreVertical size={18} className="text-muted-foreground" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-[11px]">
                                <div className="space-y-1">
                                    <p className="text-muted-foreground font-bold uppercase tracking-tighter">Fecha</p>
                                    <span className="font-medium">{formatDate(a.date)}</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground font-bold uppercase tracking-tighter">Hora</p>
                                    <span className="font-medium">{formatTime(a.date)}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-white/40">
                                <p className="text-[11px] text-muted-foreground font-medium truncate max-w-[60%]">{a.reason}</p>
                                <StatusBadge status={a.status} />
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-0 text-sm">
                    <thead>
                        <tr className="bg-muted/10 text-left border-b border-white/20">
                            <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest rounded-tl-3xl">Persona</th>
                            <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tipo</th>
                            <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Fecha</th>
                            <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hora</th>
                            <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Motivo</th>
                            <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Estado</th>
                            <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right rounded-tr-3xl">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            Array(3).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-5"><div className="h-10 w-48 bg-muted rounded-xl" /></td>
                                    <td className="px-6 py-5"><div className="h-6 w-20 bg-muted rounded-lg" /></td>
                                    <td className="px-6 py-5"><div className="h-6 w-24 bg-muted rounded-lg" /></td>
                                    <td className="px-6 py-5"><div className="h-6 w-16 bg-muted rounded-lg" /></td>
                                    <td className="px-6 py-5"><div className="h-6 w-32 bg-muted rounded-lg" /></td>
                                    <td className="px-6 py-5"><div className="h-6 w-20 bg-muted rounded-full mx-auto" /></td>
                                    <td className="px-6 py-5"><div className="h-8 w-8 bg-muted rounded-lg ml-auto" /></td>
                                </tr>
                            ))
                        ) : filtered?.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-20 text-center text-muted-foreground">
                                    <Calendar size={40} className="mx-auto mb-4 opacity-30" />
                                    <p className="font-bold">Sin resultados</p>
                                    <p className="text-sm mt-1">No se encontraron turnos para tu busqueda.</p>
                                </td>
                            </tr>
                        ) : (
                            filtered?.map((a, index) => (
                                <motion.tr
                                    key={a.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-white/40 transition-colors group relative"
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                                {getDisplayName(a).charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-foreground">{getDisplayName(a)}</p>
                                                {a.guestPhone && (
                                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                                        <Phone size={10} /> {a.guestPhone}
                                                    </p>
                                                )}
                                                {a.patient?.documentNumber && (
                                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                                        DNI: {a.patient.documentNumber}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <TypeBadge appointment={a} />
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                            <Calendar size={14} className="opacity-50" />
                                            {formatDate(a.date)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                            <Clock size={14} className="opacity-50" />
                                            {formatTime(a.date)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-medium text-muted-foreground truncate max-w-[200px]">{a.reason}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-center">
                                            <StatusBadge status={a.status} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right relative">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                onActionClick(a, rect);
                                            }}
                                            className="p-2 rounded-xl text-muted-foreground hover:bg-white transition-all group-hover:opacity-100 relative z-30"
                                        >
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
