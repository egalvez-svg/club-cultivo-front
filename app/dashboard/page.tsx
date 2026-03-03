"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { dashboardService, DashboardData } from "@/lib/services/dashboard";
import { useAuth } from "@/context/auth-context";

// Components
import { DashboardStats } from "@/modules/dashboard/components/DashboardStats";
import { RecentActivity } from "@/modules/dashboard/components/RecentActivity";
import { TodayAppointments } from "@/modules/dashboard/components/TodayAppointments";

export default function DashboardPage() {
    const { token } = useAuth();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (token) {
            setLoading(true);
            setError(null);
            dashboardService.getDashboardData(token)
                .then(setData)
                .catch(err => {
                    console.error(err);
                    setError(err.message);
                })
                .finally(() => setLoading(false));
        }
    }, [token]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive max-w-md text-center">
                    <h3 className="font-bold mb-1">No se pudieron cargar los datos</h3>
                    <p className="text-sm opacity-90">{error}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-8">
            <DashboardStats kpis={data.kpis} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <RecentActivity dispensations={data.recentDispensations} />
                <TodayAppointments appointments={data.todayAppointments} />
            </div>
        </div>
    );
}
