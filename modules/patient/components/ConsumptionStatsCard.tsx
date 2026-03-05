"use client";

import { Leaf, Flame, ArrowUpRight, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ConsumptionStatsCardProps {
    consumedGrams: number;
    monthlyLimit: number;
    available?: number;
    progressPercent?: number;
    lastDispensationDate?: string;
}

export function ConsumptionStatsCard({ consumedGrams, monthlyLimit, available, progressPercent, lastDispensationDate }: ConsumptionStatsCardProps) {
    const percentage = progressPercent !== undefined ? progressPercent : Math.min(100, Math.max(0, (consumedGrams / monthlyLimit) * 100));
    const remains = available !== undefined ? available : Math.max(0, monthlyLimit - consumedGrams);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white/50 shadow-xl shadow-slate-200/50 relative overflow-hidden group h-full flex flex-col justify-between"
        >
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 rounded-tr-[5rem] -ml-8 -mb-8 transition-transform group-hover:scale-110 duration-500" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shadow-inner">
                        <Flame size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Seguimiento de Consumo</h3>
                        <p className="text-xs font-bold text-slate-400">Total acumulado este mes</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 backdrop-blur-sm">
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Consumido</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-slate-800">{consumedGrams}g</span>
                            <span className="text-xs font-bold text-slate-400">/ {monthlyLimit}g</span>
                        </div>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 backdrop-blur-sm">
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Disponible</p>
                        <div className="flex items-baseline gap-1 text-primary">
                            <span className="text-3xl font-black">{remains}g</span>
                            <ArrowUpRight size={16} className="mb-2" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 relative z-10">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progreso del Cupo</span>
                    <span className="text-sm font-black text-slate-800">{percentage.toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className={cn(
                            "h-full rounded-full transition-all duration-500",
                            percentage > 85 ? "bg-amber-500" : "bg-primary"
                        )}
                    />
                </div>

                <div className="flex items-center gap-2 mt-6 p-3 bg-white/50 border border-slate-100 rounded-xl">
                    <ShoppingCart size={14} className="text-slate-400" />
                    <p className="text-[10px] font-bold text-slate-500">
                        Última dispensación: <span className="text-slate-800 font-extrabold">{lastDispensationDate || "Sin registros"}</span>
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
