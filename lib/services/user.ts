import { API_URL } from "./auth";
import { translateEnum } from "../utils/mappers";

export interface Role {
    id: string;
    name: string;
    translatedName?: string;
    organizationId: string;
}

export interface Organization {
    id: string;
    name: string;
    active: boolean;
}

export interface UserWithRole {
    id: string;
    fullName: string;
    documentNumber: string;
    email: string;
    active: boolean;
    role?: {
        id: string;
        name: string;
        translatedName?: string;
    };
    roles?: { id: string; name: string; translatedName?: string; isDefault: boolean }[];
    organizationId: string;
}


export interface CreateUserParams {
    fullName: string;
    documentNumber: string;
    email: string;
    password?: string;
    roleId?: string;
    roleIds?: string[];
    organizationId?: string;
}

export interface UpdateUserParams {
    fullName?: string;
    documentNumber?: string;
    email?: string;
    roleId?: string;
    roleIds?: string[];
    organizationId?: string;
}

// ── Service ─────────────────────────────────────────────────────────────────

const formatRole = (r: any): Role => ({
    ...r,
    translatedName: translateEnum(r.name)
});

const formatUser = (u: any): UserWithRole => ({
    ...u,
    role: u.role ? { ...u.role, translatedName: translateEnum(u.role.name) } : undefined,
    roles: u.roles ? u.roles.map((r: any) => ({ ...r, translatedName: translateEnum(r.name) })) : undefined
});

export const userService = {
    async getRoles(token: string): Promise<Role[]> {
        const response = await fetch(`${API_URL}/roles`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al obtener roles");
        }

        const rawData = await response.json();
        return rawData.map(formatRole);
    },

    async getOrganizations(token: string): Promise<Organization[]> {
        const response = await fetch(`${API_URL}/organizations`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al obtener organizaciones");
        }

        return response.json();
    },

    async getUsers(token: string): Promise<UserWithRole[]> {
        const response = await fetch(`${API_URL}/users`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al obtener usuarios");
        }

        const rawData = await response.json();
        return rawData.map(formatUser);
    },

    async createUser(params: CreateUserParams, token: string): Promise<UserWithRole> {
        const response = await fetch(`${API_URL}/users`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al crear usuario");
        }

        return formatUser(data);
    },

    async updateUser(id: string, params: UpdateUserParams, token: string): Promise<UserWithRole> {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al actualizar usuario");
        }

        return formatUser(data);
    },

    async deleteUser(id: string, token: string): Promise<void> {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al eliminar usuario");
        }
    },
};
