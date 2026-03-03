"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface FinanceStatsProps {
    activeRegister: any;
}

export function FinanceStats({ activeRegister }: FinanceStatsProps) {
    const totalIncome = activeRegister.movements
        .filter((m: any) => m.movementType === "INCOME")
        .reduce((acc: number, m: any) => acc + m.amount, 0);

    const totalExpense = activeRegister.movements
        .filter((m: any) => m.movementType === "EXPENSE")
        .reduce((acc: number, m: any) => acc + m.amount, 0);

    return (
        <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-24 -mt-24 blur-3xl" />
            <div className="relative z-10">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-4 block">Balance de Caja Actual</span>
                <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-5xl font-black">${activeRegister.currentBalance.toLocaleString()}</span>
                    <span className="text-white/40 font-bold">ARS</span>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 block">Saldo Inicial</span>
                        <span className="text-lg font-black">${activeRegister.openingBalance.toLocaleString()}</span>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp size={14} className="text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Ingresos</span>
                        </div>
                        <span className="text-lg font-black text-emerald-400">
                            +${totalIncome.toLocaleString()}
                        </span>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingDown size={14} className="text-rose-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Egresos</span>
                        </div>
                        <span className="text-lg font-black text-rose-400">
                            -${totalExpense.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
