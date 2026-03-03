"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowRight, CheckCircle2, ChevronLeft } from "lucide-react";
import { useForgotPassword } from "@/lib/hooks/useAuth";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const forgotMutation = useForgotPassword();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        forgotMutation.mutate({ email }, {
            onSuccess: () => {
                setIsSubmitted(true);
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8faf9] relative overflow-hidden px-4">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md relative"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="inline-block mb-4"
                    >
                        <div className="relative w-24 h-24 mx-auto cursor-pointer" onClick={() => window.location.href = '/'}>
                            <Image
                                src="/logo.png"
                                alt="Club Cultivo Logo"
                                fill
                                className="object-contain drop-shadow-xl"
                                priority
                            />
                        </div>
                    </motion.div>
                    <h1 className="text-4xl font-extrabold text-primary tracking-tight mb-1">Club Cultivo</h1>
                    <p className="text-muted-foreground font-medium">Gestión de Cultivo Inteligente</p>
                </div>

                <div className="glass p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(45,90,76,0.1)] border border-white/50 backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

                    <div className="relative">
                        {!isSubmitted ? (
                            <>
                                <Link
                                    href="/auth/login"
                                    className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors mb-6 group/back"
                                >
                                    <ChevronLeft size={14} className="group-hover/back:-translate-x-0.5 transition-transform" />
                                    Volver al inicio de sesión
                                </Link>

                                <h2 className="text-2xl font-bold mb-4 text-foreground">
                                    Recuperar Contraseña
                                </h2>
                                <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                                    Ingresa tu correo corporativo y te enviaremos las instrucciones para restablecer tu contraseña.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground ml-1">
                                            Correo Corporativo
                                        </label>
                                        <div className="relative group/input">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors">
                                                <Mail size={20} />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-white/60 border-2 border-transparent rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all text-[15px] shadow-sm hover:bg-white/80"
                                                placeholder="tu-correo@empresa.com"
                                            />
                                        </div>
                                    </div>

                                    {forgotMutation.isError && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold p-4 rounded-2xl flex items-center gap-3"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-destructive" />
                                            {forgotMutation.error instanceof Error ? forgotMutation.error.message : "Error al procesar la solicitud"}
                                        </motion.div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={forgotMutation.isPending}
                                        className="w-full py-4.5 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/30 transition-all hover:bg-primary/95 hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-70 cursor-pointer relative overflow-hidden group/btn"
                                    >
                                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                        {forgotMutation.isPending ? (
                                            <Loader2 className="animate-spin" size={22} />
                                        ) : (
                                            <>
                                                <span className="relative">Enviar Enlace</span>
                                                <ArrowRight className="relative group-hover/btn:translate-x-1 transition-transform" size={20} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-4"
                            >
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h2 className="text-2xl font-bold mb-4 text-foreground">¡Solicitud Enviada!</h2>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                                    Si el correo <b>{email}</b> existe en nuestro sistema, recibirás en breve un enlace para restablecer tu contraseña.
                                </p>
                                <div className="space-y-4">
                                    <Link
                                        href="/auth/login"
                                        className="block w-full py-4 bg-white/80 border border-border rounded-2xl font-bold text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm"
                                    >
                                        Volver al Login
                                    </Link>
                                    <p className="text-xs text-muted-foreground">
                                        ¿No recibiste nada? Revisa tu carpeta de spam o{" "}
                                        <button
                                            onClick={() => setIsSubmitted(false)}
                                            className="text-primary font-bold hover:underline"
                                        >
                                            intenta de nuevo
                                        </button>
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center mt-12 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest"
                >
                    © {new Date().getFullYear()} Club Cultivo • Versión PRO 2.0
                </motion.p>
            </motion.div>
        </div>
    );
}
