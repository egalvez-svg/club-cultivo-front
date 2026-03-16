import { apiClient } from "./api-client";
import { translateEnum } from "../utils/mappers";

// ── Interfaces ──────────────────────────────────────────────────────────────

export interface Patient {
    id: string;
    fullName: string;
    documentNumber: string;
    reprocanNumber: string | null;
    reprocanExpiration: string | null;
    dailyDose: number | null;
    dailyConsumption: number | null;
    status: "ACTIVE" | "SUSPENDED";
    membershipStatus: "PENDING" | "APPROVED" | "REJECTED" | null;
    minutesBookEntry: string | null;
    memberNumber: string | null;
    address: string | null;
    phone: string | null;
    email?: string;
    roles?: string[];
    reprocanStatus?: "ACTIVE" | "EXPIRED" | "PENDING_RENEWAL" | "PENDING_VALIDATION" | "REJECTED" | string;
    translatedStatus?: string;
    organizationId: string;
    createdAt: string;
    updatedAt: string;
    reprocanRecords?: ReprocanRecord[];
}

export interface ReprocanRecord {
    id: string;
    reprocanNumber: string;
    expirationDate: string;
    status: "ACTIVE" | "EXPIRED" | "PENDING_RENEWAL" | "PENDING_VALIDATION" | "REJECTED";
    translatedStatus?: string;
    createdAt: string;
}

export interface CreatePatientParams {
    fullName: string;
    documentNumber: string;
    email?: string;
    phone?: string;
    address?: string;
    reprocanNumber?: string;
    reprocanExpiration?: string;
}

export interface UpdatePatientParams {
    fullName?: string;
    documentNumber?: string;
    email?: string;
    phone?: string;
    address?: string;
    reprocanNumber?: string;
    reprocanExpiration?: string;
}

export interface PatientDashboardData {
    patient: {
        id: string;
        fullName: string;
        documentNumber: string;
        status: string;
        dailyDose: number;
        applicationSignedAt: string | null;
        dataConsentAcceptedAt: string | null;
    };
    organization: {
        name: string;
    };
    reprocan: {
        reprocanNumber: string;
        status: string;
        expirationDate: string;
        createdAt: string;
        daysRemaining: number;
    };
    consumption: {
        consumedThisMonth: number;
        monthlyAllowance: number;
        available: number;
        progressPercent: number;
        lastDispensation: any | null;
    };
    pendingAppointments: any[];
}

// ── Service ─────────────────────────────────────────────────────────────────

const formatReprocanRecord = (r: any): ReprocanRecord => ({
    ...r,
    translatedStatus: translateEnum(r.status)
});

const formatPatient = (p: any): Patient => ({
    ...p,
    translatedStatus: translateEnum(p.status),
    reprocanRecords: p.reprocanRecords ? p.reprocanRecords.map(formatReprocanRecord) : undefined
});

export const patientService = {
    async getPatientDashboard(token: string): Promise<PatientDashboardData> {
        return apiClient.get("/patients/me/dashboard", token);
    },

    async checkDocumentNumber(documentNumber: string, token: string): Promise<{
        exists: boolean;
        id?: string;
        fullName?: string;
        email?: string;
        reprocanNumber?: string | null;
        reprocanExpiration?: string | null;
        roles?: string[];
    }> {
        return apiClient.get(`/patients/check/${documentNumber}`, token);
    },

    async getPatients(token: string): Promise<Patient[]> {
        const rawData = await apiClient.get("/patients", token);
        return rawData.map(formatPatient);
    },

    async getPatient(id: string, token: string): Promise<Patient> {
        const rawData = await apiClient.get(`/patients/${id}`, token);
        return formatPatient(rawData);
    },

    async createPatient(params: CreatePatientParams, token: string): Promise<Patient> {
        const data = await apiClient.post("/patients", params, token);
        return formatPatient(data);
    },

    async updatePatient(id: string, params: UpdatePatientParams, token: string): Promise<Patient> {
        const data = await apiClient.patch(`/patients/${id}`, params, token);
        return formatPatient(data);
    },

    async deletePatient(id: string, token: string): Promise<void> {
        await apiClient.delete(`/patients/${id}`, token);
    },

    // ── Reprocann Records ───────────────────────────────────────────────────

    async getPatientReprocannHistory(patientId: string, token: string): Promise<ReprocanRecord[]> {
        const rawData = await apiClient.get(`/patients/${patientId}/reprocan`, token);
        return rawData.map(formatReprocanRecord);
    },

    async createPatientReprocann(patientId: string, params: { reprocanNumber: string; expirationDate: string; status: string }, token: string): Promise<ReprocanRecord> {
        const rawData = await apiClient.post(`/patients/${patientId}/reprocan`, params, token);
        return formatReprocanRecord(rawData);
    },

    async updatePatientReprocann(patientId: string, recordId: string, params: { status: string; reprocanNumber?: string; expirationDate?: string }, token: string): Promise<ReprocanRecord> {
        const rawData = await apiClient.patch(`/patients/${patientId}/reprocan/${recordId}`, params, token);
        return formatReprocanRecord(rawData);
    },
};
