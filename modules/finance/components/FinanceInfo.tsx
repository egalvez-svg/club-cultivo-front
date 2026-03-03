"use client";

import { CheckCircle2, Calendar, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function FinanceInfo() {
    return (
        <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-emerald-50 rounded-[2.5rem] p-8 border-2 border-emerald-100 relative overflow-hidden group">
                <CheckCircle2 className="absolute top-4 right-4 text-emerald-200 group-hover:scale-110 transition-transform" size={40} />
                <h4 className="text-emerald-800 font-black text-sm uppercase tracking-widest mb-4">Estado de Auditoría</h4>
                <p className="text-emerald-600 font-medium text-sm leading-relaxed mb-6">
                    La caja está operativa. Todas las ventas en efectivo se registran automáticamente aquí. Recuerda ingresar los gastos manuales para un arqueo exitoso.
                </p>
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-2xl border border-emerald-200/50">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                        <Calendar size={18} />
                    </div>
                    <span className="text-xs font-bold text-emerald-800">
                        Turno de: {format(new Date(), "EEEE dd 'de' MMMM", { locale: es })}
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <h4 className="text-slate-800 font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                    <AlertCircle size={18} className="text-primary" />
                    Recomendaciones
                </h4>
                <ul className="space-y-4">
                    <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <p className="text-sm text-slate-500 font-medium">Registra retiros de efectivo si se depositan en el banco.</p>
                    </li>
                    <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <p className="text-sm text-slate-500 font-medium">Verifica el fondo fijo antes de cerrar el turno.</p>
                    </li>
                    <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <p className="text-sm text-slate-500 font-medium">Usa la descripción para detallar proveedores de gastos.</p>
                    </li>
                </ul>
            </div>
        </div>
    );
}
