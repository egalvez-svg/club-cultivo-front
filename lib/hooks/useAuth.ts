import { useMutation } from "@tanstack/react-query";
import { authService, LoginParams, AuthResponse } from "@/lib/services/auth";

export const useLogin = () => {
    return useMutation({
        mutationFn: (params: LoginParams) => authService.login(params),
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: (params: LoginParams) => authService.register(params),
    });
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (params: { email: string }) => authService.forgotPassword(params),
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: (params: { token: string; newPassword: string }) => authService.resetPassword(params),
    });
};
