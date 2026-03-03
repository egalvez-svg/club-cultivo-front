import { API_URL } from "./auth";
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
        const response = await fetch(`${API_URL}/cash-register/active`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.status === 404) return null;

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al obtener la caja activa");
        }

        const rawData = await response.json();
        return formatCashRegister(rawData);
    },

    async openRegister(data: OpenRegisterDto, token: string): Promise<CashRegister> {
        const response = await fetch(`${API_URL}/cash-register/open`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const resData = await response.json();
        if (!response.ok) {
            throw new Error(resData.message || "Error al abrir la caja");
        }

        return formatCashRegister(resData);
    },

    async createMovement(data: CreateMovementDto, token: string): Promise<CashMovement> {
        const response = await fetch(`${API_URL}/cash-register/movements`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const resData = await response.json();
        if (!response.ok) {
            throw new Error(resData.message || "Error al registrar movimiento");
        }

        return formatCashMovement(resData);
    },

    async closeRegister(data: CloseRegisterDto, token: string): Promise<CashRegister> {
        const response = await fetch(`${API_URL}/cash-register/close`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const resData = await response.json();
        if (!response.ok) {
            throw new Error(resData.message || "Error al cerrar la caja");
        }

        return formatCashRegister(resData);
    },
};
