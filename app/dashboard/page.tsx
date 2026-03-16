"use client";

import { useEffect, useState } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import { dashboardService, DashboardData, SuperAdminDashboardKPIS, OrganizationSummary, LiveActivity } from "@/lib/services/dashboard";
import { useAuth } from "@/context/auth-context";
import { useSearchParams, useRouter } from "next/navigation";

// Components
import { DashboardStats } from "@/modules/dashboard/components/DashboardStats";
import { RecentActivity } from "@/modules/dashboard/components/RecentActivity";
import { TodayAppointments } from "@/modules/dashboard/components/TodayAppointments";

// SuperAdmin Components
import { SuperAdminStats } from "@/modules/dashboard/components/SuperAdminStats";
import { OrganizationList } from "@/modules/dashboard/components/OrganizationList";
import { LiveActivityConsole } from "@/modules/dashboard/components/LiveActivityConsole";

export default function DashboardPage() {
    const { token, user } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [superAdminKPIs, setSuperAdminKPIs] = useState<SuperAdminDashboardKPIS | null>(null);
    const [liveActivity, setLiveActivity] = useState<LiveActivity[]>([]);
    const [organizations, setOrganizations] = useState<OrganizationSummary[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const organizationId = searchParams.get("organizationId");
    const isSuperAdmin = user?.activeRole === "SUPER_ADMIN";
    const isPatient = user?.activeRole === "PATIENT";
    const isApplicant = user?.activeRole === "APPLICANT";

    // Redirigir si es paciente o postulante a su dashboard específico
    useEffect(() => {
        if (isPatient || isApplicant) {
            router.replace("/paciente");
        }
    }, [isPatient, isApplicant, router]);

    // Si hay organizationId, estamos viendo el detalle de un club (solo SuperAdmin)
    const isViewingClub = isSuperAdmin && !!organizationId;

    useEffect(() => {
        if (token && !isPatient) {
            setLoading(true);
            setError(null);

            if (isViewingClub) {
                // Ver detalle de un club específico
                dashboardService.getDashboardData(token, organizationId!)
                    .then(setData)
                    .catch((err: any) => setError(err.message))
                    .finally(() => setLoading(false));
            } else if (isSuperAdmin) {
                // Panel Global SuperAdmin
                Promise.all([
                    dashboardService.getSuperAdminKPIs(token),
                    dashboardService.getSuperAdminOrganizations(token)
                ])
                    .then(([kpiResponse, orgs]) => {
                        setSuperAdminKPIs(kpiResponse.kpis);
                        setLiveActivity(kpiResponse.liveActivity);
                        setOrganizations(orgs);
                    })
                    .catch((err: any) => setError(err.message))
                    .finally(() => setLoading(false));
            } else {
                // Dashboard Normal
                dashboardService.getDashboardData(token)
                    .then(setData)
                    .catch((err: any) => setError(err.message))
                    .finally(() => setLoading(false));
            }
        }
    }, [token, isSuperAdmin, isViewingClub, organizationId]);

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

    // SuperAdmin Global View
    if (isSuperAdmin && !isViewingClub && superAdminKPIs) {
        return (
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-800">Panel del Sistema</h2>
                    <p className="text-sm font-bold text-slate-400">Visión global de todas las organizaciones</p>
                </div>

                <SuperAdminStats kpis={superAdminKPIs} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <OrganizationList organizations={organizations} />
                    <LiveActivityConsole activities={liveActivity} />
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-8">
            {isViewingClub && (
                <div className="flex items-center gap-4 mb-2">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary hover:border-primary transition-all shadow-sm"
                    >
                        <ArrowLeft size={16} /> Volver al Global
                    </button>
                    <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                        Modo Inspección: {organizations.find(o => o.id === organizationId)?.name || 'Club'}
                    </div>
                </div>
            )}

            <DashboardStats kpis={data.kpis} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <RecentActivity dispensations={data.recentDispensations} />
                <TodayAppointments appointments={data.todayAppointments} />
            </div>
        </div>
    );
}
