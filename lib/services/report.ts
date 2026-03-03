import { API_URL } from "./auth";

export interface RecentReport {
    id: string;
    name: string;
    fileSize: number;
    generatedBy: string;
    status: "COMPLETED" | "FAILED" | "PENDING";
    createdAt: string;
}

/**
 * Helper to download a Blob as a file in the browser
 */
const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};

export const reportService = {
    /**
     * Obtiene el historial de los últimos reportes generados
     */
    async getRecentReports(token: string): Promise<RecentReport[]> {
        const response = await fetch(`${API_URL}/reports/recent`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al obtener historial de reportes");
        }

        return response.json();
    },

    /**
     * Descarga el PDF de trazabilidad de pacientes (REPROCANN)
     */
    async downloadPatientTraceability(token: string, month: number, year: number): Promise<void> {
        const response = await fetch(`${API_URL}/reports/traceability/patients?month=${month}&year=${year}&format=pdf`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al descargar el reporte de pacientes");
        }

        const blob = await response.blob();
        downloadBlob(blob, `Trazabilidad_Pacientes_${new Date().toISOString().split('T')[0]}.pdf`);
    },

    /**
     * Descarga el PDF del libro de cultivo y lotes
     */
    async downloadProductionTraceability(token: string, month: number, year: number): Promise<void> {
        const response = await fetch(`${API_URL}/reports/traceability/production?month=${month}&year=${year}&format=pdf`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al descargar el libro de cultivo");
        }

        const blob = await response.blob();
        downloadBlob(blob, `Libro_Cultivo_${new Date().toISOString().split('T')[0]}.pdf`);
    },

    /**
     * Descarga el PDF de la auditoría financiera (cajas y movimientos)
     */
    async downloadFinanceAudit(token: string, month: number, year: number): Promise<void> {
        const response = await fetch(`${API_URL}/reports/finance/audit?month=${month}&year=${year}&format=pdf`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al descargar la auditoría financiera");
        }

        const blob = await response.blob();
        downloadBlob(blob, `Auditoria_Financiera_${new Date().toISOString().split('T')[0]}.pdf`);
    }
};
