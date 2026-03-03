import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleService, CreateRoleParams, UpdateRoleParams } from "../services/role";
import { useAuth } from "@/context/auth-context";

export function useRolesList() {
    const { token } = useAuth();
    return useQuery({
        queryKey: ["roles"],
        queryFn: async () => {
            if (!token) throw new Error("No token available");
            return await roleService.getRoles(token);
        },
        enabled: !!token,
    });
}

export function useCreateRole() {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: CreateRoleParams) => {
            if (!token) throw new Error("No token available");
            return await roleService.createRole(params, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    });
}

export function useUpdateRole() {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, params }: { id: string; params: UpdateRoleParams }) => {
            if (!token) throw new Error("No token available");
            return await roleService.updateRole(id, params, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    });
}

export function useDeleteRole() {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            if (!token) throw new Error("No token available");
            return await roleService.deleteRole(id, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    });
}
