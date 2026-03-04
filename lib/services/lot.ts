import { API_URL } from "./auth";
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
    totalOutputEquivalentGrams?: number;
    totalProductionCost?: number;
}

export interface UpdateLotParams {
    status?: string | "RELEASED";
    lotType?: "CULTIVATION" | "PACKAGING";
    lotCode?: string;
    strainId?: string;
    totalOutputEquivalentGrams?: number;
    availableEquivalentGrams?: number;
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
        const response = await fetch(`${API_URL}/lots`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al obtener lotes");
        }

        const rawData = await response.json();
        return rawData.map(formatLot);
    },

    async getLot(id: string, token: string): Promise<Lot> {
        const response = await fetch(`${API_URL}/lots/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al obtener lote");
        }

        const rawData = await response.json();
        return formatLot(rawData);
    },

    async createLot(params: CreateLotParams, token: string): Promise<Lot> {
        const response = await fetch(`${API_URL}/lots`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al crear lote");
        }

        return formatLot(data);
    },

    async updateLot(id: string, params: UpdateLotParams, token: string): Promise<Lot> {
        const response = await fetch(`${API_URL}/lots/${id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al actualizar lote");
        }

        return formatLot(data);
    },

    async deleteLot(id: string, token: string): Promise<void> {
        const response = await fetch(`${API_URL}/lots/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al eliminar lote");
        }
    },

    async getLotsByStrain(strainId: string, token: string): Promise<Lot[]> {
        const response = await fetch(`${API_URL}/lots/by-strain/${strainId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al obtener lotes por cepa");
        }

        const rawData = await response.json();
        return rawData.map(formatLot);
    },
};
