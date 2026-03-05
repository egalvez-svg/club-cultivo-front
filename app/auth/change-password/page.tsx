"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { KeyRound, Lock, CheckCircle2, Loader2, AlertCircle, LogOut, Eye, EyeOff } from "lucide-react";
import { authService } from "@/lib/services/auth";
import { useAuth } from "@/context/auth-context";
import { sileo } from "sileo";

export default function ForcedChangePasswordPage() {
    const { token, user, logout, refreshProfile, updateUser } = useAuth();
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

    // Si por alguna razón llega aquí y NO requiere cambio, lo mandamos al dashboard
    useEffect(() => {
        if (user && !user.requiresPasswordChange) {
            window.location.href = "/dashboard";
        }
    }, [user]);

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

            sileo.success({ title: "¡Éxito!", description: "Tu contraseña ha sido actualizada" });

            // Limpiar bandera localmente para evitar que el effect redirija de vuelta
            updateUser({ requiresPasswordChange: false });

            // Intentar refrescar perfil desde el backend (best effort)
            try { await refreshProfile(); } catch {}

            // Redirigir al dashboard
            window.location.href = "/dashboard";
        } catch (err: any) {
            setError(err.message || "Error al cambiar la contraseña");
            sileo.error({ title: "Error", description: err.message || "Verifica tu contraseña actual" });
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg"
            >
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mx-auto mb-6 shadow-xl shadow-primary/10">
                        <KeyRound size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Cambio de Contraseña</h1>
                    <p className="text-slate-500 font-medium">Por seguridad, debes actualizar tus credenciales antes de continuar.</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white p-10 shadow-2xl shadow-slate-200/50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-destructive/5 border border-destructive/10 rounded-2xl flex items-center gap-3 text-destructive"
                            >
                                <AlertCircle size={20} />
                                <p className="text-xs font-bold uppercase tracking-wider">{error}</p>
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Contraseña Actual</label>
                            <div className="relative group/input">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary transition-colors" size={20} />
                                <input
                                    type={showCurrent ? "text" : "password"}
                                    required
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                    className="w-full pl-14 pr-12 py-4.5 bg-slate-50 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-slate-900"
                                    placeholder="Tu contraseña actual"
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
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nueva Contraseña</label>
                            <div className="relative group/input">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary transition-colors" size={20} />
                                <input
                                    type={showNew ? "text" : "password"}
                                    required
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    className="w-full pl-14 pr-12 py-4.5 bg-slate-50 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-slate-900"
                                    placeholder="Elige una nueva"
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
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Confirmar Nueva Contraseña</label>
                            <div className="relative group/input">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary transition-colors" size={20} />
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full pl-14 pr-12 py-4.5 bg-slate-50 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-slate-900"
                                    placeholder="Repite la nueva"
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

                        <div className="pt-4 space-y-4">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-70"
                            >
                                {isPending ? (
                                    <Loader2 size={24} className="animate-spin" />
                                ) : (
                                    <>
                                        <CheckCircle2 size={24} />
                                        Actualizar Credenciales
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={logout}
                                className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-slate-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <LogOut size={14} />
                                Cerrar Sesión y salir
                            </button>
                        </div>
                    </form>
                </div>

                <p className="text-center mt-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                    Club Cultivo v2.0 • Seguridad Máxima
                </p>
            </motion.div>
        </div>
    );
}
