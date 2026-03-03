"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    UserPlus,
    Edit2,
    FileText,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    User as UserIcon,
    Hash,
    CalendarDays,
    Plus
} from "lucide-react";
import { Patient } from "@/lib/services/patient";

interface PatientModalsProps {
    isCreateModalOpen: boolean;
    isEditModalOpen: boolean;
    isDeleteModalOpen: boolean;
    onCloseCreate: () => void;
    onCloseEdit: () => void;
    onCloseDelete: () => void;
    selectedPatient: Patient | null;
    formState: {
        fullName: string;
        documentNumber: string;
        email: string;
        reprocanNumber: string;
        reprocanExpiration: string;
        docCheckStatus: string;
        docCheckInfo: { fullName?: string; email?: string; roles?: string[] };
    };
    onFormChange: (field: string, value: any) => void;
    onCreateSubmit: (e: React.FormEvent) => void;
    onUpdateSubmit: (e: React.FormEvent) => void;
    onDeleteConfirm: () => void;
    isPending: boolean;
}

export function PatientModals({
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    onCloseCreate,
    onCloseEdit,
    onCloseDelete,
    selectedPatient,
    formState,
    onFormChange,
    onCreateSubmit,
    onUpdateSubmit,
    onDeleteConfirm,
    isPending
}: PatientModalsProps) {
    const { fullName, documentNumber, email, reprocanNumber, reprocanExpiration, docCheckStatus, docCheckInfo } = formState;

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
                                        {isEditModalOpen ? <Edit2 size={24} /> : <UserPlus size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black">{isEditModalOpen ? "Editar Paciente" : "Nuevo Paciente"}</h3>
                                        <p className="text-xs font-bold text-muted-foreground opacity-70">
                                            {isEditModalOpen ? "Actualiza los datos del paciente" : "Registra un nuevo paciente en el sistema"}
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
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Documento (DNI)</label>
                                    <div className="relative group/input">
                                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={documentNumber}
                                            onChange={(e) => onFormChange("documentNumber", e.target.value)}
                                            className={`w-full pl-12 pr-12 py-3.5 bg-muted/30 border-2 rounded-[1.25rem] outline-none focus:ring-4 transition-all font-medium text-[15px] ${docCheckStatus === "already_patient"
                                                ? "border-destructive/40 focus:ring-destructive/10 focus:border-destructive/40"
                                                : docCheckStatus === "exists_can_add"
                                                    ? "border-amber-500/40 focus:ring-amber-500/10 focus:border-amber-500/40"
                                                    : docCheckStatus === "available"
                                                        ? "border-emerald-500/40 focus:ring-emerald-500/10 focus:border-emerald-500/40"
                                                        : "border-transparent focus:ring-primary/10 focus:border-primary/20"
                                                }`}
                                            placeholder="Ingresá el DNI del paciente"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            {docCheckStatus === "checking" && <Loader2 size={16} className="animate-spin text-muted-foreground" />}
                                            {docCheckStatus === "available" && <CheckCircle2 size={16} className="text-emerald-500" />}
                                            {docCheckStatus === "exists_can_add" && <AlertTriangle size={16} className="text-amber-500" />}
                                            {docCheckStatus === "already_patient" && <XCircle size={16} className="text-destructive" />}
                                        </div>
                                    </div>
                                    {docCheckStatus === "already_patient" && (
                                        <p className="text-[11px] font-bold text-destructive ml-1">
                                            {docCheckInfo.fullName ? `${docCheckInfo.fullName} ya es paciente.` : "Este documento ya tiene un paciente registrado."}
                                        </p>
                                    )}
                                    {docCheckStatus === "exists_can_add" && (
                                        <p className="text-[11px] font-bold text-amber-600 ml-1">
                                            {docCheckInfo.fullName || "Usuario"} ya es {docCheckInfo.roles?.join(", ")} — se le agregará el rol Paciente.
                                        </p>
                                    )}
                                    {docCheckStatus === "available" && (
                                        <p className="text-[11px] font-bold text-emerald-500 ml-1">Documento disponible ✓</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Nombre Completo</label>
                                        <div className="relative group/input">
                                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                            <input
                                                type="text"
                                                required
                                                value={fullName}
                                                onChange={(e) => onFormChange("fullName", e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px]"
                                                placeholder="Ej: María García"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Correo Electrónico <span className="text-muted-foreground/50">(Opcional)</span></label>
                                        <div className="relative group/input">
                                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => onFormChange("email", e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px]"
                                                placeholder="Ej: paciente@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Nº REPROCANN <span className="text-muted-foreground/50">(Opcional)</span></label>
                                        <div className="relative group/input">
                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                            <input
                                                type="text"
                                                value={reprocanNumber}
                                                onChange={(e) => onFormChange("reprocanNumber", e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px]"
                                                placeholder="Ej: 725901"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 max-w-xs">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Vencimiento REPROCANN <span className="text-muted-foreground/50">(Opcional)</span></label>
                                    <div className="relative group/input">
                                        <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                        <input
                                            type="date"
                                            value={reprocanExpiration}
                                            onChange={(e) => onFormChange("reprocanExpiration", e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px]"
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
                                        disabled={isPending || (!isEditModalOpen && docCheckStatus === "already_patient")}
                                        className="flex-[2] py-4.5 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70"
                                    >
                                        {isPending ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <>
                                                {isEditModalOpen ? <CheckCircle2 size={20} /> : <Plus size={20} />}
                                                {isEditModalOpen ? "Guardar Cambios" : "Registrar Paciente"}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && selectedPatient && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => onCloseDelete()}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md glass bg-white rounded-[2rem] shadow-2xl border border-white/50 p-8 text-center"
                        >
                            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-6">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-black mb-2">¿Suspender paciente?</h3>
                            <p className="text-muted-foreground text-sm font-medium mb-8">
                                Estás a punto de suspender a <span className="text-foreground font-bold">{selectedPatient.fullName}</span>.
                                No aparecerá en los listados activos pero sus datos se mantendrán para integridad histórica.
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => onCloseDelete()}
                                    className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={onDeleteConfirm}
                                    disabled={isPending}
                                    className="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {isPending ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        "Suspender"
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
