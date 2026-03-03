import { API_URL } from "./auth";

export interface Organization {
    id: string;
    name: string;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateOrganizationParams {
    name: string;
    active: boolean;
}

export interface UpdateOrganizationParams {
    name?: string;
    active?: boolean;
}

const formatOrganization = (data: any): Organization => ({
    id: data.id,
    name: data.name,
    active: data.active ?? true,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
});

export const organizationService = {
    async getOrganizations(token: string): Promise<Organization[]> {
        const response = await fetch(`${API_URL}/organizations`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Error al obtener las organizaciones");
        }

        const data = await response.json();
        return Array.isArray(data) ? data.map(formatOrganization) : [];
    },

    async createOrganization(token: string, params: CreateOrganizationParams): Promise<Organization> {
        const response = await fetch(`${API_URL}/organizations`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        const errorText = await response.text();
        if (!response.ok) {
            let errorMessage = "Error al crear la organización";
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorMessage;
            } catch (e) {
                errorMessage = errorText;
            }
            throw new Error(errorMessage);
        }
        return formatOrganization(JSON.parse(errorText));
    },

    async updateOrganization(token: string, id: string, params: UpdateOrganizationParams): Promise<Organization> {
        const response = await fetch(`${API_URL}/organizations/${id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        const errorText = await response.text();
        if (!response.ok) {
            let errorMessage = "Error al actualizar la organización";
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorMessage;
            } catch (e) {
                errorMessage = errorText;
            }
            throw new Error(errorMessage);
        }
        return formatOrganization(JSON.parse(errorText));
    },

    async deleteOrganization(token: string, id: string): Promise<void> {
        const response = await fetch(`${API_URL}/organizations/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = "Error al eliminar la organización";
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorMessage;
            } catch (e) {
                // Ignore parsing error for raw text
            }
            throw new Error(errorMessage);
        }
    },
};
