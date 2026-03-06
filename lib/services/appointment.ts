import { apiClient } from "./api-client";
import { translateEnum } from "../utils/mappers";

// ── Interfaces ──────────────────────────────────────────────────────────────

export interface Appointment {
    id: string;
    organizationId: string;
    patientId: string | null;
    guestName: string | null;
    guestPhone: string | null;
    date: string;
    reason: string;
    status: "PENDING" | "COMPLETED" | "CANCELLED";
    translatedStatus?: string;
    createdAt: string;
    updatedAt: string;
    patient: { fullName: string; documentNumber: string } | null;
}

export interface CreateAppointmentParams {
    patientId?: string;
    guestName?: string;
    guestPhone?: string;
    date: string;
    reason: string;
}

export interface UpdateAppointmentParams {
    date?: string;
    reason?: string;
    status?: "PENDING" | "COMPLETED" | "CANCELLED";
    patientId?: string;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

const formatAppointment = (a: any): Appointment => ({
    ...a,
    translatedStatus: translateEnum(a.status),
});

// ── Service ─────────────────────────────────────────────────────────────────

export const appointmentService = {
    async getAppointments(token: string): Promise<Appointment[]> {
        const rawData = await apiClient.get("/appointments", token);
        return rawData.map(formatAppointment);
    },

    async getTodayAppointments(token: string): Promise<Appointment[]> {
        const rawData = await apiClient.get("/appointments/today", token);
        return rawData.map(formatAppointment);
    },

    async getAppointment(id: string, token: string): Promise<Appointment> {
        const rawData = await apiClient.get(`/appointments/${id}`, token);
        return formatAppointment(rawData);
    },

    async createAppointment(params: CreateAppointmentParams, token: string): Promise<Appointment> {
        const data = await apiClient.post("/appointments", params, token);
        return formatAppointment(data);
    },

    async updateAppointment(id: string, params: UpdateAppointmentParams, token: string): Promise<Appointment> {
        const data = await apiClient.patch(`/appointments/${id}`, params, token);
        return formatAppointment(data);
    },

    async getMyAppointments(token: string, search?: string): Promise<Appointment[]> {
        const query = search ? `?search=${encodeURIComponent(search)}` : "";
        const rawData = await apiClient.get(`/appointments/my${query}`, token);
        return rawData.map(formatAppointment);
    },

    async cancelAppointment(id: string, token: string): Promise<Appointment> {
        const data = await apiClient.delete(`/appointments/${id}`, token);
        return formatAppointment(data);
    },
};
