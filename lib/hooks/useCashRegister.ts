import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cashRegisterService, OpenRegisterDto, CreateMovementDto, CloseRegisterDto } from "../services/cash-register";
import { useAuth } from "@/context/auth-context";

export const useActiveRegister = () => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["active-register"],
        queryFn: () => cashRegisterService.getActiveRegister(token || ""),
        enabled: !!token,
    });
};

export const useOpenRegister = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: OpenRegisterDto) => cashRegisterService.openRegister(data, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["active-register"] });
        },
    });
};

export const useCreateMovement = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateMovementDto) => cashRegisterService.createMovement(data, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["active-register"] });
        },
    });
};

export const useCloseRegister = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CloseRegisterDto) => cashRegisterService.closeRegister(data, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["active-register"] });
        },
    });
};
