import { API_URL } from "./auth";

// ── Interfaces ──────────────────────────────────────────────────────────────

export interface CreateDispensationItemDto {
    productId: string;
    productionLotId: string;
    quantityUnits: number;
    equivalentDryGrams: number;
    costPerEquivalentGram: number;
    totalRecoveryAmount: number;
}

export type PaymentMethod = "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "BANK_TRANSFER" | "OTHER";

export interface CreateDispensationDto {
    recipientId: string;
    paymentMethod: PaymentMethod;
    discount?: number;
    items: CreateDispensationItemDto[];
}

export interface DispensationResponse {
    id: string;
    createdAt: string;
    // other fields omitted for simplicity, add if needed
}

// ── Service ─────────────────────────────────────────────────────────────────

export const dispensationService = {
    async createDispensation(data: CreateDispensationDto, token: string): Promise<DispensationResponse> {
        const response = await fetch(`${API_URL}/dispensations`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const resData = await response.json();

        if (!response.ok) {
            throw new Error(resData.message || "Error al registrar la dispensación");
        }

        return resData;
    },
};
