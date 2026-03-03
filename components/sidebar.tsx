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
    UserCog
} from "lucide-react";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";

export function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuth();

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
    }


    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border p-6 flex flex-col z-50">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
                    <Leaf size={24} />
                </div>
                <span className="font-bold text-xl tracking-tight">OmniGrow</span>
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
    );
}
