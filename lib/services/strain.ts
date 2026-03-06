import { apiClient } from "./api-client";
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
        const rawData = await apiClient.get("/strains", token);
        return rawData.map(formatStrain);
    },

    async getStrain(id: string, token: string): Promise<Strain> {
        const rawData = await apiClient.get(`/strains/${id}`, token);
        return formatStrain(rawData);
    },

    async createStrain(params: CreateStrainParams, token: string): Promise<Strain> {
        const data = await apiClient.post("/strains", params, token);
        return formatStrain(data);
    },

    async updateStrain(id: string, params: UpdateStrainParams, token: string): Promise<Strain> {
        const data = await apiClient.patch(`/strains/${id}`, params, token);
        return formatStrain(data);
    },

    async deleteStrain(id: string, token: string): Promise<void> {
        await apiClient.delete(`/strains/${id}`, token);
    },
};
