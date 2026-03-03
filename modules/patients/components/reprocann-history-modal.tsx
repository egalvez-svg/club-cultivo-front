"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Loader2, Plus, AlertTriangle, CheckCircle2, Hash, CalendarDays, X } from "lucide-react";
import { Patient, ReprocanRecord } from "@/lib/services/patient";
import { usePatientReprocannHistory, useCreatePatientReprocann } from "@/lib/hooks/usePatients";
import { sileo } from "sileo";

interface ReprocannHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    patient: Patient | null;
}

export function ReprocannHistoryModal({ isOpen, onClose, patient }: ReprocannHistoryModalProps) {
    const { data: history, isLoading } = usePatientReprocannHistory(patient?.id || null);
    const createMutation = useCreatePatientReprocann();

    const [isAdding, setIsAdding] = useState(false);
    const [reprocanNumber, setReprocanNumber] = useState("");
    const [expirationDate, setExpirationDate] = useState("");

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!patient) return;

        createMutation.mutate(
            {
                patientId: patient.id,
                params: { reprocanNumber, expirationDate, status: "ACTIVE" }
            },
            {
                onSuccess: () => {
                    sileo.success({ title: "Registrado", description: "Nuevo REPROCANN agregado al historial." });
                    setIsAdding(false);
                    setReprocanNumber("");
                    setExpirationDate("");
                },
                onError: (error) => {
                    sileo.error({ title: "Error", description: error.message || "No se pudo agregar el REPROCANN" });
                }
            }
        );
    };

    if (!isOpen || !patient) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="p-6 border-b border-muted/30 flex justify-between items-center bg-muted/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-foreground">Historial REPROCANN</h2>
                            <p className="text-sm font-medium text-muted-foreground">{patient.fullName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {isAdding ? (
                        <form onSubmit={handleAdd} className="bg-muted/20 border border-muted/50 rounded-2xl p-6 mb-8">
                            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Ingresar Nuevo Carnet</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Nº REPROCANN</label>
                                    <div className="relative group/input">
                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={reprocanNumber}
                                            onChange={(e) => setReprocanNumber(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-transparent rounded-[1rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px] shadow-sm"
                                            placeholder="725901"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Vencimiento</label>
                                    <div className="relative group/input">
                                        <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                        <input
                                            type="date"
                                            required
                                            value={expirationDate}
                                            onChange={(e) => setExpirationDate(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-transparent rounded-[1rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px] shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-white rounded-xl font-bold text-sm text-muted-foreground hover:bg-muted transition-colors shadow-sm">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={createMutation.isPending} className="flex-[2] py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all disabled:opacity-70">
                                    {createMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle2 size={16} /> Guardar como Activo</>}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="w-full mb-8 py-4 border-2 border-dashed border-primary/30 rounded-2xl flex flex-col items-center justify-center text-primary hover:bg-primary/5 hover:border-primary/50 transition-all gap-2"
                        >
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Plus size={20} />
                            </div>
                            <span className="font-bold text-sm uppercase tracking-widest">Agregar Nuevo Carnet</span>
                        </button>
                    )}

                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 ml-1">Historial del Paciente</h3>
                        {isLoading ? (
                            <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" size={32} /></div>
                        ) : !history || history.length === 0 ? (
                            <div className="py-12 text-center bg-muted/10 rounded-2xl border border-muted/20">
                                <FileText className="mx-auto text-muted-foreground/30 mb-3" size={32} />
                                <p className="text-muted-foreground font-medium">No hay registros de REPROCANN.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {history.map((record) => (
                                    <div key={record.id} className="p-4 bg-white border border-muted rounded-2xl shadow-sm flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-muted/30 rounded-xl flex items-center justify-center text-muted-foreground">
                                                <Hash size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground text-sm">{record.reprocanNumber}</p>
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    Vence: {new Date(record.expirationDate).toLocaleDateString('es-AR')}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            {record.status === "ACTIVE" ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs">
                                                    <CheckCircle2 size={12} /> Activo
                                                </span>
                                            ) : record.status === "EXPIRED" ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 text-destructive font-bold text-xs">
                                                    <X size={12} /> Vencido
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 font-bold text-xs">
                                                    <AlertTriangle size={12} /> {record.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
