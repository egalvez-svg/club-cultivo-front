import { apiClient } from "./api-client";

export interface Organization {
    id: string;
    name: string;
    cuit: string;
    address: string;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateOrganizationParams {
    name: string;
    cuit: string;
    address: string;
    active: boolean;
}

export interface UpdateOrganizationParams {
    name?: string;
    cuit?: string;
    address?: string;
    active?: boolean;
}

const formatOrganization = (data: any): Organization => ({
    id: data.id,
    name: data.name,
    cuit: data.cuit ?? "",
    address: data.address ?? "",
    active: data.active ?? true,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
});

export const organizationService = {
    async getOrganizations(token: string): Promise<Organization[]> {
        const data = await apiClient.get("/organizations", token);
        return Array.isArray(data) ? data.map(formatOrganization) : [];
    },

    async createOrganization(token: string, params: CreateOrganizationParams): Promise<Organization> {
        const data = await apiClient.post("/organizations", params, token);
        return formatOrganization(data);
    },

    async updateOrganization(token: string, id: string, params: UpdateOrganizationParams): Promise<Organization> {
        const data = await apiClient.patch(`/organizations/${id}`, params, token);
        return formatOrganization(data);
    },

    async deleteOrganization(token: string, id: string): Promise<void> {
        await apiClient.delete(`/organizations/${id}`, token);
    },
};
