"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, UserCog, Heart, Shield, ChevronLeft, Eye, EyeOff } from "lucide-react";
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
    const [showPassword, setShowPassword] = useState(false);
    const loginMutation = useLogin();

    // Navigation logic: force password change if required
    const handleNavigation = (data: AuthResponse) => {
        if (data.user?.requiresPasswordChange) {
            router.push("/auth/change-password");
        } else {
            // Role-based main page
            if (data.user?.activeRole === "PATIENT") {
                router.push("/paciente");
            } else {
                router.push("/dashboard");
            }
        }
    };

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
                            handleNavigation(data);
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
        handleNavigation(pendingAuthData);
    };

    const handleBackToLogin = () => {
        setShowRoleSelector(false);
        setPendingAuthData(null);
        setAvailableRoles([]);
    };

    return (
        <div className="fixed inset-0 flex flex-col lg:flex-row bg-[#081410] text-white font-sans overflow-hidden">
            <div className="absolute inset-0 bg-[#081410] -z-10" />
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 xl:p-16 bg-[#0a1f18] border-r border-white/5 relative">
                {/* Background Decor */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center p-2">
                        <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain brightness-0" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">CLUB CULTIVO</span>
                </div>

                <div className="relative z-10 space-y-8">
                    <h1 className="text-5xl xl:text-6xl font-black leading-[1.1] tracking-tighter">
                        GESTIÓN DE
                        <br />
                        <span className="text-primary">CULTIVO</span>
                        <br />
                        INTELIGENTE
                    </h1>
                    <p className="text-white/40 text-lg max-w-md leading-relaxed">
                        Sistema integral para la trazabilidad y dispensación en asociaciones cannábicas.
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                        {["Membresías", "Trazabilidad", "Dispensario", "Inventario", "Finanzas", "Reportes"].map((s) => (
                            <span key={s} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-white/50">
                                {s}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
                    SISTEMA PROFESIONAL • v2.0
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#081410]">
                <div className="w-full max-w-[360px] space-y-8">
                    {/* Header */}
                    <div className="text-left space-y-2">
                        <h2 className="text-3xl font-black tracking-tight">ACCESO</h2>
                        <p className="text-white/40 text-sm font-medium">Ingresá tus credenciales para continuar.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-primary/50 focus:bg-white/5 transition-all text-sm font-medium"
                                        placeholder="admin@clubcultivo.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between px-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Password</label>
                                    <Link href="/auth/forgot" className="text-[9px] font-bold uppercase tracking-widest text-primary hover:underline">¿Olvidaste la clave?</Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-12 outline-none focus:border-primary/50 focus:bg-white/5 transition-all text-sm font-medium"
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {loginMutation.isError && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {loginMutation.error instanceof Error ? loginMutation.error.message : "Error de acceso"}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="w-full py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {loginMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    <span>Ingresar</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-5">
                        <div className="flex items-center gap-2 text-[8px] text-white/20 font-bold uppercase tracking-widest">
                            <ShieldCheck size={14} className="text-primary" />
                            Protocolo de Seguridad SSL
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">¿Sos nuevo en el club?</p>
                            <Link href="/postulacion" className="px-6 py-2 rounded-full border border-primary/30 text-primary font-black uppercase tracking-widest text-[9px] hover:bg-primary hover:text-[#081410] transition-all">
                                Solicitar Ingreso
                            </Link>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showRoleSelector && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="fixed inset-0 z-50 flex items-center justify-center bg-[#081410]/90 backdrop-blur-sm p-6"
                            >
                                <div className="w-full max-w-[400px] bg-[#0a1f18] border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                                    <button onClick={handleBackToLogin} className="relative z-10 flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-white/30 hover:text-white mb-6 transition-colors">
                                        <ChevronLeft size={14} /> Volver
                                    </button>

                                    <div className="relative z-10 mb-8">
                                        <h3 className="text-2xl font-black tracking-tight mb-2">IDENTIDAD</h3>
                                        <p className="text-white/40 text-[11px] font-medium uppercase tracking-widest leading-relaxed">
                                            Hola <span className="text-primary">{pendingAuthData?.user?.fullName || pendingAuthData?.user?.name}</span>, seleccioná tu rol.
                                        </p>
                                    </div>

                                    <div className="relative z-10 space-y-3">
                                        {availableRoles.map((role) => {
                                            const config = ROLE_CONFIG[role.name] || { icon: Shield, label: role.name, description: "Entrar", color: "text-primary" };
                                            return (
                                                <button
                                                    key={role.id}
                                                    onClick={() => handleRoleSelect(role.name)}
                                                    className="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-primary/40 transition-all group text-left"
                                                >
                                                    <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${config.color}`}>
                                                        <config.icon size={20} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold uppercase tracking-tight">{config.label}</p>
                                                        <p className="text-[9px] text-white/20 font-medium uppercase tracking-widest">{config.description}</p>
                                                    </div>
                                                    <ArrowRight size={16} className="text-white/10 group-hover:text-primary transition-colors" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
