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
    Building2
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


    const menuItems = [
        { icon: Home, label: "Resumen", href: "/dashboard" },
        { icon: Users, label: "Pacientes", href: "/patients" },
        { icon: Leaf, label: "Cepas", href: "/strains" },
        { icon: Package, label: "Lotes", href: "/lots" },
        { icon: Package, label: "Productos", href: "/products" },
        { icon: ShoppingCart, label: "Dispensación", href: "/dispensations" },
        { icon: Wallet, label: "Caja", href: "/finance" },
        { icon: BarChart3, label: "Reportes", href: "/reports" },
    ];

    // Solo añadir el ítem de Personal si el usuario es ADMIN
    if (user?.activeRole === "ADMIN" || user?.role === "ADMIN") {
        menuItems.push({ icon: UserCog, label: "Personal", href: "/users" });
        menuItems.push({ icon: ShieldAlert, label: "Roles", href: "/roles" });
        menuItems.push({ icon: Building2, label: "Organizaciones", href: "/organizations" });
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

                <nav className="flex-1 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                                pathname === item.href
                                    ? "text-primary bg-secondary/50 font-medium"
                                    : "text-muted-foreground hover:text-primary hover:bg-muted"
                            )}
                        >
                            <item.icon size={20} className={cn(
                                "transition-colors",
                                pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                            )} />
                            <span>{item.label}</span>
                            {pathname === item.href && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute left-0 w-1 h-6 bg-primary rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
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
