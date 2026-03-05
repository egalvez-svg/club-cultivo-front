export const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface LoginParams {
    email: string;
    password: string;
}

export interface UserRole {
    id: string;
    name: string;
    isDefault: boolean;
}

export interface User {
    id: string;
    email: string;
    fullName?: string;
    name?: string;
    documentNumber?: string;
    role?: string; // legacy compat
    roles?: UserRole[];
    activeRole?: string;
    clubName?: string;
    orgName?: string;
    organizationId?: string;
    organization?: {
        id: string;
        name: string;
    };
    requiresPasswordChange?: boolean;
}


export interface AuthResponse {
    message?: string;
    token?: string;
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    refresh_expires_in?: number;
    user?: User;
}

export interface RefreshTokenParams {
    refreshToken: string;
    id: string;
}

export interface ForgotPasswordParams {
    email: string;
}

export interface ResetPasswordParams {
    token: string;
    newPassword: string;
}

export interface ChangePasswordParams {
    currentPassword: string;
    newPassword: string;
}

export const authService = {
    async login(params: LoginParams): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error(`Error del servidor: URL incorrecta o servicio no disponible (${response.status})`);
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al iniciar sesión");
        }
        console.log(data);
        return data;
    },

    async register(params: LoginParams): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al registrarse");
        }

        return data;
    },

    async refreshToken(params: RefreshTokenParams): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al refrescar el token");
        }

        return data;
    },

    async getMe(token: string): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al obtener perfil");
        }

        return data;
    },

    async forgotPassword(params: ForgotPasswordParams): Promise<{ message: string }> {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al solicitar recuperación");
        }

        return data;
    },

    async resetPassword(params: ResetPasswordParams): Promise<{ message: string }> {
        const response = await fetch(`${API_URL}/auth/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al restablecer contraseña");
        }

        return data;
    },

    async changePassword(params: ChangePasswordParams, token: string): Promise<{ message: string }> {
        const response = await fetch(`${API_URL}/auth/change-password`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al cambiar contraseña");
        }

        return data;
    },
};
