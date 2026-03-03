"use client";

import { motion } from "framer-motion";
import { Leaf, Box, MoreHorizontal, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Lot } from "@/lib/services/lot";

interface LotCardProps {
    lot: Lot;
    colorClass: string;
    borderClass: string;
    onDragStart: (e: React.DragEvent) => void;
    onActionClick: (lot: Lot, rect: DOMRect) => void;
    isActive: boolean;
}

export function LotCard({ lot, colorClass, borderClass, onDragStart, onActionClick, isActive }: LotCardProps) {
    // Extract bg color for the left bar
    const bgColor = colorClass.split(" ")[0];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            draggable
            onDragStart={onDragStart as any}
            className={cn(
                "bg-card rounded-2xl p-5 shadow-sm border cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow relative overflow-hidden group/card flex flex-col min-h-[180px] shrink-0",
                borderClass,
                isActive && "ring-2 ring-primary/20"
            )}
        >
            {/* Left color bar */}
            <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", bgColor)} />

            <div className="flex justify-between items-start mb-3 shrink-0">
                <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground bg-muted/30 px-2 py-1 rounded-md">
                    {lot.lotType === "CULTIVATION" ? "Cultivo" : "Empaque"}
                </span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        onActionClick(lot, rect as DOMRect);
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
                >
                    <MoreHorizontal size={18} />
                </button>
            </div>

            <div className="flex items-center gap-3 mb-4 shrink-0">
                <div className={cn("p-2.5 rounded-[14px] flex items-center justify-center", colorClass)}>
                    {lot.lotType === "CULTIVATION" ? <Leaf size={18} /> : <Box size={18} />}
                </div>
                <div className="min-w-0">
                    <h4 className="font-bold text-base leading-tight truncate">
                        {lot.strain?.name || "Cepa Desconocida"}
                    </h4>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-0.5 truncate">
                        {lot.lotCode}
                    </p>
                </div>
            </div>

            {(lot.totalOutputEquivalentGrams !== null || lot.totalProductionCost !== null || lot.availableEquivalentGrams !== null) && (
                <div className="grid grid-cols-3 gap-2 mb-4 bg-muted/30 rounded-xl p-3 shrink-0">
                    {lot.totalOutputEquivalentGrams !== null && lot.totalOutputEquivalentGrams !== undefined && (
                        <div>
                            <span className="block text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Cosechado</span>
                            <span className="font-black text-sm">{lot.totalOutputEquivalentGrams}g</span>
                        </div>
                    )}
                    {lot.availableEquivalentGrams !== null && lot.availableEquivalentGrams !== undefined && (
                        <div>
                            <span className="block text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Stock</span>
                            <span className="font-black text-sm text-primary">{lot.availableEquivalentGrams}g</span>
                        </div>
                    )}
                    {lot.totalProductionCost !== null && lot.totalProductionCost !== undefined && (
                        <div>
                            <span className="block text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Costo</span>
                            <span className="font-black text-sm">${lot.totalProductionCost.toLocaleString()}</span>
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50 text-xs font-medium text-muted-foreground shrink-0">
                <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    {new Date(lot.createdAt).toLocaleDateString('es-AR')}
                </div>
                {lot.status === "RELEASED" && (
                    <CheckCircle2 size={14} className="text-emerald-500" />
                )}
            </div>
        </motion.div>
    );
}
