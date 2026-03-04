"use client";

import { motion } from "framer-motion";
import { Building2, Users, Leaf, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { SuperAdminDashboardKPIS } from "@/lib/services/dashboard";

interface SuperAdminStatsProps {
    kpis: SuperAdminDashboardKPIS;
}

export function SuperAdminStats({ kpis }: SuperAdminStatsProps) {
    const stats = [
        {
            title: "Organizaciones",
            value: kpis?.organizations?.value ?? 0,
            growth: kpis?.organizations?.growth,
            icon: Building2,
            color: "blue"
        },
        {
            title: "Usuarios Totales",
            value: kpis?.totalUsers?.value ?? 0,
            growth: kpis?.totalUsers?.growth,
            icon: Users,
            color: "purple"
        },
        {
            title: "Cepas Activas",
            value: kpis?.activeStrains?.value ?? 0,
            growth: kpis?.activeStrains?.growth,
            icon: Leaf,
            color: "emerald"
        },
        {
            title: "Estado Sistema",
            value: `${kpis?.systemStatus?.value ?? 0}%`,
            status: kpis?.systemStatus?.status ?? "optimal",
            icon: Activity,
            color: "amber"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >

                    <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                            <stat.icon size={28} />
                        </div>
                        {stat.growth !== undefined && (
                            <div className={`flex items-center gap-1 text-xs font-black uppercase tracking-widest ${stat.growth >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                                {stat.growth >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                {Math.abs(stat.growth)}%
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-slate-400 text-xs font-black uppercase tracking-[0.15em] mb-1">{stat.title}</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-800">{stat.value}</span>
                        </div>
                    </div>
                </motion.div>
            ))
            }
        </div >
    );
}
