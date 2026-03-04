"use client";

import { motion } from "framer-motion";
import { Leaf, Box, MoreHorizontal, Clock } from "lucide-react";
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
                "bg-card rounded-xl shadow-sm border cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow relative overflow-hidden flex flex-col shrink-0",
                "p-1.5 sm:p-5 min-h-[60px] sm:min-h-[180px]", // Reducción drástica en móvil
                borderClass,
                isActive && "ring-2 ring-primary/20"
            )}
        >
            <div className={cn("absolute left-0 top-0 bottom-0 w-1 sm:w-1.5", bgColor)} />

            {/* Layout Móvil: Fila única ultra-compacta */}
            <div className="flex sm:flex-col items-center sm:items-start h-full gap-2 sm:gap-4">
                {/* Icono y Título (Lado izquierdo en móvil) */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={cn("p-1 sm:p-2.5 rounded-lg sm:rounded-[14px] flex items-center justify-center shrink-0", colorClass)}>
                        {lot.lotType === "CULTIVATION" ? <Leaf size={12} className="sm:w-[18px] sm:h-[18px]" /> : <Box size={12} className="sm:w-[18px] sm:h-[18px]" />}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-[11px] sm:text-base leading-none sm:leading-tight truncate text-foreground">
                            {lot.strain?.name || "Sin Cepa"}
                        </h4>
                        <p className="text-[8px] sm:text-xs font-medium text-muted-foreground uppercase tracking-widest mt-0.5 truncate">
                            {lot.lotCode}
                        </p>
                    </div>
                </div>

                {/* Estadísticas (Lado derecho en móvil) */}
                <div className="flex items-center gap-3 shrink-0 mr-1 sm:mr-0 sm:grid sm:grid-cols-3 sm:w-full sm:bg-muted/30 sm:rounded-xl sm:p-3">
                    {lot.totalOutputEquivalentGrams !== null && (
                        <div className="flex flex-col items-end sm:items-start">
                            <span className="hidden sm:block text-[9px] font-bold text-muted-foreground uppercase">Cosechado</span>
                            <div className="flex items-center gap-1">
                                <span className="font-black text-[10px] sm:text-sm">{lot.totalOutputEquivalentGrams}</span>
                                <span className="text-[8px] font-bold text-muted-foreground sm:hidden">g</span>
                            </div>
                        </div>
                    )}
                    {lot.availableEquivalentGrams !== null && (
                        <div className="flex flex-col items-end sm:items-start">
                            <span className="hidden sm:block text-[9px] font-bold text-muted-foreground uppercase">Stock</span>
                            <div className="flex items-center gap-1">
                                <span className="font-black text-[10px] sm:text-sm text-primary">{lot.availableEquivalentGrams}</span>
                                <span className="text-[8px] font-bold text-primary/60 sm:hidden">g</span>
                            </div>
                        </div>
                    )}

                    {/* Botón Acción Móvil */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            onActionClick(lot, rect as DOMRect);
                        }}
                        className="sm:hidden text-muted-foreground p-1 hover:bg-muted rounded-md shrink-0"
                    >
                        <MoreHorizontal size={14} />
                    </button>
                </div>

                {/* Footer Desktop */}
                <div className="hidden sm:flex items-center justify-between mt-auto pt-3 border-t border-border/50 text-xs font-medium text-muted-foreground shrink-0 w-full">
                    <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {new Date(lot.createdAt).toLocaleDateString('es-AR')}
                    </div>
                </div>
            </div>

            {/* Botón Acción Desktop */}
            <div className="hidden sm:block absolute right-2 top-2">
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
        </motion.div>
    );
}
