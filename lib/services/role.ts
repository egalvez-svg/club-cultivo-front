import { apiClient } from "./api-client";
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
        const query = organizationId ? `?organizationId=${organizationId}` : "";
        const rawData = await apiClient.get(`/roles${query}`, token);
        return rawData.map(formatRole);
    },

    async createRole(params: CreateRoleParams, token: string): Promise<Role> {
        const data = await apiClient.post("/roles", params, token);
        return formatRole(data);
    },

    async updateRole(id: string, params: UpdateRoleParams, token: string): Promise<Role> {
        const data = await apiClient.patch(`/roles/${id}`, params, token);
        return formatRole(data);
    },

    async deleteRole(id: string, token: string): Promise<void> {
        await apiClient.delete(`/roles/${id}`, token);
    },
};
