import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService, CreateAppointmentParams, UpdateAppointmentParams } from "@/lib/services/appointment";
import { useAuth } from "@/context/auth-context";

export const useAppointmentsList = () => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["appointments"],
        queryFn: () => appointmentService.getAppointments(token || ""),
        enabled: !!token,
    });
};

export const useTodayAppointments = () => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["appointments-today"],
        queryFn: () => appointmentService.getTodayAppointments(token || ""),
        enabled: !!token,
    });
};

export const useMyAppointments = (search?: string) => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["my-appointments", search],
        queryFn: () => appointmentService.getMyAppointments(token || "", search),
        enabled: !!token,
    });
};

export const useCreateAppointment = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: CreateAppointmentParams) =>
            appointmentService.createAppointment(params, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            queryClient.invalidateQueries({ queryKey: ["appointments-today"] });
            queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
            queryClient.invalidateQueries({ queryKey: ["availability-slots"] });
        },
    });
};

export const useUpdateAppointment = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, params }: { id: string; params: UpdateAppointmentParams }) =>
            appointmentService.updateAppointment(id, params, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            queryClient.invalidateQueries({ queryKey: ["appointments-today"] });
            queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
            queryClient.invalidateQueries({ queryKey: ["availability-slots"] });
        },
    });
};

export const useCancelAppointment = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => appointmentService.cancelAppointment(id, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            queryClient.invalidateQueries({ queryKey: ["appointments-today"] });
            queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
            queryClient.invalidateQueries({ queryKey: ["availability-slots"] });
        },
    });
};
