"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Users,
    Leaf,
    Package,
    ShoppingCart,
    BarChart3,
    Settings,
    Wallet,
    UserCog,
    ShieldAlert,
    Building2,
    CalendarClock,
    Clock
} from "lucide-react";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { useUI } from "@/context/ui-context";
import { X } from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuth();
    const { isSidebarOpen, closeSidebar } = useUI();

    // No mostrar el sidebar en las rutas de autenticación
    if (pathname?.startsWith("/auth")) {
        return null;
    }


    let sections: { title?: string, items: any[] }[] = [];
    const isActive = (href: string) => pathname === href;

    if (user?.activeRole === "PATIENT") {
        sections = [
            {
                items: [
                    { icon: Home, label: "Mi Tratamiento", href: "/paciente" },
                    { icon: CalendarClock, label: "Mis Turnos", href: "/paciente/turnos" },
                    { icon: Package, label: "Catálogo", href: "/paciente/catalogo" },
                ]
            }
        ];
    } else {
        const adminItems = [
            { icon: ShieldAlert, label: "Membresías", href: "/dashboard/membership/pending" },
            { icon: UserCog, label: "Personal", href: "/users" },
            { icon: BarChart3, label: "Reportes", href: "/reports" },
        ];

        if (user?.activeRole === "SUPER_ADMIN") {
            adminItems.push({ icon: Building2, label: "Organizaciones", href: "/organizations" });
        }

        sections = [
            {
                title: "General",
                items: [{ icon: Home, label: "Resumen", href: "/dashboard" }]
            },
            {
                title: "Gestión Clínica",
                items: [
                    { icon: CalendarClock, label: "Turnos", href: "/appointments" },
                    { icon: Clock, label: "Malla Horaria", href: "/appointments/availability" },
                    { icon: Users, label: "Pacientes", href: "/patients" },
                ]
            },
            {
                title: "Inventario y Cultivo",
                items: [
                    { icon: Leaf, label: "Cepas", href: "/strains" },
                    { icon: Package, label: "Lotes", href: "/lots" },
                    { icon: Package, label: "Productos", href: "/products" },
                ]
            },
            {
                title: "Operaciones",
                items: [
                    { icon: ShoppingCart, label: "Dispensación", href: "/dispensations" },
                    { icon: Wallet, label: "Caja", href: "/finance" },
                ]
            },
            {
                title: "Administración",
                items: adminItems
            }
        ];
    }


    return (
        <>
            {/* Overlay para móvil */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeSidebar}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside className={cn(
                "fixed left-0 top-0 h-screen w-64 bg-card border-r border-border p-6 flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between mb-10 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
                            <Leaf size={24} />
                        </div>
                        <span className="font-bold text-xl tracking-tight">OmniGrow</span>
                    </div>
                    <button
                        onClick={closeSidebar}
                        className="p-2 -mr-2 text-muted-foreground hover:text-foreground lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-6 overflow-y-auto no-scrollbar pr-2 -mr-2">
                    {sections.map((section, idx) => (
                        <div key={section.title || idx} className="space-y-1">
                            {section.title && (
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 px-3">
                                    {section.title}
                                </p>
                            )}
                            <div className="space-y-0.5">
                                {section.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => {
                                            if (window.innerWidth < 1024) closeSidebar();
                                        }}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group relative",
                                            isActive(item.href)
                                                ? "text-primary bg-primary/10 font-bold"
                                                : "text-slate-500 hover:text-primary hover:bg-slate-50"
                                        )}
                                    >
                                        <item.icon size={18} className={cn(
                                            "transition-colors",
                                            isActive(item.href) ? "text-primary" : "text-slate-400 group-hover:text-primary"
                                        )} />
                                        <span className="text-sm">{item.label}</span>
                                        {isActive(item.href) && (
                                            <motion.div
                                                layoutId="active-pill"
                                                className="absolute left-0 w-1 h-5 bg-primary rounded-full"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="mt-auto space-y-1 pt-6 border-t border-border">
                    <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-all">
                        <Settings size={20} />
                        <span>Configuración</span>
                    </button>
                </div>

            </aside>
        </>
    );
}
