"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    CalendarPlus,
    Edit2,
    Loader2,
    AlertTriangle,
    CheckCircle2,
    Plus,
    User as UserIcon,
    Phone,
    CalendarDays,
    FileText,
} from "lucide-react";
import { Patient } from "@/lib/services/patient";

interface AppointmentFormState {
    isPatient: boolean;
    patientId: string;
    guestName: string;
    guestPhone: string;
    date: string;
    time: string;
    reason: string;
}

interface AppointmentModalsProps {
    isCreateModalOpen: boolean;
    isEditModalOpen: boolean;
    isCancelModalOpen: boolean;
    onCloseCreate: () => void;
    onCloseEdit: () => void;
    onCloseCancel: () => void;
    selectedAppointmentName: string;
    patients: Patient[] | undefined;
    formState: AppointmentFormState;
    onFormChange: (field: string, value: any) => void;
    onCreateSubmit: (e: React.FormEvent) => void;
    onUpdateSubmit: (e: React.FormEvent) => void;
    onCancelConfirm: () => void;
    isPending: boolean;
}

export function AppointmentModals({
    isCreateModalOpen,
    isEditModalOpen,
    isCancelModalOpen,
    onCloseCreate,
    onCloseEdit,
    onCloseCancel,
    selectedAppointmentName,
    patients,
    formState,
    onFormChange,
    onCreateSubmit,
    onUpdateSubmit,
    onCancelConfirm,
    isPending,
}: AppointmentModalsProps) {
    const { isPatient, patientId, guestName, guestPhone, date, time, reason } = formState;

    return (
        <>
            {/* Create/Edit Modal */}
            <AnimatePresence>
                {(isCreateModalOpen || isEditModalOpen) && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => isCreateModalOpen ? onCloseCreate() : onCloseEdit()}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl glass bg-white rounded-[2.5rem] shadow-2xl border border-white/50 p-8 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        {isEditModalOpen ? <Edit2 size={24} /> : <CalendarPlus size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black">{isEditModalOpen ? "Editar Turno" : "Agendar Turno"}</h3>
                                        <p className="text-xs font-bold text-muted-foreground opacity-70">
                                            {isEditModalOpen ? "Modifica los datos del turno" : "Programa un nuevo turno"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => isCreateModalOpen ? onCloseCreate() : onCloseEdit()}
                                    className="p-2 rounded-full hover:bg-muted transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={isEditModalOpen ? onUpdateSubmit : onCreateSubmit} className="space-y-6">
                                {/* Toggle: Paciente registrado / Visitante */}
                                {isCreateModalOpen && (
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Tipo de persona</label>
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => onFormChange("isPatient", true)}
                                                className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${isPatient
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-transparent bg-muted/30 text-muted-foreground hover:bg-muted/50"
                                                    }`}
                                            >
                                                Paciente registrado
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onFormChange("isPatient", false)}
                                                className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${!isPatient
                                                    ? "border-violet-500 bg-violet-500/10 text-violet-600"
                                                    : "border-transparent bg-muted/30 text-muted-foreground hover:bg-muted/50"
                                                    }`}
                                            >
                                                Visitante
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Patient selector */}
                                {isPatient && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Paciente</label>
                                        <div className="relative group/input">
                                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                            <select
                                                required
                                                value={patientId}
                                                onChange={(e) => onFormChange("patientId", e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px] appearance-none"
                                            >
                                                <option value="">Seleccionar paciente...</option>
                                                {patients?.filter(p => p.status === "ACTIVE").map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.fullName} — {p.documentNumber}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* Guest fields */}
                                {!isPatient && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Nombre</label>
                                            <div className="relative group/input">
                                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    required
                                                    value={guestName}
                                                    onChange={(e) => onFormChange("guestName", e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px]"
                                                    placeholder="Ej: Maria Gonzalez"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Telefono <span className="text-muted-foreground/50">(Opcional)</span></label>
                                            <div className="relative group/input">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                                <input
                                                    type="tel"
                                                    value={guestPhone}
                                                    onChange={(e) => onFormChange("guestPhone", e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px]"
                                                    placeholder="Ej: 099123456"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Date & Time */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Fecha</label>
                                        <div className="relative group/input">
                                            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                            <input
                                                type="date"
                                                required
                                                value={date}
                                                onChange={(e) => onFormChange("date", e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px]"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Hora</label>
                                        <div className="relative group/input">
                                            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                            <input
                                                type="time"
                                                required
                                                value={time}
                                                onChange={(e) => onFormChange("time", e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Reason */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Motivo</label>
                                    <div className="relative group/input">
                                        <FileText className="absolute left-4 top-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                        <textarea
                                            required
                                            value={reason}
                                            onChange={(e) => onFormChange("reason", e.target.value)}
                                            rows={3}
                                            className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px] resize-none"
                                            placeholder="Ej: Retiro de medicacion"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => isCreateModalOpen ? onCloseCreate() : onCloseEdit()}
                                        className="flex-1 py-4.5 rounded-2xl font-black text-sm uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="flex-[2] py-4.5 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70"
                                    >
                                        {isPending ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <>
                                                {isEditModalOpen ? <CheckCircle2 size={20} /> : <Plus size={20} />}
                                                {isEditModalOpen ? "Guardar Cambios" : "Agendar Turno"}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Cancel Confirmation Modal */}
            <AnimatePresence>
                {isCancelModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onCloseCancel}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md glass bg-white rounded-[2rem] shadow-2xl border border-white/50 p-8 text-center"
                        >
                            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-6">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-black mb-2">Cancelar turno?</h3>
                            <p className="text-muted-foreground text-sm font-medium mb-8">
                                Estas a punto de cancelar el turno de <span className="text-foreground font-bold">{selectedAppointmentName}</span>.
                                El turno quedara marcado como cancelado.
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={onCloseCancel}
                                    className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
                                >
                                    Volver
                                </button>
                                <button
                                    onClick={onCancelConfirm}
                                    disabled={isPending}
                                    className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-500/20 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {isPending ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        "Cancelar Turno"
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
