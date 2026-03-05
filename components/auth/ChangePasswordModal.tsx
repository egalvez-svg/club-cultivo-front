"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, KeyRound, CheckCircle2, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { authService } from "@/lib/services/auth";
import { useAuth } from "@/context/auth-context";
import { sileo } from "sileo";

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
    const { token } = useAuth();
    const [isPending, setIsPending] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [error, setError] = useState<string | null>(null);

    // Block body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Las contraseñas nuevas no coinciden");
            return;
        }

        if (formData.newPassword.length < 6) {
            setError("La nueva contraseña debe tener al menos 6 caracteres");
            return;
        }

        setIsPending(true);
        try {
            if (!token) throw new Error("No hay sesión activa");

            await authService.changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            }, token);

            sileo.success({ title: "¡Listo!", description: "Contraseña actualizada correctamente" });
            onClose();
            setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err: any) {
            setError(err.message || "Error al cambiar la contraseña");
            sileo.error({ title: "Error", description: err.message || "No se pudo cambiar la contraseña" });
        } finally {
            setIsPending(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md glass bg-white rounded-[2.5rem] shadow-2xl border border-white/50 flex flex-col overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-8 pb-6 border-b border-muted/20 shrink-0 bg-muted/5">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <KeyRound size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black">Cambio de Contraseña</h3>
                                    <p className="text-xs font-bold text-muted-foreground opacity-70">
                                        Ingresa tus datos para actualizar el acceso
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 pt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3 text-destructive">
                                        <AlertCircle size={20} />
                                        <p className="text-xs font-bold">{error}</p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Contraseña Actual</label>
                                    <div className="relative group/input">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                        <input
                                            type={showCurrent ? "text" : "password"}
                                            required
                                            value={formData.currentPassword}
                                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                            className="w-full pl-12 pr-12 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px]"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrent(!showCurrent)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none"
                                            aria-label={showCurrent ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        >
                                            {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Nueva Contraseña</label>
                                    <div className="relative group/input">
                                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                        <input
                                            type={showNew ? "text" : "password"}
                                            required
                                            value={formData.newPassword}
                                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                            className="w-full pl-12 pr-12 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px]"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNew(!showNew)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none"
                                            aria-label={showNew ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        >
                                            {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Confirmar Nueva Contraseña</label>
                                    <div className="relative group/input">
                                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                        <input
                                            type={showConfirm ? "text" : "password"}
                                            required
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full pl-12 pr-12 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px]"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none"
                                            aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        >
                                            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
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
                                                <CheckCircle2 size={20} />
                                                Actualizar
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
