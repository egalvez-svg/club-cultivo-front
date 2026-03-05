"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight, Leaf, Eye, EyeOff } from "lucide-react";
import { useRegister } from "@/lib/hooks/useAuth";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const registerMutation = useRegister();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        registerMutation.mutate(
            { email, password },
            {
                onSuccess: () => {
                    setSuccess(true);
                },
            }
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8faf9] relative overflow-hidden px-4">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-block mb-4"
                    >
                        <div className="relative w-20 h-20 mx-auto">
                            <Image
                                src="/logo.png"
                                alt="Club Cultivo Logo"
                                fill
                                className="object-contain drop-shadow-sm"
                            />
                        </div>
                    </motion.div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Club Cultivo</h1>
                    <p className="text-muted-foreground">Únete a nuestra comunidad de cultivo</p>
                </div>

                <div className="glass p-8 rounded-[2rem] shadow-xl border border-white/40 relative overflow-hidden">
                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
                                <Leaf size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-primary mb-2">¡Bienvenido al Club!</h2>
                            <p className="text-muted-foreground mb-6">
                                Tu cuenta ha sido creada con éxito. Ya puedes iniciar sesión.
                            </p>
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center justify-center w-full py-3 px-6 bg-primary text-primary-foreground rounded-xl font-medium transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95"
                            >
                                Ir a Iniciar Sesión
                            </Link>
                        </motion.div>
                    ) : (
                        <>
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                Crear Cuenta
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground ml-1">
                                        Correo Electrónico
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/50 border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground ml-1">
                                        Contraseña
                                    </label>
                                    <div className="relative group/input">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-white/50 border border-border rounded-xl py-3 pl-12 pr-12 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none"
                                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {registerMutation.isError && (
                                    <motion.p
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-destructive text-xs font-medium bg-destructive/5 p-3 rounded-lg border border-destructive/10"
                                    >
                                        {registerMutation.error instanceof Error ? registerMutation.error.message : "Error al registrarse"}
                                    </motion.p>
                                )}

                                <button
                                    type="submit"
                                    disabled={registerMutation.isPending}
                                    className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 cursor-pointer"
                                >
                                    {registerMutation.isPending ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            Registrarse
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-border flex flex-col items-center gap-2">
                                <p className="text-sm text-muted-foreground">
                                    ¿Ya tienes una cuenta?{" "}
                                    <Link href="/auth/login" className="text-primary font-bold hover:underline">
                                        Inicia Sesión
                                    </Link>
                                </p>
                            </div>
                        </>
                    )}
                </div>

                <p className="text-center mt-8 text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Club Cultivo. Cultivando comunidad para un futuro más verde.
                </p>
            </motion.div>
        </div>
    );
}
