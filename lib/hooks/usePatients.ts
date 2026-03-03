import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientService, CreatePatientParams, UpdatePatientParams, ReprocanRecord } from "@/lib/services/patient";
import { useAuth } from "@/context/auth-context";

export const usePatientsList = () => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["patients-list"],
        queryFn: () => patientService.getPatients(token || ""),
        enabled: !!token,
    });
};

export const useCreatePatient = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: CreatePatientParams) => patientService.createPatient(params, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patients-list"] });
        },
    });
};

export const useUpdatePatient = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, params }: { id: string; params: UpdatePatientParams }) =>
            patientService.updatePatient(id, params, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patients-list"] });
        },
    });
};

export const useDeletePatient = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => patientService.deletePatient(id, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patients-list"] });
        },
    });
};

// ── Reprocann Records hooks ─────────────────────────────────────────────────

export const usePatientReprocannHistory = (patientId: string | null) => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["patient-reprocann", patientId],
        queryFn: () => patientService.getPatientReprocannHistory(patientId!, token || ""),
        enabled: !!token && !!patientId,
    });
};

export const useCreatePatientReprocann = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ patientId, params }: { patientId: string; params: { reprocanNumber: string; expirationDate: string; status: string } }) =>
            patientService.createPatientReprocann(patientId, params, token || ""),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["patients-list"] });
            queryClient.invalidateQueries({ queryKey: ["patient-reprocann", variables.patientId] });
        },
    });
};

export const useUpdatePatientReprocann = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ patientId, recordId, params }: { patientId: string; recordId: string; params: { status: string; reprocanNumber?: string; expirationDate?: string } }) =>
            patientService.updatePatientReprocann(patientId, recordId, params, token || ""),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["patients-list"] });
            queryClient.invalidateQueries({ queryKey: ["patient-reprocann", variables.patientId] });
        },
    });
};

