import { apiClient } from "./api-client";

export interface RecentReport {
    id: string;
    name: string;
    fileSize: number;
    generatedBy: string;
    status: "COMPLETED" | "FAILED" | "PENDING";
    date: string;
}

export const reportService = {
    /**
     * Obtiene el historial de los últimos reportes generados
     */
    async getRecentReports(token: string): Promise<RecentReport[]> {
        return apiClient.get("/reports/recent", token);
    },

    /**
     * Descarga el PDF de trazabilidad de pacientes (REPROCANN)
     */
    async downloadPatientTraceability(token: string, month: number, year: number): Promise<void> {
        const filename = `Trazabilidad_Pacientes_${new Date().toISOString().split('T')[0]}.pdf`;
        return apiClient.download(`/reports/traceability/patients?month=${month}&year=${year}&format=pdf`, token, filename);
    },

    /**
     * Descarga el PDF del libro de cultivo y lotes
     */
    async downloadProductionTraceability(token: string, month: number, year: number): Promise<void> {
        const filename = `Libro_Cultivo_${new Date().toISOString().split('T')[0]}.pdf`;
        return apiClient.download(`/reports/traceability/production?month=${month}&year=${year}&format=pdf`, token, filename);
    },

    /**
     * Descarga el PDF de la auditoría financiera (cajas y movimientos)
     */
    async downloadFinanceAudit(token: string, month: number, year: number): Promise<void> {
        const filename = `Auditoria_Financiera_${new Date().toISOString().split('T')[0]}.pdf`;
        return apiClient.download(`/reports/finance/audit?month=${month}&year=${year}&format=pdf`, token, filename);
    },

    /**
     * Descarga un reporte histórico por su ID
     */
    async downloadReportById(token: string, id: string, name: string): Promise<void> {
        return apiClient.download(`/reports/download/${id}`, token, name);
    }
};
