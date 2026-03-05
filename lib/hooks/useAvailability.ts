import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { availabilityService, CreateAvailabilityConfigParams } from "@/lib/services/availability";
import { useAuth } from "@/context/auth-context";

export const useAvailabilityConfigs = () => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["availability-configs"],
        queryFn: () => availabilityService.getConfigs(token || ""),
        enabled: !!token,
    });
};

export const useCreateAvailabilityConfig = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: CreateAvailabilityConfigParams) =>
            availabilityService.createConfig(params, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["availability-configs"] });
        },
    });
};

export const useDeleteAvailabilityConfig = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => availabilityService.deleteConfig(id, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["availability-configs"] });
        },
    });
};

export const useAvailableSlots = (date: string | null, reason: string | null) => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["availability-slots", date, reason],
        queryFn: () => availabilityService.getSlots(date!, reason!, token || ""),
        enabled: !!token && !!date && !!reason,
    });
};
