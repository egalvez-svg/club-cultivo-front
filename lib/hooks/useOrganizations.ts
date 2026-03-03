import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { organizationService, CreateOrganizationParams, UpdateOrganizationParams } from "../services/organization";
import { sileo } from "sileo";

export function useOrganizationsList() {
    const { token } = useAuth();
    return useQuery({
        queryKey: ["organizations"],
        queryFn: () => {
            if (!token) throw new Error("No token available");
            return organizationService.getOrganizations(token);
        },
        enabled: !!token,
    });
}

export function useCreateOrganization() {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: (params: CreateOrganizationParams) => {
            if (!token) throw new Error("No token available");
            return organizationService.createOrganization(token, params);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["organizations"] });
            requestAnimationFrame(() => {
                sileo.success({ title: "Organización creada", description: "La organización ha sido añadida exitosamente." });
            });
        },
        onError: (error: any) => {
            requestAnimationFrame(() => {
                sileo.error({ title: "Error", description: error.message || "No se pudo crear la organización" });
            });
        },
    });
}

export function useUpdateOrganization() {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: ({ id, params }: { id: string; params: UpdateOrganizationParams }) => {
            if (!token) throw new Error("No token available");
            return organizationService.updateOrganization(token, id, params);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["organizations"] });
            requestAnimationFrame(() => {
                sileo.success({ title: "Organización actualizada", description: "Los datos han sido guardados." });
            });
        },
        onError: (error: any) => {
            requestAnimationFrame(() => {
                sileo.error({ title: "Error", description: error.message || "No se pudo actualizar la organización" });
            });
        },
    });
}

export function useDeleteOrganization() {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: (id: string) => {
            if (!token) throw new Error("No token available");
            return organizationService.deleteOrganization(token, id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["organizations"] });
            requestAnimationFrame(() => {
                sileo.success({ title: "Organización eliminada", description: "La organización fue borrada del sistema." });
            });
        },
        onError: (error: any) => {
            requestAnimationFrame(() => {
                sileo.error({ title: "Error", description: error.message || "No se pudo eliminar la organización" });
            });
        },
    });
}
