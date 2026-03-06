"use client";

import { useState } from "react";
import {
    X,
    CheckCircle2,
    XCircle,
    FileText,
    Hash,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MembershipRequest, membershipService } from "@/lib/services/membership";
import { useApproveMembership, useRejectMembership } from "@/lib/hooks/useMemberships";
import { sileo } from "sileo";
import { useAuth } from "@/context/auth-context";

interface ApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: MembershipRequest | null;
}

export function ApprovalModal({ isOpen, onClose, request }: ApprovalModalProps) {
    const { token } = useAuth();
    const [minutesBookEntry, setMinutesBookEntry] = useState("");
    const [memberNumber, setMemberNumber] = useState("");

    const approveMutation = useApproveMembership();
    const rejectMutation = useRejectMembership();
    const [downloadingFile, setDownloadingFile] = useState<"application" | "consent" | null>(null);

    const handleApprove = async () => {
        if (!request) return;
        if (!minutesBookEntry || !memberNumber) {
            sileo.error({ title: "Campos Requeridos", description: "Por favor complete el Nº de Acta y el Nº de Socio." });
            return;
        }

        try {
            await approveMutation.mutateAsync({
                id: request.id,
                params: { minutesBookEntry, memberNumber }
            });
            sileo.success({ title: "¡Aprobado!", description: "El socio ha sido aprobado exitosamente." });
            onClose();
        } catch (error: any) {
            sileo.error({ title: "Error", description: error.message || "No se pudo aprobar la membresía." });
        }
    };

    const handleReject = async () => {
        if (!request) return;

        try {
            await rejectMutation.mutateAsync(request.id);
            sileo.warning({ title: "Rechazado", description: "La solicitud de membresía ha sido rechazada." });
            onClose();
        } catch (error: any) {
            sileo.error({ title: "Error", description: error.message || "No se pudo rechazar la membresía." });
        }
    };

    if (!isOpen || !request) return null;

    const isPending = approveMutation.isPending || rejectMutation.isPending;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20"
            >
                {/* Header */}
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Aprobación de Socio</h3>
                        <div className="flex flex-col mt-1">
                            <p className="text-sm text-slate-500 font-bold leading-tight">{request.user.fullName}</p>
                            <p className="text-xs text-slate-400 font-medium">{request.user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={async () => {
                                if (downloadingFile) return;
                                setDownloadingFile("application");
                                try {
                                    await membershipService.downloadApplicationForm(request.id, token || "");
                                } catch (error) {
                                    sileo.error({ title: "Error", description: "No se pudo descargar la solicitud." });
                                } finally {
                                    setDownloadingFile(null);
                                }
                            }}
                            disabled={!!downloadingFile}
                            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all disabled:opacity-50"
                        >
                            {downloadingFile === "application" ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                            Descargar Solicitud de Ingreso
                        </button>
                        <button
                            onClick={async () => {
                                if (downloadingFile) return;
                                setDownloadingFile("consent");
                                try {
                                    await membershipService.downloadConsentForm(request.id, token || "");
                                } catch (error) {
                                    sileo.error({ title: "Error", description: "No se pudo descargar el consentimiento." });
                                } finally {
                                    setDownloadingFile(null);
                                }
                            }}
                            disabled={!!downloadingFile}
                            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all disabled:opacity-50"
                        >
                            {downloadingFile === "consent" ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                            Descargar Consentimiento Ley 25.326
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                Nº de Acta / Folio
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={minutesBookEntry}
                                    onChange={(e) => setMinutesBookEntry(e.target.value)}
                                    placeholder="Ej: Acta 12, Folio 45"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-slate-900"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                Nº de Socio
                            </label>
                            <div className="relative">
                                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={memberNumber}
                                    onChange={(e) => setMemberNumber(e.target.value)}
                                    placeholder="Ej: 001-2024"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-slate-900"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <p className="text-xs text-amber-700 leading-relaxed font-medium">
                            <span className="font-bold">Nota:</span> Al aprobar, el paciente podrá realizar dispensaciones en el sistema. Asegúrese de que los datos coincidan con el libro de actas físico.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button
                        onClick={handleReject}
                        disabled={isPending}
                        className="flex-1 px-4 py-3.5 rounded-2xl border border-rose-200 text-rose-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors disabled:opacity-50"
                    >
                        {isPending ? <Loader2 className="animate-spin" size={18} /> : <XCircle size={18} />}
                        Rechazar
                    </button>
                    <button
                        onClick={handleApprove}
                        disabled={isPending}
                        className="flex-[2] px-4 py-3.5 rounded-2xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {isPending ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                        Aprobar Socio
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
