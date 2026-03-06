import { apiClient } from "./api-client";

export interface DashboardKPIS {
    activePatients: { value: number; growth: number };
    gramsDispensed: { value: number; growth: number };
    lotsInCultivation: { value: number; growth?: number };
    totalRevenue: { value: number; growth: number };
}

export interface RecentDispensation {
    id: string;
    patientName: string;
    productName: string;
    description: string;
    amount: number;
    totalEquivalentGrams: number;
    date: string;
}

export interface TodayAppointment {
    id: string;
    time: string;
    patientName: string;
    reason: string;
}

export interface DashboardData {
    kpis: DashboardKPIS;
    recentDispensations: RecentDispensation[];
    todayAppointments: TodayAppointment[];
}

export interface LiveActivity {
    id: string;
    message: string;
    user: string;
    time: string;
}

export interface SuperAdminDashboardKPIS {
    organizations: { value: number; growth: number };
    totalUsers: { value: number; growth: number };
    activeStrains: { value: number; growth?: number };
    systemStatus: { value: number; status?: "optimal" | "warning" | "error" };
}

export interface SuperAdminKPIResponse {
    kpis: SuperAdminDashboardKPIS;
    liveActivity: LiveActivity[];
}

export interface OrganizationSummary {
    id: string;
    name: string;
    staffCount: number;
    patientCount: number;
    lotCount: number;
    status?: "ACTIVE" | "INACTIVE";
    plan: string;
}

export interface SuperAdminDashboardData {
    kpis: SuperAdminDashboardKPIS;
    organizations: OrganizationSummary[];
}

export const dashboardService = {
    async getDashboardData(token: string, organizationId?: string): Promise<DashboardData> {
        const query = organizationId ? `?organizationId=${organizationId}` : "";
        return apiClient.get(`/dashboard${query}`, token);
    },

    async getSuperAdminKPIs(token: string): Promise<SuperAdminKPIResponse> {
        const data = await apiClient.get("/dashboard/superadmin", token);
        return {
            kpis: data.kpis,
            liveActivity: data.liveActivity || []
        };
    },

    async getSuperAdminOrganizations(token: string): Promise<OrganizationSummary[]> {
        const data = await apiClient.get("/dashboard/organizations", token);
        // Si el back devuelve un objeto { organizations: [...] } lo extraemos, 
        // de lo contrario asumimos que devuelve el array directamente.
        return Array.isArray(data) ? data : (data.organizations || []);
    },
};
