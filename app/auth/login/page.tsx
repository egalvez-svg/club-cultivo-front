"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, UserCog, Heart, Shield, ChevronLeft } from "lucide-react";
import { useLogin } from "@/lib/hooks/useAuth";
import { useAuth } from "@/context/auth-context";
import { AuthResponse, UserRole } from "@/lib/services/auth";

const ROLE_CONFIG: Record<string, { icon: typeof Shield; label: string; description: string; color: string }> = {
    ADMIN: { icon: Shield, label: "Administrador", description: "Gestión completa del sistema", color: "text-primary" },
    OPERARIO: { icon: UserCog, label: "Operario", description: "Dispensación y atención", color: "text-blue-600" },
    PATIENT: { icon: Heart, label: "Paciente", description: "Mis dispensas y perfil", color: "text-rose-500" },
};

export default function LoginPage() {
    const router = useRouter();
    const { login, setActiveRole } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const loginMutation = useLogin();

    // Multi-role state
    const [pendingAuthData, setPendingAuthData] = useState<AuthResponse | null>(null);
    const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);
    const [showRoleSelector, setShowRoleSelector] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        loginMutation.mutate(
            { email, password },
            {
                onSuccess: (data) => {
                    if (data?.access_token || data?.token) {
                        const roles = data.user?.roles || [];

                        if (roles.length > 1) {
                            // Multiple roles → show selector
                            setPendingAuthData(data);
                            setAvailableRoles(roles);
                            setShowRoleSelector(true);
                        } else {
                            // Single role or no roles → direct login
                            login(data);
                            if (roles.length === 1) {
                                setActiveRole(roles[0].name);
                            }
                            router.push("/dashboard");
                        }
                    }
                },
                onError: (error) => {
                    console.error("LoginPage: Error en la mutación de login", error);
                }
            }
        );
    };

    const handleRoleSelect = (roleName: string) => {
        if (!pendingAuthData) return;
        login(pendingAuthData);
        setActiveRole(roleName);
        router.push("/dashboard");
    };

    const handleBackToLogin = () => {
        setShowRoleSelector(false);
        setPendingAuthData(null);
        setAvailableRoles([]);
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
                        <div className="relative w-24 h-24 mx-auto">
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
                        <AnimatePresence mode="wait">
                            {!showRoleSelector ? (
                                <motion.div
                                    key="login-form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h2 className="text-2xl font-bold mb-8 text-foreground flex items-center gap-2">
                                        Iniciar Sesión
                                    </h2>

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
                                                    placeholder="admin@clubcultivo.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center ml-1">
                                                <label className="text-sm font-semibold text-muted-foreground">
                                                    Contraseña
                                                </label>
                                                <Link href="/auth/forgot" className="text-xs font-bold text-primary hover:underline">
                                                    ¿Olvidaste tu contraseña?
                                                </Link>
                                            </div>
                                            <div className="relative group/input">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors">
                                                    <Lock size={20} />
                                                </div>
                                                <input
                                                    type="password"
                                                    required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full bg-white/60 border-2 border-transparent rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all text-[15px] shadow-sm hover:bg-white/80"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>

                                        {loginMutation.isError && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold p-4 rounded-2xl flex items-center gap-3"
                                            >
                                                <div className="w-2 h-2 rounded-full bg-destructive" />
                                                {loginMutation.error instanceof Error ? loginMutation.error.message : "Credenciales inválidas"}
                                            </motion.div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={loginMutation.isPending}
                                            className="w-full py-4.5 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/30 transition-all hover:bg-primary/95 hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-70 disabled:active:scale-100 disabled:hover:translate-y-0 cursor-pointer overflow-hidden relative group/btn"
                                        >
                                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                            {loginMutation.isPending ? (
                                                <Loader2 className="animate-spin" size={22} />
                                            ) : (
                                                <>
                                                    <span className="relative">Acceder al Panel</span>
                                                    <ArrowRight className="relative group-hover/btn:translate-x-1 transition-transform" size={20} />
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    <div className="mt-10 pt-8 border-t border-border flex flex-col items-center gap-4">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                            <ShieldCheck size={14} className="text-accent" />
                                            Conexión segura y cifrada
                                        </div>
                                        <p className="text-sm text-muted-foreground font-medium">
                                            ¿Nuevo en el club?{" "}
                                            <Link href="/auth/register" className="text-primary font-bold hover:underline">
                                                Registrar nueva cuenta
                                            </Link>
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="role-selector"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <button
                                        onClick={handleBackToLogin}
                                        className="flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-6"
                                    >
                                        <ChevronLeft size={16} />
                                        Volver
                                    </button>

                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-black text-foreground mb-2">¿Cómo querés ingresar?</h2>
                                        <p className="text-sm text-muted-foreground font-medium">
                                            Hola <span className="text-foreground font-bold">{pendingAuthData?.user?.fullName || pendingAuthData?.user?.name}</span>, seleccioná tu rol para continuar.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        {availableRoles.map((role, index) => {
                                            const config = ROLE_CONFIG[role.name] || {
                                                icon: Shield,
                                                label: role.name,
                                                description: "Acceso al sistema",
                                                color: "text-primary",
                                            };
                                            const Icon = config.icon;

                                            return (
                                                <motion.button
                                                    key={role.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    onClick={() => handleRoleSelect(role.name)}
                                                    className="w-full flex items-center gap-4 p-4 bg-white/60 hover:bg-white/90 border-2 border-transparent hover:border-primary/20 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-lg group/role cursor-pointer"
                                                >
                                                    <div className={`w-12 h-12 rounded-2xl bg-current/10 flex items-center justify-center ${config.color}`} style={{ backgroundColor: "currentcolor", opacity: 0.1, position: "relative" }}>
                                                        <Icon size={24} className={`${config.color} absolute`} style={{ opacity: 1 }} />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <p className="font-bold text-foreground">{config.label}</p>
                                                        <p className="text-xs text-muted-foreground font-medium">{config.description}</p>
                                                    </div>
                                                    <ArrowRight size={18} className="text-muted-foreground group-hover/role:text-primary group-hover/role:translate-x-1 transition-all" />
                                                </motion.button>
                                            );
                                        })}
                                    </div>

                                    {availableRoles.some(r => r.isDefault) && (
                                        <p className="text-center text-[11px] text-muted-foreground/60 font-medium mt-6">
                                            Tu rol predeterminado es <span className="font-bold">{ROLE_CONFIG[availableRoles.find(r => r.isDefault)?.name || ""]?.label || "—"}</span>
                                        </p>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
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
