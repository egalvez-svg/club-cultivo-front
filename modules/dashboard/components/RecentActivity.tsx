"use client";

import { DashboardData } from "@/lib/services/dashboard";
import { format, isValid } from "date-fns";
import { es } from "date-fns/locale";

interface RecentActivityProps {
    dispensations: DashboardData["recentDispensations"];
}

const formatDateSafe = (dateString: string, formatStr: string) => {
    const date = new Date(dateString);
    if (!isValid(date)) return "N/A";
    return format(date, formatStr, { locale: es });
};

export function RecentActivity({ dispensations }: RecentActivityProps) {
    return (
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Últimas Dispensaciones</h2>
                <button className="text-sm text-primary font-medium hover:underline">Ver todas</button>
            </div>

            <div className="space-y-4">
                {dispensations.map((disp) => (
                    <div key={disp.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                                {disp.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                                <p className="font-medium text-sm">{disp.patientName}</p>
                                <p className="text-xs text-muted-foreground">{disp.description} • {disp.totalEquivalentGrams}g</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-sm">${disp.amount.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">
                                {formatDateSafe(disp.date, "HH:mm 'hs'")}
                            </p>
                        </div>
                    </div>
                ))}
                {dispensations.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">No hay dispensaciones recientes</div>
                )}
            </div>
        </div>
    );
}
