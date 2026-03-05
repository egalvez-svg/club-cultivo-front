"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    CalendarClock,
    Loader2,
    Check,
    ChevronLeft,
    Stethoscope,
    Leaf,
    FileText,
} from "lucide-react";
import { useAvailableSlots } from "@/lib/hooks/useAvailability";
import { useCreateAppointment } from "@/lib/hooks/useAppointments";
import { useAuth } from "@/context/auth-context";
import { AppointmentReason } from "@/lib/services/availability";
import { sileo } from "sileo";
import { cn } from "@/lib/utils";

interface BookingStepperModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const REASON_OPTIONS: { key: AppointmentReason; label: string; icon: typeof Stethoscope; color: string; bg: string }[] = [
    { key: "MEDICAL_CONSULTATION", label: "Consulta Medica", icon: Stethoscope, color: "text-blue-600", bg: "bg-blue-500/10 border-blue-500/20" },
    { key: "DISPENSATION", label: "Retiro de Flores/Aceites", icon: Leaf, color: "text-emerald-600", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { key: "REPROCAN_RENEWAL", label: "Renovacion Reprocan", icon: FileText, color: "text-violet-600", bg: "bg-violet-500/10 border-violet-500/20" },
];

export function BookingStepperModal({ isOpen, onClose }: BookingStepperModalProps) {
    const { user } = useAuth();
    const createMutation = useCreateAppointment();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [reason, setReason] = useState<AppointmentReason | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    const { data: slots, isLoading: slotsLoading } = useAvailableSlots(
        selectedDate || null,
        reason
    );

    const reset = () => {
        setStep(1);
        setReason(null);
        setSelectedDate("");
        setSelectedSlot(null);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleReasonSelect = (r: AppointmentReason) => {
        setReason(r);
        setSelectedDate("");
        setSelectedSlot(null);
        setStep(2);
    };

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        setSelectedSlot(null);
        setStep(3);
    };

    const handleConfirm = () => {
        if (!user?.id || !reason || !selectedDate || !selectedSlot) return;

        const dateTime = `${selectedDate}T${selectedSlot}:00.000Z`;
        createMutation.mutate(
            {
                patientId: user.id,
                date: dateTime,
                reason,
            },
            {
                onSuccess: () => {
                    handleClose();
                    sileo.success({ title: "Turno agendado", description: "Tu turno fue reservado exitosamente" });
                },
                onError: (error) => {
                    sileo.error({ title: "Error", description: error.message || "No se pudo agendar el turno" });
                },
            }
        );
    };

    // Generate next 14 days for the calendar
    const calendarDays = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        return d.toISOString().split("T")[0];
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg glass bg-white rounded-[2.5rem] shadow-2xl border border-white/50 p-8 max-h-[90vh] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                {step > 1 && (
                                    <button
                                        onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                                        className="p-2 rounded-full hover:bg-muted transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                )}
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <CalendarClock size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black">Solicitar Turno</h3>
                                    <p className="text-xs font-bold text-muted-foreground opacity-70">
                                        Paso {step} de 3
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-full hover:bg-muted transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Progress bar */}
                        <div className="flex gap-2 mb-8">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={cn(
                                        "h-1.5 rounded-full flex-1 transition-all duration-300",
                                        s <= step ? "bg-primary" : "bg-muted/40"
                                    )}
                                />
                            ))}
                        </div>

                        {/* Step 1: Reason */}
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-4"
                            >
                                <p className="text-sm font-bold text-slate-600 mb-4">Selecciona el motivo de tu visita</p>
                                {REASON_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.key}
                                        onClick={() => handleReasonSelect(opt.key)}
                                        className={cn(
                                            "w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98]",
                                            opt.bg
                                        )}
                                    >
                                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", opt.bg, opt.color)}>
                                            <opt.icon size={24} />
                                        </div>
                                        <span className={cn("font-black text-sm", opt.color)}>{opt.label}</span>
                                    </button>
                                ))}
                            </motion.div>
                        )}

                        {/* Step 2: Date */}
                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-4"
                            >
                                <p className="text-sm font-bold text-slate-600 mb-4">Selecciona una fecha</p>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {calendarDays.map((day) => {
                                        const d = new Date(day + "T12:00:00");
                                        const dayName = d.toLocaleDateString("es-AR", { weekday: "short" });
                                        const dayNum = d.getDate();
                                        const monthName = d.toLocaleDateString("es-AR", { month: "short" });

                                        return (
                                            <button
                                                key={day}
                                                onClick={() => handleDateSelect(day)}
                                                className={cn(
                                                    "flex flex-col items-center p-3 rounded-2xl border-2 transition-all hover:scale-105 active:scale-95",
                                                    selectedDate === day
                                                        ? "border-primary bg-primary/10 text-primary"
                                                        : "border-transparent bg-muted/20 hover:border-primary/30"
                                                )}
                                            >
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{dayName}</span>
                                                <span className="text-2xl font-black leading-none mt-1">{dayNum}</span>
                                                <span className="text-[10px] font-bold text-muted-foreground mt-1">{monthName}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Slot */}
                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-bold text-slate-600">Horarios disponibles</p>
                                    <span className="text-xs font-bold text-primary">
                                        {new Date(selectedDate + "T12:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
                                    </span>
                                </div>

                                {slotsLoading ? (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {Array(8).fill(0).map((_, i) => (
                                            <div key={i} className="animate-pulse h-12 bg-muted/30 rounded-xl" />
                                        ))}
                                    </div>
                                ) : !slots || slots.length === 0 ? (
                                    <div className="text-center py-10">
                                        <CalendarClock size={40} className="mx-auto mb-4 text-slate-300" />
                                        <p className="font-bold text-slate-700">Sin horarios disponibles</p>
                                        <p className="text-sm text-muted-foreground mt-1">Prueba seleccionando otro dia.</p>
                                        <button
                                            onClick={() => setStep(2)}
                                            className="mt-4 px-6 py-2 bg-primary/10 text-primary rounded-xl font-bold text-sm hover:bg-primary/20 transition-colors"
                                        >
                                            Cambiar fecha
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                            {slots.map((slot) => (
                                                <button
                                                    key={slot}
                                                    onClick={() => setSelectedSlot(slot)}
                                                    className={cn(
                                                        "py-3 px-4 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 border-2",
                                                        selectedSlot === slot
                                                            ? "border-primary bg-primary text-white shadow-lg shadow-primary/30"
                                                            : "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 hover:border-emerald-500/40"
                                                    )}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>

                                        {selectedSlot && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="pt-4"
                                            >
                                                <button
                                                    onClick={handleConfirm}
                                                    disabled={createMutation.isPending}
                                                    className="w-full py-4.5 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70"
                                                >
                                                    {createMutation.isPending ? (
                                                        <Loader2 size={20} className="animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Check size={20} />
                                                            Confirmar Turno - {selectedSlot} hs
                                                        </>
                                                    )}
                                                </button>
                                            </motion.div>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
