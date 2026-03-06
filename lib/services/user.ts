import { apiClient } from "./api-client";
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
    orgName?: string;
    organization?: {
        id: string;
        name: string;
    };
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
    async getRoles(token: string, organizationId?: string): Promise<Role[]> {
        const query = organizationId ? `?organizationId=${organizationId}` : "";
        const rawData = await apiClient.get(`/roles${query}`, token);
        return rawData.map(formatRole);
    },

    async getOrganizations(token: string): Promise<Organization[]> {
        return apiClient.get("/organizations", token);
    },

    async getUsers(token: string): Promise<UserWithRole[]> {
        const rawData = await apiClient.get("/users", token);
        return rawData.map(formatUser);
    },

    async createUser(params: CreateUserParams, token: string): Promise<UserWithRole> {
        const data = await apiClient.post("/users", params, token);
        return formatUser(data);
    },

    async updateUser(id: string, params: UpdateUserParams, token: string): Promise<UserWithRole> {
        const data = await apiClient.patch(`/users/${id}`, params, token);
        return formatUser(data);
    },

    async deleteUser(id: string, token: string): Promise<void> {
        await apiClient.delete(`/users/${id}`, token);
    },
};
