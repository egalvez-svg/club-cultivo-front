import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { reportService, RecentReport } from "../services/report";
import { sileo } from "sileo";

export function useRecentReports() {
    const { token } = useAuth();
    return useQuery<RecentReport[], Error>({
        queryKey: ["recent-reports"],
        queryFn: () => reportService.getRecentReports(token!),
        enabled: !!token,
    });
}

export function useDownloadPatientReport() {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ month, year }: { month: number; year: number }) => {
            if (!token) throw new Error("No authentication token");
            await reportService.downloadPatientTraceability(token, month, year);
        },
        onSuccess: () => {
            sileo.success({ description: "Reporte descargado exitosamente" });
            queryClient.invalidateQueries({ queryKey: ["recent-reports"] });
        },
        onError: (error: Error) => {
            sileo.error({ description: error.message || "Error al generar el reporte" });
        },
    });
}

export function useDownloadProductionReport() {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ month, year }: { month: number; year: number }) => {
            if (!token) throw new Error("No authentication token");
            await reportService.downloadProductionTraceability(token, month, year);
        },
        onSuccess: () => {
            sileo.success({ description: "Reporte descargado exitosamente" });
            queryClient.invalidateQueries({ queryKey: ["recent-reports"] });
        },
        onError: (error: Error) => {
            sileo.error({ description: error.message || "Error al generar el reporte" });
        },
    });
}

export function useDownloadFinanceReport() {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ month, year }: { month: number; year: number }) => {
            if (!token) throw new Error("No authentication token");
            await reportService.downloadFinanceAudit(token, month, year);
        },
        onSuccess: () => {
            sileo.success({ description: "Reporte descargado exitosamente" });
            queryClient.invalidateQueries({ queryKey: ["recent-reports"] });
        },
        onError: (error: Error) => {
            sileo.error({ description: error.message || "Error al generar el reporte" });
        },
    });
}
