import { apiClient } from "./api-client";

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
        return apiClient.get("/availability/config", token);
    },

    async createConfig(params: CreateAvailabilityConfigParams, token: string): Promise<AvailabilityConfig> {
        return apiClient.post("/availability/config", params, token);
    },

    async deleteConfig(id: string, token: string): Promise<void> {
        await apiClient.delete(`/availability/config/${id}`, token);
    },

    async getSlots(date: string, reason: string, token: string): Promise<string[]> {
        return apiClient.get(
            `/availability/slots?date=${date}&reason=${encodeURIComponent(reason)}`,
            token
        );
    },
};
