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

    // Calendar Constants
    const START_HOUR = 8;
    const END_HOUR = 21;
    const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);
    const DAYS = [1, 2, 3, 4, 5, 6, 0]; // Lunes to Domingo

    const timeToMinutes = (time: string) => {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    };

    const getPosition = (startTime: string, endTime: string) => {
        const startMin = timeToMinutes(startTime);
        const endMin = timeToMinutes(endTime);
        const calendarStartMin = START_HOUR * 60;
        const calendarTotalMin = (END_HOUR - START_HOUR + 1) * 60;

        const top = ((startMin - calendarStartMin) / calendarTotalMin) * 100;
        const height = ((endMin - startMin) / calendarTotalMin) * 100;

        return { top: `${top}%`, height: `${height}%` };
    };

    const getReasonColor = (reason: AppointmentReason) => {
        switch (reason) {
            case "MEDICAL_CONSULTATION": return "bg-blue-500/10 border-blue-500/20 text-blue-600";
            case "DISPENSATION": return "bg-emerald-500/10 border-emerald-500/20 text-emerald-600";
            case "REPROCAN_RENEWAL": return "bg-purple-500/10 border-purple-500/20 text-purple-600";
            default: return "bg-slate-500/10 border-slate-500/20 text-slate-600";
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tightest">Malla Horaria</h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">
                        Configura los bloques de disponibilidad semanal de tu organización.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-1 active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Nueva Regla</span>
                    </button>
                </div>
            </div>

            {/* Calendar View */}
            {isLoading ? (
                <div className="flex items-center justify-center h-[50vh]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-primary" size={40} />
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cargando disponibilidad...</p>
                    </div>
                </div>
            ) : (
                <div className="glass rounded-[2.5rem] border border-white/50 shadow-2xl bg-white/40 backdrop-blur-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <div className="min-w-[800px] flex flex-col">
                            {/* Days Header */}
                            <div className="flex border-b border-white/40 bg-muted/5">
                                <div className="w-20 shrink-0 border-r border-white/20" />
                                {DAYS.map(day => (
                                    <div key={day} className="flex-1 py-4 text-center border-r border-white/10 last:border-r-0">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                            {WEEKDAY_LABELS[day].slice(0, 3)}
                                        </span>
                                        <h4 className="text-sm font-black text-slate-700">{WEEKDAY_LABELS[day]}</h4>
                                    </div>
                                ))}
                            </div>

                            {/* Grid Body */}
                            <div className="relative flex h-[800px]">
                                {/* Time Scale */}
                                <div className="w-20 shrink-0 border-r border-white/20 bg-muted/5 relative">
                                    {HOURS.map(hour => (
                                        <div key={hour} className="absolute w-full text-center" style={{ top: `${((hour - START_HOUR) / (END_HOUR - START_HOUR + 1)) * 100}%` }}>
                                            <span className="text-[10px] font-bold text-slate-400 -translate-y-1/2 inline-block bg-white/50 px-2 rounded-full">
                                                {String(hour).padStart(2, '0')}:00
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Columns */}
                                <div className="flex-1 flex relative">
                                    {/* Background Grid Lines */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        {HOURS.map(hour => (
                                            <div key={hour} className="absolute w-full border-t border-slate-200/30" style={{ top: `${((hour - START_HOUR) / (END_HOUR - START_HOUR + 1)) * 100}%` }} />
                                        ))}
                                    </div>

                                    {DAYS.map(day => (
                                        <div key={day} className="flex-1 relative border-r border-white/10 last:border-r-0 group/col">
                                            {/* Hover highlight */}
                                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/col:opacity-100 transition-opacity pointer-events-none" />
                                            
                                            {/* Config Blocks */}
                                            {(byDay[day] || []).map(c => {
                                                const pos = getPosition(c.startTime, c.endTime);
                                                const colorClass = getReasonColor(c.reason as AppointmentReason);
                                                return (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        key={c.id}
                                                        style={{ position: 'absolute', left: '4px', right: '4px', ...pos }}
                                                        className={`z-10 rounded-xl border p-2 shadow-sm overflow-hidden group/block hover:shadow-md hover:z-20 transition-all ${colorClass}`}
                                                    >
                                                        <div className="flex flex-col h-full justify-between">
                                                            <div className="space-y-0.5">
                                                                <p className="text-[9px] font-black leading-tight uppercase tracking-tight">
                                                                    {REASON_LABELS[c.reason as AppointmentReason] || c.reason}
                                                                </p>
                                                                <p className="text-[10px] font-bold opacity-80">
                                                                    {c.startTime} - {c.endTime}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center justify-between mt-auto pt-1 border-t border-current/10">
                                                                <span className="text-[8px] font-black uppercase tracking-widest bg-current/5 px-1.5 py-0.5 rounded-md">
                                                                    {c.slotDuration}M
                                                                </span>
                                                                <button
                                                                    onClick={() => handleDelete(c.id)}
                                                                    className="p-1 rounded-md hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover/block:opacity-100"
                                                                >
                                                                    <Trash2 size={10} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
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
                                            Define un rango horario para un día de la semana
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

                            <form onSubmit={handleCreate} className="space-y-6 text-slate-700">
                                {/* Day of week */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Día de la semana</label>
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
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Duración del turno (minutos)</label>
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
