"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Loader2, KeyRound, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useResetPassword } from "@/lib/hooks/useAuth";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const resetMutation = useResetPassword();

    useEffect(() => {
        const t = searchParams.get("token");
        if (t) setToken(t);
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        if (newPassword.length < 6) {
            setValidationError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        if (newPassword !== confirmPassword) {
            setValidationError("Las contraseñas no coinciden");
            return;
        }

        if (!token) {
            setValidationError("El token de recuperación falta o es inválido");
            return;
        }

        resetMutation.mutate(
            { token, newPassword },
            {
                onSuccess: () => {
                    setIsSuccess(true);
                    setTimeout(() => router.push("/auth/login"), 3000);
                }
            }
        );
    };

    if (!token && !isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8faf9] px-4 text-center">
                <div className="max-w-md w-full glass p-8 rounded-[2.5rem] border-white/50 backdrop-blur-xl">
                    <AlertCircle className="mx-auto text-destructive mb-4" size={48} />
                    <h2 className="text-2xl font-bold mb-2">Token Inválido</h2>
                    <p className="text-muted-foreground mb-6">Este enlace de recuperación no es válido o ya ha sido utilizado.</p>
                    <Link href="/auth/forgot" className="text-primary font-bold hover:underline">
                        Solicitar nuevo enlace
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8faf9] relative overflow-hidden px-4">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative"
            >
                <div className="text-center mb-10">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                        <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
                    </div>
                    <h1 className="text-4xl font-extrabold text-primary tracking-tight mb-1">Nueva Contraseña</h1>
                    <p className="text-muted-foreground font-medium">Restablece el acceso a tu cuenta</p>
                </div>

                <div className="glass p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(45,90,76,0.1)] border border-white/50 backdrop-blur-xl relative overflow-hidden group">
                    {!isSuccess ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground ml-1">Nueva Contraseña</label>
                                <div className="relative group/input">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type={showNew ? "text" : "password"}
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-white/60 border-2 border-transparent rounded-2xl py-3.5 pl-12 pr-12 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 text-[15px]"
                                        placeholder="Mínimo 6 caracteres"
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
                                <label className="text-sm font-semibold text-muted-foreground ml-1">Confirmar Contraseña</label>
                                <div className="relative group/input">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary">
                                        <KeyRound size={20} />
                                    </div>
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-white/60 border-2 border-transparent rounded-2xl py-3.5 pl-12 pr-12 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 text-[15px]"
                                        placeholder="Repite tu contraseña"
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

                            {(validationError || resetMutation.isError) && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold p-4 rounded-2xl flex items-center gap-3">
                                    <AlertCircle size={18} />
                                    {validationError || (resetMutation.error instanceof Error ? resetMutation.error.message : "Error al restablecer")}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={resetMutation.isPending}
                                className="w-full py-4.5 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl transition-all hover:bg-primary/95 hover:-translate-y-0.5"
                            >
                                {resetMutation.isPending ? <Loader2 className="animate-spin" size={22} /> : "Actualizar Contraseña"}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                <CheckCircle2 size={40} />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">¡Contraseña Cambiada!</h2>
                            <p className="text-sm text-muted-foreground mb-8">Tu contraseña ha sido actualizada correctamente. Serás redirigido al login en unos segundos...</p>
                            <Link href="/auth/login" className="text-primary font-bold hover:underline">Ir al Login ahora</Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
