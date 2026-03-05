"use client";

import { Shield, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ReprocannStatusCardProps {
    reprocanNumber: string | null;
    expirationDate: string | null;
    createdAt?: string | null;
    status: "ACTIVE" | "EXPIRED" | "PENDING_RENEWAL" | "REJECTED" | string;
    daysRemaining?: number;
}

export function ReprocannStatusCard({ reprocanNumber, expirationDate, createdAt, status, daysRemaining }: ReprocannStatusCardProps) {
    const isExpired = status === "EXPIRED";
    const isActive = status === "ACTIVE";

    // Use daysRemaining from API or calculate as fallback
    const daysLeft = daysRemaining !== undefined ? daysRemaining : (expirationDate ? Math.max(0, Math.ceil((new Date(expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 0);
    const progress = Math.min(100, Math.max(0, (daysLeft / 365) * 100));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white/50 shadow-xl shadow-slate-200/50 relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500" />

            <div className="flex items-start justify-between relative z-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                            isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                        )}>
                            <Shield size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Estado REPROCANN</h3>
                            <p className="text-xl font-black text-slate-800">
                                {reprocanNumber || "N/A"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {isActive ? (
                            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                <CheckCircle2 size={12} /> Vigente
                            </div>
                        ) : (
                            <div className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                <AlertCircle size={12} /> {status === "EXPIRED" ? "Vencido" : "Pendiente"}
                            </div>
                        )}
                        <span className="text-xs font-bold text-slate-400">
                            Vence: {expirationDate ? new Date(expirationDate).toLocaleDateString() : "No registrado"}
                        </span>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-3xl font-black text-slate-800">{daysLeft}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Días restantes</p>
                </div>
            </div>

            <div className="mt-8 space-y-2 relative z-10">
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-50">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn(
                            "h-full rounded-full shadow-sm",
                            progress > 20 ? "bg-gradient-to-r from-primary to-emerald-500" : "bg-amber-500"
                        )}
                    />
                </div>
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    <span>Emisión</span>
                    <span>Vencimiento</span>
                </div>
            </div>

            <button className="mt-6 w-full py-3 bg-slate-50 hover:bg-white border border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center gap-2 group/btn">
                Descargar Credencial
                <Clock size={14} className="group-hover/btn:rotate-12 transition-transform" />
            </button>
        </motion.div>
    );
}
