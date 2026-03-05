import { API_URL } from "./auth";
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
    status: "ACTIVE" | "EXPIRED" | "PENDING_RENEWAL" | "REJECTED";
    translatedStatus?: string;
    createdAt: string;
}

export interface CreatePatientParams {
    fullName: string;
    documentNumber: string;
    email?: string;
    reprocanNumber?: string;
    reprocanExpiration?: string;
}



export interface UpdatePatientParams {
    fullName?: string;
    documentNumber?: string;
    email?: string;
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
        const response = await fetch(`${API_URL}/patients/me/dashboard`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al obtener dashboard del paciente");
        }

        return response.json();
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
        const response = await fetch(`${API_URL}/patients/check/${documentNumber}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al verificar documento");
        }

        return response.json();
    },

    async getPatients(token: string): Promise<Patient[]> {
        const response = await fetch(`${API_URL}/patients`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al obtener pacientes");
        }

        const rawData = await response.json();
        return rawData.map(formatPatient);
    },

    async getPatient(id: string, token: string): Promise<Patient> {
        const response = await fetch(`${API_URL}/patients/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al obtener paciente");
        }

        const rawData = await response.json();
        return formatPatient(rawData);
    },

    async createPatient(params: CreatePatientParams, token: string): Promise<Patient> {
        const response = await fetch(`${API_URL}/patients`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al crear paciente");
        }

        return formatPatient(data);
    },

    async updatePatient(id: string, params: UpdatePatientParams, token: string): Promise<Patient> {
        const response = await fetch(`${API_URL}/patients/${id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al actualizar paciente");
        }

        return formatPatient(data);
    },

    async deletePatient(id: string, token: string): Promise<void> {
        const response = await fetch(`${API_URL}/patients/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al suspender paciente");
        }
    },

    // ── Reprocann Records ───────────────────────────────────────────────────

    async getPatientReprocannHistory(patientId: string, token: string): Promise<ReprocanRecord[]> {
        const response = await fetch(`${API_URL}/patients/${patientId}/reprocan`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al obtener historial de REPROCANN");
        }

        const rawData = await response.json();
        return rawData.map(formatReprocanRecord);
    },

    async createPatientReprocann(patientId: string, params: { reprocanNumber: string; expirationDate: string; status: string }, token: string): Promise<ReprocanRecord> {
        const response = await fetch(`${API_URL}/patients/${patientId}/reprocan`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al crear registro de REPROCANN");
        }

        const rawData = await response.json();
        return formatReprocanRecord(rawData);
    },

    async updatePatientReprocann(patientId: string, recordId: string, params: { status: string; reprocanNumber?: string; expirationDate?: string }, token: string): Promise<ReprocanRecord> {
        const response = await fetch(`${API_URL}/patients/${patientId}/reprocan/${recordId}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al actualizar registro de REPROCANN");
        }

        const rawData = await response.json();
        return formatReprocanRecord(rawData);
    },
};
