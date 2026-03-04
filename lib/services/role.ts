import { API_URL } from "./auth";
import { translateEnum } from "../utils/mappers";

export interface Role {
    id: string;
    name: string;
    translatedName?: string;
    organizationId: string;
}

export interface CreateRoleParams {
    name: string;
    organizationId: string;
}

export interface UpdateRoleParams {
    name: string;
}

const formatRole = (r: any): Role => ({
    ...r,
    translatedName: translateEnum(r.name)
});

export const roleService = {
    async getRoles(token: string, organizationId?: string): Promise<Role[]> {
        const url = new URL(`${API_URL}/roles`);
        if (organizationId) url.searchParams.append("organizationId", organizationId);

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || "Error al obtener roles");
        }

        const rawData = await response.json();
        return rawData.map(formatRole);
    },

    async createRole(params: CreateRoleParams, token: string): Promise<Role> {
        const response = await fetch(`${API_URL}/roles`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || "Error al crear el rol");
        }

        const data = await response.json();
        return formatRole(data);
    },

    async updateRole(id: string, params: UpdateRoleParams, token: string): Promise<Role> {
        const response = await fetch(`${API_URL}/roles/${id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || "Error al actualizar el rol");
        }

        const data = await response.json();
        return formatRole(data);
    },

    async deleteRole(id: string, token: string): Promise<void> {
        const response = await fetch(`${API_URL}/roles/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || "Error al eliminar el rol");
        }
    },
};
