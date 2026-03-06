import { API_URL } from "./auth";

interface RequestOptions extends RequestInit {
    token?: string;
    body?: any;
}

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error del servidor (${response.status})`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }

    return response.blob();
};

export const apiClient = {
    async get(endpoint: string, token?: string, options: RequestOptions = {}) {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            ...options.headers,
        };

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            method: "GET",
            headers,
        });

        return handleResponse(response);
    },

    async post(endpoint: string, body?: any, token?: string, options: RequestOptions = {}) {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            ...options.headers,
        };

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            method: "POST",
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        return handleResponse(response);
    },

    async patch(endpoint: string, body?: any, token?: string, options: RequestOptions = {}) {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            ...options.headers,
        };

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            method: "PATCH",
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        return handleResponse(response);
    },

    async put(endpoint: string, body?: any, token?: string, options: RequestOptions = {}) {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            ...options.headers,
        };

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            method: "PUT",
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        return handleResponse(response);
    },

    async delete(endpoint: string, token?: string, options: RequestOptions = {}) {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            ...options.headers,
        };

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            method: "DELETE",
            headers,
        });

        return handleResponse(response);
    },

    async download(endpoint: string, token: string, filename: string) {
        const blob = await this.get(endpoint, token);
        const url = window.URL.createObjectURL(blob as Blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }
};
