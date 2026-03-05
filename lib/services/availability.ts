import { API_URL } from "./auth";

// ── Interfaces ──────────────────────────────────────────────────────────────

export type AppointmentReason =
    | "REPROCAN_RENEWAL"
    | "MEDICAL_CONSULTATION"
    | "DISPENSATION";

export const REASON_LABELS: Record<AppointmentReason, string> = {
    REPROCAN_RENEWAL: "Renovacion Reprocan",
    MEDICAL_CONSULTATION: "Consulta Medica",
    DISPENSATION: "Retiro de Flores/Aceites",
};

export const WEEKDAY_LABELS = [
    "Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado",
];

export interface AvailabilityConfig {
    id: string;
    dayOfWeek: number; // 0=domingo ... 6=sabado
    startTime: string; // "09:00"
    endTime: string;   // "17:00"
    slotDuration: number; // minutos
    reason: AppointmentReason;
    organizationId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAvailabilityConfigParams {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDuration: number;
    reason: AppointmentReason;
}

// ── Service ─────────────────────────────────────────────────────────────────

export const availabilityService = {
    async getConfigs(token: string): Promise<AvailabilityConfig[]> {
        const response = await fetch(`${API_URL}/availability/config`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al obtener configuracion de disponibilidad");
        }

        return response.json();
    },

    async createConfig(params: CreateAvailabilityConfigParams, token: string): Promise<AvailabilityConfig> {
        const response = await fetch(`${API_URL}/availability/config`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al crear configuracion de disponibilidad");
        }

        return data;
    },

    async deleteConfig(id: string, token: string): Promise<void> {
        const response = await fetch(`${API_URL}/availability/config/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al eliminar configuracion");
        }
    },

    async getSlots(date: string, reason: string, token: string): Promise<string[]> {
        const response = await fetch(
            `${API_URL}/availability/slots?date=${date}&reason=${encodeURIComponent(reason)}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al obtener horarios disponibles");
        }

        return response.json();
    },
};
