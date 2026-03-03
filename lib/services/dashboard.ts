import { API_URL } from "./auth";

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

export const dashboardService = {
    async getDashboardData(token: string): Promise<DashboardData> {
        const response = await fetch(`${API_URL}/dashboard`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al obtener datos del dashboard");
        }

        return data;
    },
};
