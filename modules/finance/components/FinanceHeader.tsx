"use client";

import { Unlock, Lock } from "lucide-react";
import { es } from "date-fns/locale";
import { format as formatDate } from "date-fns";

interface FinanceHeaderProps {
    activeRegister: any;
    onOpenOpeningModal: () => void;
    onOpenCloseModal: () => void;
}

export function FinanceHeader({ activeRegister, onOpenOpeningModal, onOpenCloseModal }: FinanceHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-black text-foreground tracking-tight">Caja y Finanzas</h1>
                <p className="text-muted-foreground font-medium">Control de ingresos, egresos y arqueo diario.</p>
            </div>

            {!activeRegister || activeRegister.status !== "OPEN" ? (
                <button
                    onClick={onOpenOpeningModal}
                    className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all transform active:scale-95 shadow-xl shadow-slate-200"
                >
                    <Unlock size={20} className="text-primary" />
                    Abrir Turno de Caja
                </button>
            ) : (
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Turno Abierto</span>
                        <span className="text-xs font-bold text-foreground">
                            {activeRegister.openedAt && formatDate(new Date(activeRegister.openedAt), "HH:mm 'hs'", { locale: es })}
                        </span>
                    </div>
                    <button
                        onClick={onOpenCloseModal}
                        className="h-14 px-8 bg-destructive/10 text-destructive border-2 border-destructive/10 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all hover:bg-destructive hover:text-white transform active:scale-95"
                    >
                        <Lock size={20} />
                        Finalizar Turno
                    </button>
                </div>
            )}
        </div>
    );
}
