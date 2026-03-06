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

import { apiClient } from "./api-client";

export const authService = {
    async login(params: LoginParams): Promise<AuthResponse> {
        return apiClient.post("/auth/login", params);
    },

    async register(params: LoginParams): Promise<AuthResponse> {
        return apiClient.post("/auth/register", params);
    },

    async refreshToken(params: RefreshTokenParams): Promise<AuthResponse> {
        return apiClient.post("/auth/refresh", params);
    },

    async getMe(token: string): Promise<AuthResponse> {
        return apiClient.get("/auth/me", token);
    },

    async forgotPassword(params: ForgotPasswordParams): Promise<{ message: string }> {
        return apiClient.post("/auth/forgot-password", params);
    },

    async resetPassword(params: ResetPasswordParams): Promise<{ message: string }> {
        return apiClient.post("/auth/reset-password", params);
    },

    async changePassword(params: ChangePasswordParams, token: string): Promise<{ message: string }> {
        return apiClient.post("/auth/change-password", params, token);
    },
};
