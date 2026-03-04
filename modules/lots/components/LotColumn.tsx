"use client";

import { cn } from "@/lib/utils";
import { Lot } from "@/lib/services/lot";
import { LotCard } from "./LotCard";
import { AnimatePresence } from "framer-motion";

interface LotColumnProps {
    status: {
        id: string;
        title: string;
        color: string;
        border: string;
    };
    lots: Lot[];
    draggedLotId: string | null;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent, statusId: string) => void;
    onDragStart: (e: React.DragEvent, id: string) => void;
    onActionClick: (lot: Lot, rect: DOMRect) => void;
    activeMenuId: string | null;
}

export function LotColumn({
    status,
    lots,
    draggedLotId,
    onDragOver,
    onDrop,
    onDragStart,
    onActionClick,
    activeMenuId
}: LotColumnProps) {
    const isDragOver = draggedLotId && !lots.some(l => l.id === draggedLotId);

    return (
        <div
            className={cn(
                "flex-1 w-full lg:min-w-[280px] lg:max-w-[320px] shrink-0 lg:shrink flex flex-col h-full max-h-full bg-muted/10 lg:bg-muted/20 rounded-t-3xl lg:rounded-3xl border-x lg:border border-t lg:border border-border/40 transition-all",
                "p-0 lg:p-3", // Sin padding en móvil para maximizar espacio
                isDragOver ? "scale-[1.02] ring-2 ring-primary/20 shadow-xl bg-primary/5" : "hover:bg-muted/30"
            )}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, status.id)}
        >
            <div className="hidden lg:flex items-center justify-between px-3 pb-3 pt-2 mb-2 border-b border-border/40 shrink-0">
                <div className="flex items-center gap-3">
                    <div className={cn("w-2.5 h-2.5 rounded-full", status.color.split(" ")[0])} />
                    <h3 className="font-bold text-foreground text-[13px] uppercase tracking-widest">{status.title}</h3>
                    <span className="px-2.5 py-1 bg-background rounded-full text-[11px] font-black text-muted-foreground shadow-sm border border-border/50">
                        {lots.length}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-2 sm:gap-3 overflow-y-auto overflow-x-hidden flex-1 p-2 sm:p-1 min-h-0 custom-scrollbar">
                <AnimatePresence>
                    {lots.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground/40 gap-2">
                            <h3 className="text-xs font-black uppercase tracking-widest">Sin lotes</h3>
                        </div>
                    ) : (
                        lots.map(lot => (
                            <LotCard
                                key={lot.id}
                                lot={lot}
                                colorClass={status.color}
                                borderClass={status.border}
                                onDragStart={(e) => onDragStart(e, lot.id)}
                                onActionClick={onActionClick}
                                isActive={activeMenuId === lot.id}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
