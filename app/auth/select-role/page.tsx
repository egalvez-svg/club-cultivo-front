"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, UserCog, Heart, ChevronLeft } from "lucide-react";
import { useAuth } from "@/context/auth-context";

const ROLE_CONFIG: Record<string, { icon: typeof Shield; label: string; description: string; color: string }> = {
    ADMIN: { icon: Shield, label: "Administrador", description: "Gestión completa del sistema", color: "text-primary" },
    OPERARIO: { icon: UserCog, label: "Operario", description: "Dispensación y atención", color: "text-blue-600" },
    PATIENT: { icon: Heart, label: "Paciente", description: "Mis dispensas y perfil", color: "text-rose-500" },
};

export default function SelectRolePage() {
    const router = useRouter();
    const { user, setActiveRole } = useAuth();

    useEffect(() => {
        if (!user) {
            router.push("/auth/login");
        } else if (user.roles?.length === 1) {
            setActiveRole(user.roles[0].name);
            router.push("/dashboard");
        }
    }, [user, router, setActiveRole]);

    if (!user || !user.roles || user.roles.length <= 1) return null;

    const handleRoleSelect = (roleName: string) => {
        setActiveRole(roleName);
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8faf9] relative overflow-hidden px-4">
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
                        <motion.div
                            key="role-selector"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <button
                                onClick={() => router.push("/dashboard")}
                                className="flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-6"
                            >
                                <ChevronLeft size={16} />
                                Volver al Dashboard
                            </button>

                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-black text-foreground mb-2">Cambiar Rol</h2>
                                <p className="text-sm text-muted-foreground font-medium">
                                    Hola <span className="text-foreground font-bold">{user.fullName || user.name}</span>, seleccioná tu rol para continuar.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {user.roles.map((role, index) => {
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
                                            className="w-full bg-white/60 border-2 border-transparent hover:border-primary/20 hover:bg-white p-4 rounded-2xl flex items-center gap-4 transition-all group/btn shadow-sm"
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm border border-black/5 group-hover/btn:scale-110 transition-transform ${config.color}`}>
                                                <Icon size={24} />
                                            </div>
                                            <div className="text-left flex-1">
                                                <h3 className="font-bold text-foreground text-[15px]">{config.label}</h3>
                                                <p className="text-xs font-medium text-muted-foreground">{config.description}</p>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
