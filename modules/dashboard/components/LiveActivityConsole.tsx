"use client";

import { motion } from "framer-motion";
import { Loader2, ShieldAlert } from "lucide-react";
import { LiveActivity } from "@/lib/services/dashboard";
import { cn } from "@/lib/utils";

interface LiveActivityConsoleProps {
    activities: LiveActivity[];
}

export function LiveActivityConsole({ activities }: LiveActivityConsoleProps) {
    return (
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white h-full flex flex-col border border-white/5 shadow-2xl">
            <h3 className="text-lg font-black mb-6 flex items-center gap-3">
                <div className="relative">
                    <Loader2 size={18} className="text-primary animate-spin" />
                    <div className="absolute inset-0 bg-primary/20 blur-sm rounded-full animate-pulse" />
                </div>
                Sistema en Vivo
            </h3>

            <div className="flex-1 overflow-y-auto custom-scrollbar-dark pr-2 space-y-4">
                {activities.length === 0 ? (
                    <div className="text-center py-10 opacity-30">
                        <p className="text-xs font-bold uppercase tracking-widest">Esperando actividad...</p>
                    </div>
                ) : (
                    activities.map((activity, index) => {
                        const Icon = ShieldAlert;

                        return (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 text-primary")}>
                                        <Icon size={16} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                {activity.user}
                                            </span>
                                            <span className="text-[10px] font-medium text-slate-600">
                                                {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-xs font-medium text-slate-300 leading-relaxed">
                                            {activity.message}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    <span>Estado: Conectado</span>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                        <div className="w-1 h-1 rounded-full bg-primary animate-pulse delay-75" />
                        <div className="w-1 h-1 rounded-full bg-primary animate-pulse delay-150" />
                    </div>
                </div>
            </div>
        </div>
    );
}
