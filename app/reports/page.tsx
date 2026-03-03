"use client";

import { useState } from "react";

import {
    FileText,
    Download,
    Calendar,
    Users,
    Leaf,
    ShieldCheck,
    Printer,
    ChevronRight,
    ExternalLink,
    Loader2
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    useRecentReports,
    useDownloadPatientReport,
    useDownloadProductionReport,
    useDownloadFinanceReport
} from "@/lib/hooks/useReports";

export default function ReportsPage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const { data: recentReports, isLoading: isLoadingHistory } = useRecentReports();

    const downloadPatientMutation = useDownloadPatientReport();
    const downloadProductionMutation = useDownloadProductionReport();
    const downloadFinanceMutation = useDownloadFinanceReport();
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-display">Centro de Reportes</h2>
                    <p className="text-muted-foreground text-sm">Documentación oficial y trazabilidad para cumplimiento legal.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-muted border border-border rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-muted/80 transition-all">
                        <Calendar size={14} />
                        {format(selectedDate, "MMMM yyyy", { locale: es })}
                    </button>
                </div>
            </div>

            {/* Report Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    {
                        title: "Trazabilidad de Pacientes",
                        desc: "Detalle completo de entregas vinculadas a médicos y permisos REPROCANN.",
                        icon: Users,
                        color: "text-blue-500",
                        bg: "bg-blue-50",
                        action: () => downloadPatientMutation.mutate({
                            month: selectedDate.getMonth() + 1,
                            year: selectedDate.getFullYear()
                        }),
                        isLoading: downloadPatientMutation.isPending
                    },
                    {
                        title: "Libro de Cultivo (Lotes)",
                        desc: "Registro de ciclos de producción, pesos húmedos y secos por variedad.",
                        icon: Leaf,
                        color: "text-green-500",
                        bg: "bg-green-50",
                        action: () => downloadProductionMutation.mutate({
                            month: selectedDate.getMonth() + 1,
                            year: selectedDate.getFullYear()
                        }),
                        isLoading: downloadProductionMutation.isPending
                    },
                    {
                        title: "Auditoría Financiera",
                        desc: "Consolidado de ingresos, egresos y sesiones de caja cerradas.",
                        icon: ShieldCheck,
                        color: "text-primary",
                        bg: "bg-secondary",
                        action: () => downloadFinanceMutation.mutate({
                            month: selectedDate.getMonth() + 1,
                            year: selectedDate.getFullYear()
                        }),
                        isLoading: downloadFinanceMutation.isPending
                    },
                ].map((report, i) => (
                    <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col group">
                        <div className={`w-12 h-12 ${report.bg} ${report.color} rounded-xl flex items-center justify-center mb-4`}>
                            <report.icon size={24} />
                        </div>
                        <h3 className="text-lg font-bold mb-2">{report.title}</h3>
                        <p className="text-sm text-muted-foreground mb-6 flex-1">{report.desc}</p>
                        <div className="flex gap-2">
                            <button
                                onClick={report.action}
                                disabled={report.isLoading}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {report.isLoading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                                {report.isLoading ? "Generando..." : "Exportar PDF"}
                            </button>
                            <button className="p-2.5 border border-border rounded-xl text-muted-foreground hover:bg-muted transition-all">
                                <Printer size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Exports / Archive */}
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/10">
                    <h3 className="font-bold text-sm">Últimos Reportes Generados</h3>
                </div>
                <div className="divide-y divide-border">
                    {isLoadingHistory ? (
                        <div className="px-6 py-8 flex justify-center text-muted-foreground">
                            <Loader2 size={24} className="animate-spin" />
                        </div>
                    ) : recentReports?.length === 0 ? (
                        <div className="px-6 py-8 text-center text-muted-foreground">
                            <p className="text-sm font-medium">No hay reportes generados aún</p>
                        </div>
                    ) : (
                        recentReports?.map((file) => (
                            <div key={file.id} className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-muted/20 transition-colors group gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-muted rounded-lg text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                                        <FileText size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold truncate">{file.name}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter truncate">
                                            {file.fileSize > 1024 * 1024
                                                ? `${(file.fileSize / 1024 / 1024).toFixed(2)} MB`
                                                : `${(file.fileSize / 1024).toFixed(1)} KB`}
                                            {" "}• Generado por {file.generatedBy}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                    <span className="text-[10px] sm:text-xs text-muted-foreground bg-muted sm:bg-transparent px-2 py-1 rounded sm:p-0">
                                        {file.createdAt && !isNaN(new Date(file.createdAt).getTime())
                                            ? format(new Date(file.createdAt), "dd MMM, HH:mm", { locale: es })
                                            : "Fecha reciente"}
                                    </span>
                                    <button className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-all border border-border sm:border-0">
                                        <Download size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="bg-secondary/30 border border-primary/10 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <ShieldCheck size={120} />
                </div>
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-primary/5">
                    <FileText size={40} className="text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold mb-2">Certificación de Trazabilidad Legal</h3>
                    <p className="text-sm text-muted-foreground max-w-2xl">
                        Este módulo utiliza firmas criptográficas para asegurar que los reportes de dispensación coinciden exactamente con los registros de cultivo, proporcionando una cadena de custodia inviolable para inspecciones sanitarias.
                    </p>
                </div>
                <button className="px-8 py-3 bg-white border border-primary/20 text-primary font-bold rounded-xl text-sm shadow-sm hover:bg-primary hover:text-white transition-all">
                    Configurar Firmas
                </button>
            </div>
        </div>
    );
}
