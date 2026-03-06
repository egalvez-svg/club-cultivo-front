"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, ShieldCheck, CheckCircle2, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { useLegalTexts, useSignDocument } from "@/lib/hooks/useMemberships";
import { sileo } from "sileo";

interface LegalSignModalProps {
    isOpen: boolean;
    needsApplicationSign: boolean;
    needsConsentSign: boolean;
}

export function LegalSignModal({ isOpen, needsApplicationSign, needsConsentSign }: LegalSignModalProps) {
    const { data: legalTexts, isLoading } = useLegalTexts();
    const signMutation = useSignDocument();

    // Step: "application" or "consent"
    const steps = [
        ...(needsApplicationSign ? ["application" as const] : []),
        ...(needsConsentSign ? ["consent" as const] : []),
    ];
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [acceptedApplication, setAcceptedApplication] = useState(false);
    const [acceptedConsent, setAcceptedConsent] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const currentStep = steps[currentStepIndex];
    const isLastStep = currentStepIndex === steps.length - 1;
    const totalSteps = steps.length;

    const handleSign = async () => {
        try {
            await signMutation.mutateAsync(currentStep);

            if (isLastStep) {
                setIsVisible(false);
                sileo.success({
                    title: "Documentos Firmados",
                    description: "Has completado la firma de todos los documentos legales.",
                });
            } else {
                setCurrentStepIndex((prev) => prev + 1);
                sileo.success({
                    title: "Documento Firmado",
                    description: "Avanzando al siguiente documento...",
                });
            }
        } catch (error: any) {
            sileo.error({
                title: "Error",
                description: error.message || "No se pudo registrar la firma.",
            });
        }
    };

    if (!isOpen || !isVisible || steps.length === 0) return null;

    const isCurrentAccepted = currentStep === "application" ? acceptedApplication : acceptedConsent;
    const currentText = currentStep === "application" ? legalTexts?.application : legalTexts?.dataConsent;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20 flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 bg-slate-50 border-b border-slate-100 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                {currentStep === "application" ? <FileText size={24} /> : <ShieldCheck size={24} />}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    {isLoading ? "Cargando..." : currentText?.title || "Documento Legal"}
                                </h3>
                                {totalSteps > 1 && (
                                    <p className="text-xs font-bold text-slate-400 mt-0.5">
                                        Paso {currentStepIndex + 1} de {totalSteps}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    {totalSteps > 1 && (
                        <div className="mt-4 flex gap-2">
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 flex-1 rounded-full transition-colors ${i <= currentStepIndex ? "bg-primary" : "bg-slate-200"}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="animate-spin text-primary" size={32} />
                        </div>
                    ) : (
                        <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap text-[13px]">
                            {currentText?.content}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 shrink-0 space-y-4">
                    {/* Checkbox de aceptacion */}
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={isCurrentAccepted}
                            onChange={(e) => {
                                if (currentStep === "application") {
                                    setAcceptedApplication(e.target.checked);
                                } else {
                                    setAcceptedConsent(e.target.checked);
                                }
                            }}
                            className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 mt-0.5 shrink-0"
                        />
                        <span className="text-sm font-medium text-slate-600 leading-snug">
                            {currentStep === "application"
                                ? "He leido y acepto la solicitud de ingreso a la asociacion."
                                : "He leido y acepto el consentimiento informado sobre el tratamiento de mis datos personales."
                            }
                        </span>
                    </label>

                    {/* Actions */}
                    <div className="flex gap-3">
                        {currentStepIndex > 0 && (
                            <button
                                onClick={() => setCurrentStepIndex((prev) => prev - 1)}
                                className="px-4 py-3.5 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm flex items-center gap-2 hover:bg-slate-100 transition-colors"
                            >
                                <ChevronLeft size={18} />
                                Anterior
                            </button>
                        )}
                        <button
                            onClick={handleSign}
                            disabled={!isCurrentAccepted || signMutation.isPending}
                            className="flex-1 py-3.5 rounded-2xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {signMutation.isPending ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    <CheckCircle2 size={18} />
                                    {isLastStep ? "Firmar y Finalizar" : "Firmar y Continuar"}
                                    {!isLastStep && <ChevronRight size={16} />}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
