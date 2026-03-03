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

    useEffect(() => {
        if (token) {
            dashboardService.getDashboardData(token)
                .then(setData)
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
