"use client";

import { Wallet } from "lucide-react";

interface FinanceEmptyStateProps {
    onOpenOpeningModal: () => void;
}

export function FinanceEmptyState({ onOpenOpeningModal }: FinanceEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-24 bg-white/40 backdrop-blur-xl border border-white/40 rounded-[3rem] shadow-xl border-b-8 border-b-slate-100">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <Wallet size={48} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">La caja está cerrada</h2>
            <p className="text-slate-500 font-medium mb-8 text-center max-w-sm">
                Para registrar ventas o movimientos de dinero, primero debes abrir el turno del día.
            </p>
            <button
                onClick={onOpenOpeningModal}
                className="px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 transition-all"
            >
                Comenzar Jornada
            </button>
        </div>
    );
}
