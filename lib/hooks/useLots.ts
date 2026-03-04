import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lotService, CreateLotParams, UpdateLotParams } from "@/lib/services/lot";
import { useAuth } from "@/context/auth-context";

export const useLotsList = () => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["lots-list"],
        queryFn: () => lotService.getLots(token || ""),
        enabled: !!token,
    });
};

export const useLotDetail = (id: string | null) => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["lot-detail", id],
        queryFn: () => lotService.getLot(id!, token || ""),
        enabled: !!token && !!id,
    });
};

export const useCreateLot = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: CreateLotParams) => lotService.createLot(params, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lots-list"] });
            // By invalidating strains, we update the strains lot count
            queryClient.invalidateQueries({ queryKey: ["strains-list"] });
        },
    });
};

export const useUpdateLot = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, params }: { id: string; params: UpdateLotParams }) =>
            lotService.updateLot(id, params, token || ""),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["lots-list"] });
            queryClient.invalidateQueries({ queryKey: ["lot-detail", variables.id] });
            // Al actualizar un lote se deben refrescar los productos asociados
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["strains-list"] });
        },
    });
};

export const useDeleteLot = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => lotService.deleteLot(id, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lots-list"] });
            queryClient.invalidateQueries({ queryKey: ["strains-list"] });
        },
    });
};

export const useLotsByStrain = (strainId: string | null) => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["lots-by-strain", strainId],
        queryFn: () => lotService.getLotsByStrain(strainId!, token || ""),
        enabled: !!token && !!strainId,
    });
};
