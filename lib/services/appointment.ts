import { API_URL } from "./auth";
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
        const response = await fetch(`${API_URL}/appointments`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al obtener turnos");
        }

        const rawData = await response.json();
        return rawData.map(formatAppointment);
    },

    async getTodayAppointments(token: string): Promise<Appointment[]> {
        const response = await fetch(`${API_URL}/appointments/today`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al obtener turnos de hoy");
        }

        const rawData = await response.json();
        return rawData.map(formatAppointment);
    },

    async getAppointment(id: string, token: string): Promise<Appointment> {
        const response = await fetch(`${API_URL}/appointments/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al obtener turno");
        }

        const rawData = await response.json();
        return formatAppointment(rawData);
    },

    async createAppointment(params: CreateAppointmentParams, token: string): Promise<Appointment> {
        const response = await fetch(`${API_URL}/appointments`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al agendar turno");
        }

        return formatAppointment(data);
    },

    async updateAppointment(id: string, params: UpdateAppointmentParams, token: string): Promise<Appointment> {
        const response = await fetch(`${API_URL}/appointments/${id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al actualizar turno");
        }

        return formatAppointment(data);
    },

    async cancelAppointment(id: string, token: string): Promise<Appointment> {
        const response = await fetch(`${API_URL}/appointments/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al cancelar turno");
        }

        return formatAppointment(data);
    },
};
