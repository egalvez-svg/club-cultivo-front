import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { strainService, CreateStrainParams, UpdateStrainParams } from "@/lib/services/strain";
import { useAuth } from "@/context/auth-context";

export const useStrainsList = () => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["strains-list"],
        queryFn: () => strainService.getStrains(token || ""),
        enabled: !!token,
    });
};

export const useStrainDetail = (id: string | null) => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["strain-detail", id],
        queryFn: () => strainService.getStrain(id!, token || ""),
        enabled: !!token && !!id,
    });
};

export const useCreateStrain = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: CreateStrainParams) => strainService.createStrain(params, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["strains-list"] });
        },
    });
};

export const useUpdateStrain = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, params }: { id: string; params: UpdateStrainParams }) =>
            strainService.updateStrain(id, params, token || ""),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["strains-list"] });
            queryClient.invalidateQueries({ queryKey: ["strain-detail", variables.id] });
        },
    });
};

export const useDeleteStrain = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => strainService.deleteStrain(id, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["strains-list"] });
        },
    });
};
