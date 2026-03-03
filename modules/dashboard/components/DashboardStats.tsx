"use client";

import { Users, Leaf, ArrowUpRight, Activity } from "lucide-react";
import { DashboardData } from "@/lib/services/dashboard";

interface DashboardStatsProps {
    kpis: DashboardData["kpis"];
}

export function DashboardStats({ kpis }: DashboardStatsProps) {
    const kpiCards = [
        {
            label: "Pacientes Activos",
            value: kpis.activePatients.value.toString(),
            change: kpis.activePatients.growth !== undefined ? `${kpis.activePatients.growth >= 0 ? '+' : ''}${kpis.activePatients.growth}%` : "Estable",
            icon: Users,
            up: kpis.activePatients.growth >= 0
        },
        {
            label: "Gramos Dispensados (Mes)",
            value: `${kpis.gramsDispensed.value.toLocaleString()}g`,
            change: kpis.gramsDispensed.growth !== undefined ? `${kpis.gramsDispensed.growth >= 0 ? '+' : ''}${kpis.gramsDispensed.growth}%` : "Estable",
            icon: Activity,
            up: kpis.gramsDispensed.growth >= 0
        },
        {
            label: "Lotes en Cultivo",
            value: kpis.lotsInCultivation.value.toString(),
            change: kpis.lotsInCultivation.growth !== undefined ? `${kpis.lotsInCultivation.growth >= 0 ? '+' : ''}${kpis.lotsInCultivation.growth}%` : "Estable",
            icon: Leaf,
            up: kpis.lotsInCultivation.growth !== undefined ? kpis.lotsInCultivation.growth >= 0 : true
        },
        {
            label: "Recaudación Total",
            value: `$${(kpis.totalRevenue.value / 1000).toFixed(0)}k`,
            change: kpis.totalRevenue.growth !== undefined ? `${kpis.totalRevenue.growth >= 0 ? '+' : ''}${kpis.totalRevenue.growth}%` : "Estable",
            icon: ArrowUpRight,
            up: kpis.totalRevenue.growth >= 0
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiCards.map((stat, i) => (
                <div key={i} className="bg-card p-6 rounded-2xl border border-border card-hover">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-secondary/50 rounded-lg text-primary">
                            <stat.icon size={20} />
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.up ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                            }`}>
                            {stat.change}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
            ))}
        </div>
    );
}
