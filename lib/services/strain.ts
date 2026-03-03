import { API_URL } from "./auth";
import { translateEnum } from "../utils/mappers";

// ── Interfaces ──────────────────────────────────────────────────────────────

export interface Strain {
    id: string;
    name: string;
    genetics: string | null;
    type: "INDICA" | "SATIVA" | "HYBRID" | "OTHER" | null;
    translatedType?: string;
    thcPercentage: number | null;
    cbdPercentage: number | null;
    active: boolean;
    organizationId: string;
    createdAt: string;
    updatedAt: string;
    _count?: {
        lots: number;
    };
}

export interface CreateStrainParams {
    name: string;
    genetics?: string;
    type?: "INDICA" | "SATIVA" | "HYBRID" | "OTHER";
    thcPercentage?: number;
    cbdPercentage?: number;
}

export interface UpdateStrainParams {
    name?: string;
    genetics?: string;
    type?: "INDICA" | "SATIVA" | "HYBRID" | "OTHER";
    thcPercentage?: number;
    cbdPercentage?: number;
}

// ── Service ─────────────────────────────────────────────────────────────────

const formatStrain = (s: any): Strain => ({
    ...s,
    translatedType: translateEnum(s.type)
});

export const strainService = {
    async getStrains(token: string): Promise<Strain[]> {
        const response = await fetch(`${API_URL}/strains`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al obtener cepas/genéticas");
        }

        const rawData = await response.json();
        return rawData.map(formatStrain);
    },

    async getStrain(id: string, token: string): Promise<Strain> {
        const response = await fetch(`${API_URL}/strains/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al obtener cepa");
        }

        const rawData = await response.json();
        return formatStrain(rawData);
    },

    async createStrain(params: CreateStrainParams, token: string): Promise<Strain> {
        const response = await fetch(`${API_URL}/strains`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al crear cepa");
        }

        return formatStrain(data);
    },

    async updateStrain(id: string, params: UpdateStrainParams, token: string): Promise<Strain> {
        const response = await fetch(`${API_URL}/strains/${id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al actualizar cepa");
        }

        return formatStrain(data);
    },

    async deleteStrain(id: string, token: string): Promise<void> {
        const response = await fetch(`${API_URL}/strains/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al eliminar cepa");
        }
    },
};
