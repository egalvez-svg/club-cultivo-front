"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Building2, UserCircle, LogOut, ChevronDown, Check, Shield, UserCog, Heart, Repeat } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const ROLE_LABELS: Record<string, { label: string; icon: typeof Shield; color: string }> = {
    ADMIN: { label: "Administrador", icon: Shield, color: "bg-primary/10 text-primary" },
    OPERARIO: { label: "Operario", icon: UserCog, color: "bg-blue-500/10 text-blue-600" },
    PATIENT: { label: "Paciente", icon: Heart, color: "bg-rose-500/10 text-rose-500" },
};

export function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, activeRole, setActiveRole, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // No mostrar el header en las rutas de autenticación
    if (pathname?.startsWith("/auth")) {
        return null;
    }

    if (!user) return null;

    const userName = user.fullName || user.name || (user.email ? user.email.split("@")[0] : "Usuario");
    const currentRoleConfig = ROLE_LABELS[activeRole || ""] || { label: activeRole || "Operador", icon: UserCog, color: "bg-muted text-muted-foreground" };
    const organizationName = user.organization?.name || user.clubName || user.orgName || "Sede Central";
    const roles = user.roles || [];

    return (
        <header className="h-20 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
            <div>
                <h1 className="text-xl font-bold text-foreground">Panel de Gestión</h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <Building2 size={12} className="text-primary" />
                    {organizationName}
                </p>
            </div>

            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 p-2 -m-2 rounded-2xl hover:bg-muted/50 transition-all cursor-pointer group"
                >
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-foreground capitalize">{userName}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${currentRoleConfig.color.split(" ")[1]}`}>
                            {currentRoleConfig.label}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <UserCircle size={24} />
                    </div>
                    <ChevronDown size={14} className={`text-muted-foreground transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                    {isDropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-[calc(100%+8px)] w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden z-50"
                        >
                            {/* User Info */}
                            <div className="p-4 border-b border-muted/20">
                                <p className="text-sm font-black text-foreground">{userName}</p>
                                <p className="text-xs text-muted-foreground font-medium truncate">{user.email}</p>
                                <span className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${currentRoleConfig.color}`}>
                                    <currentRoleConfig.icon size={10} />
                                    {currentRoleConfig.label}
                                </span>
                            </div>

                            {/* Role Switcher */}
                            {roles.length > 1 && (
                                <div className="p-2 border-b border-muted/20">
                                    <Link
                                        href="/auth/select-role"
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-muted/50 transition-all cursor-pointer group/switch"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover/switch:scale-110 transition-transform">
                                                <Repeat size={14} />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-foreground">Cambiar Rol</p>
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Selección visual</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )}

                            {/* Logout */}
                            <div className="p-2">
                                <button
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        logout();
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-destructive hover:bg-destructive/5 transition-all cursor-pointer"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                                        <LogOut size={14} />
                                    </div>
                                    <p className="text-sm font-bold">Cerrar Sesión</p>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
