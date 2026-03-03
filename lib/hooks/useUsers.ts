import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, CreateUserParams, UpdateUserParams } from "@/lib/services/user";
import { useAuth } from "@/context/auth-context";

export const useRoles = () => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["roles"],
        queryFn: () => userService.getRoles(token || ""),
        enabled: !!token,
    });
};

export const useOrganizations = () => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["organizations"],
        queryFn: () => userService.getOrganizations(token || ""),
        enabled: !!token,
    });
};

export const useUsersList = () => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["users-list"],
        queryFn: () => userService.getUsers(token || ""),
        enabled: !!token,
    });
};

export const useCreateUser = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: CreateUserParams) => userService.createUser(params, token || ""),
        onSuccess: () => {
            // Invalidar la lista de usuarios para forzar un refresco
            queryClient.invalidateQueries({ queryKey: ["users-list"] });
        },
    });
};

export const useUpdateUser = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, params }: { id: string; params: UpdateUserParams }) =>
            userService.updateUser(id, params, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users-list"] });
        },
    });
};

export const useDeleteUser = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => userService.deleteUser(id, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users-list"] });
        },
    });
};
