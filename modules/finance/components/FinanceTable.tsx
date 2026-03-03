"use client";

import { History, Plus, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FinanceTableProps {
    movements: any[];
    onOpenMovementModal: () => void;
}

export function FinanceTable({ movements, onOpenMovementModal }: FinanceTableProps) {
    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                        <History size={20} />
                    </div>
                    <h3 className="font-bold text-lg">Últimos Movimientos</h3>
                </div>
                <button
                    onClick={onOpenMovementModal}
                    className="h-10 px-4 bg-primary/10 text-primary rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-white transition-all"
                >
                    <Plus size={16} />
                    Nuevo Movimiento
                </button>
            </div>

            <div className="flex-1 overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                            <th className="px-6 py-4 text-left">Hora</th>
                            <th className="px-6 py-4 text-left">Descripción</th>
                            <th className="px-6 py-4 text-left">Tipo</th>
                            <th className="px-6 py-4 text-right">Monto</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {[...movements].reverse().map((movement) => (
                            <tr key={movement.id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock size={14} />
                                        <span className="text-sm font-medium">{format(new Date(movement.createdAt), "HH:mm")}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-slate-700">
                                        {movement.translatedReferenceType || movement.referenceType}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                        movement.movementType === "INCOME"
                                            ? "bg-emerald-50 text-emerald-600"
                                            : movement.movementType === "ADJUSTMENT"
                                                ? "bg-amber-50 text-amber-600"
                                                : "bg-rose-50 text-rose-600"
                                    )}>
                                        {movement.translatedMovementType || movement.movementType}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className={cn(
                                        "text-[15px] font-black",
                                        movement.movementType === "INCOME"
                                            ? "text-emerald-600"
                                            : movement.movementType === "ADJUSTMENT"
                                                ? "text-amber-600"
                                                : "text-rose-600"
                                    )}>
                                        {movement.movementType === "INCOME" ? "+" : movement.movementType === "ADJUSTMENT" ? "" : "-"}${movement.amount.toLocaleString()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {movements.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-20 text-center">
                                    <p className="text-muted-foreground font-medium">No hay movimientos registrados en este turno.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
