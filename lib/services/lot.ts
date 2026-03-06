import { apiClient } from "./api-client";
import { Strain } from "./strain";
import { translateEnum } from "../utils/mappers";

// ── Interfaces ──────────────────────────────────────────────────────────────

export interface Lot {
    id: string;
    lotCode: string;
    strainId: string;
    lotType: "CULTIVATION" | "PACKAGING";
    translatedLotType?: string;
    status: "CREATED" | "TESTING" | "RELEASED" | "BLOCKED" | "DEPLETED" | string;
    translatedStatus?: string;
    totalOutputEquivalentGrams: number | null;
    availableEquivalentGrams: number | null;
    totalProductionCost: number | null;
    releasedAt: string | null;
    organizationId: string;
    createdAt: string;
    updatedAt: string;

    // Relations included by backend
    strain?: Strain;
}

export interface CreateLotParams {
    strainId: string;
    lotType: "CULTIVATION" | "PACKAGING";
    lotCode?: string;
    status?: string;
    totalOutputEquivalentGrams?: number;
    availableEquivalentGrams?: number;
    totalProductionCost?: number;
}

export interface UpdateLotParams {
    status?: string | "RELEASED";
    lotType?: "CULTIVATION" | "PACKAGING";
    lotCode?: string;
    strainId?: string;
    totalOutputEquivalentGrams?: number;
    totalProductionCost?: number;
}

// ── Service ─────────────────────────────────────────────────────────────────

const formatLot = (l: any): Lot => ({
    ...l,
    translatedLotType: translateEnum(l.lotType),
    translatedStatus: translateEnum(l.status)
});

export const lotService = {
    async getLots(token: string): Promise<Lot[]> {
        const rawData = await apiClient.get("/lots", token);
        return rawData.map(formatLot);
    },

    async getLot(id: string, token: string): Promise<Lot> {
        const rawData = await apiClient.get(`/lots/${id}`, token);
        return formatLot(rawData);
    },

    async createLot(params: CreateLotParams, token: string): Promise<Lot> {
        const data = await apiClient.post("/lots", params, token);
        return formatLot(data);
    },

    async updateLot(id: string, params: UpdateLotParams, token: string): Promise<Lot> {
        const data = await apiClient.patch(`/lots/${id}`, params, token);
        return formatLot(data);
    },

    async deleteLot(id: string, token: string): Promise<void> {
        await apiClient.delete(`/lots/${id}`, token);
    },

    async getLotsByStrain(strainId: string, token: string): Promise<Lot[]> {
        const rawData = await apiClient.get(`/lots/by-strain/${strainId}`, token);
        return rawData.map(formatLot);
    },
};
