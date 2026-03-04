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
            // Refrescar pacientes para ver actualización de saldo/límites
            queryClient.invalidateQueries({ queryKey: ["patients"] });
            // Refrescar lotes ya que el availableEquivalentGrams cambia
            queryClient.invalidateQueries({ queryKey: ["lots-list"] });
            queryClient.invalidateQueries({ queryKey: ["lots-by-strain"] });
            // Refrescar caja para ver el nuevo movimiento de dinero
            queryClient.invalidateQueries({ queryKey: ["active-register"] });
        },
    });
}
