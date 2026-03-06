import { apiClient } from "./api-client";
import { translateEnum } from "../utils/mappers";

export type CashRegisterStatus = "OPEN" | "CLOSED";
export type MovementType = "INCOME" | "EXPENSE" | "ADJUSTMENT";

export interface CashMovement {
    id: string;
    amount: number;
    movementType: MovementType;
    translatedMovementType?: string;
    referenceType: string;
    translatedReferenceType?: string;
    description: string;
    createdAt: string;
}

export interface CashRegister {
    id: string;
    status: CashRegisterStatus;
    translatedStatus?: string;
    openingBalance: number;
    currentBalance: number;
    openedAt: string;
    closedAt: string | null;
    movements: CashMovement[];
}

export interface OpenRegisterDto {
    openingBalance: number;
}

export interface CreateMovementDto {
    movementType: MovementType;
    amount: number;
    notes: string;
    referenceType?: string;
    referenceId?: string;
}

export interface CloseRegisterDto {
    closingBalance: number;
}

// Helpers to format the raw backend response into translated UI strings
const formatCashMovement = (m: any): CashMovement => ({
    ...m,
    translatedMovementType: translateEnum(m.movementType),
    translatedReferenceType: translateEnum(m.referenceType)
});

const formatCashRegister = (r: any): CashRegister => ({
    ...r,
    status: r.status as CashRegisterStatus,
    translatedStatus: translateEnum(r.status),
    movements: r.movements ? r.movements.map(formatCashMovement) : []
});

export const cashRegisterService = {
    async getActiveRegister(token: string): Promise<CashRegister | null> {
        try {
            const rawData = await apiClient.get("/cash-register/active", token);
            return formatCashRegister(rawData);
        } catch (error: any) {
            if (error.message?.includes("404")) return null;
            throw error;
        }
    },

    async openRegister(data: OpenRegisterDto, token: string): Promise<CashRegister> {
        const resData = await apiClient.post("/cash-register/open", data, token);
        return formatCashRegister(resData);
    },

    async createMovement(data: CreateMovementDto, token: string): Promise<CashMovement> {
        const resData = await apiClient.post("/cash-register/movements", data, token);
        return formatCashMovement(resData);
    },

    async closeRegister(data: CloseRegisterDto, token: string): Promise<CashRegister> {
        const resData = await apiClient.post("/cash-register/close", data, token);
        return formatCashRegister(resData);
    },
};
