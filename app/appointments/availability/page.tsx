"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CalendarClock,
    Plus,
    Trash2,
    X,
    Loader2,
    Clock,
    Settings,
} from "lucide-react";
import {
    useAvailabilityConfigs,
    useCreateAvailabilityConfig,
    useDeleteAvailabilityConfig,
} from "@/lib/hooks/useAvailability";
import {
    WEEKDAY_LABELS,
    REASON_LABELS,
    AppointmentReason,
    AvailabilityConfig,
} from "@/lib/services/availability";
import { sileo } from "sileo";

const REASONS = Object.entries(REASON_LABELS) as [AppointmentReason, string][];

export default function AvailabilityConfigPage() {
    const { data: configs, isLoading } = useAvailabilityConfigs();
    const createMutation = useCreateAvailabilityConfig();
    const deleteMutation = useDeleteAvailabilityConfig();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dayOfWeek, setDayOfWeek] = useState(1);
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");
    const [slotDuration, setSlotDuration] = useState(30);
    const [reason, setReason] = useState<AppointmentReason>("MEDICAL_CONSULTATION");

    const resetForm = () => {
        setDayOfWeek(1);
        setStartTime("09:00");
        setEndTime("17:00");
        setSlotDuration(30);
        setReason("MEDICAL_CONSULTATION");
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(
            { dayOfWeek, startTime, endTime, slotDuration, reason },
            {
                onSuccess: () => {
                    setIsModalOpen(false);
                    resetForm();
                    sileo.success({ title: "Regla creada", description: "La disponibilidad fue configurada" });
                },
                onError: (error) => {
                    sileo.error({ title: "Error", description: error.message });
                },
            }
        );
    };

    const handleDelete = (id: string) => {
        deleteMutation.mutate(id, {
            onSuccess: () => {
                sileo.success({ title: "Eliminada", description: "La regla fue eliminada" });
            },
            onError: (error) => {
                sileo.error({ title: "Error", description: error.message });
            },
        });
    };

    // Group configs by day
    const byDay = (configs || []).reduce<Record<number, AvailabilityConfig[]>>((acc, c) => {
        (acc[c.dayOfWeek] = acc[c.dayOfWeek] || []).push(c);
        return acc;
    }, {});

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Malla Horaria</h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">
                        Configura los horarios disponibles para turnos en tu organizacion.
                    </p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5 active:scale-95"
                >
                    <Plus size={18} />
                    <span>Nueva Regla</span>
                </button>
            </div>

            {/* Weekly Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center h-[40vh]">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 0].map((day) => {
                        const dayConfigs = byDay[day] || [];
                        return (
                            <motion.div
                                key={day}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: day * 0.03 }}
                                className="glass rounded-[2rem] border border-white/50 shadow-sm bg-white/40 backdrop-blur-md overflow-hidden"
                            >
                                <div className="px-6 py-4 border-b border-white/40 bg-muted/10">
                                    <h3 className="font-black text-sm uppercase tracking-widest text-slate-700">
                                        {WEEKDAY_LABELS[day]}
                                    </h3>
                                </div>
                                <div className="p-4 space-y-3 min-h-[120px]">
                                    {dayConfigs.length === 0 ? (
                                        <p className="text-xs text-muted-foreground text-center py-6 font-medium">
                                            Sin horarios configurados
                                        </p>
                                    ) : (
                                        dayConfigs.map((c) => (
                                            <div
                                                key={c.id}
                                                className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-white/40 group"
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={12} className="text-primary" />
                                                        <span className="text-xs font-bold text-slate-700">
                                                            {c.startTime} - {c.endTime}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full">
                                                            {c.slotDuration}min
                                                        </span>
                                                    </div>
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/10 text-primary font-bold text-[10px]">
                                                        {REASON_LABELS[c.reason as AppointmentReason] || c.reason}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(c.id)}
                                                    disabled={deleteMutation.isPending}
                                                    className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Create Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg glass bg-white rounded-[2.5rem] shadow-2xl border border-white/50 p-8"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Settings size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black">Nueva Regla de Disponibilidad</h3>
                                        <p className="text-xs font-bold text-muted-foreground opacity-70">
                                            Define un rango horario para un dia de la semana
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 rounded-full hover:bg-muted transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-6">
                                {/* Day of week */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Dia de la semana</label>
                                    <select
                                        value={dayOfWeek}
                                        onChange={(e) => setDayOfWeek(Number(e.target.value))}
                                        className="w-full px-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px] appearance-none"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                                            <option key={d} value={d}>{WEEKDAY_LABELS[d]}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Time range */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Hora Inicio</label>
                                        <input
                                            type="time"
                                            required
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            className="w-full px-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Hora Fin</label>
                                        <input
                                            type="time"
                                            required
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            className="w-full px-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px]"
                                        />
                                    </div>
                                </div>

                                {/* Slot duration */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Duracion del turno (minutos)</label>
                                    <input
                                        type="number"
                                        required
                                        min={5}
                                        max={120}
                                        step={5}
                                        value={slotDuration}
                                        onChange={(e) => setSlotDuration(Number(e.target.value))}
                                        className="w-full px-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px]"
                                    />
                                </div>

                                {/* Reason */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Motivo</label>
                                    <select
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value as AppointmentReason)}
                                        className="w-full px-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px] appearance-none"
                                    >
                                        {REASONS.map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4.5 rounded-2xl font-black text-sm uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createMutation.isPending}
                                        className="flex-[2] py-4.5 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70"
                                    >
                                        {createMutation.isPending ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <>
                                                <Plus size={20} />
                                                Crear Regla
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
