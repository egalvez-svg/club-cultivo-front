import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dispensationService, CreateDispensationDto } from "../services/dispensation";
import { useAuth } from "@/context/auth-context";

export function useCreateDispensation() {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: (data: CreateDispensationDto) => dispensationService.createDispensation(data, token || ""),
        onSuccess: () => {
            // Refrescar los catálogos de stock luego de dispensar
            queryClient.invalidateQueries({ queryKey: ["products"] });
            // Opcionalmente podemos refrescar pacientes para actualizar su límite disponible si existiese
            queryClient.invalidateQueries({ queryKey: ["patients"] });
        },
    });
}
