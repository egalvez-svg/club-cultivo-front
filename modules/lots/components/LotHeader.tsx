"use client";

import { Plus } from "lucide-react";

interface LotHeaderProps {
    onAddLot: () => void;
}

export function LotHeader({ onAddLot }: LotHeaderProps) {
    return (
        <div className="flex flex-row items-center justify-between gap-4 pb-2">
            <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-foreground truncate">Lotes</h2>
                <p className="hidden sm:block text-muted-foreground text-sm">Gestiona tus lotes de cultivo y empaque.</p>
            </div>
            <button
                onClick={onAddLot}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 shrink-0"
            >
                <Plus size={16} />
                <span className="hidden xs:inline">Nuevo Lote</span>
                <span className="xs:hidden">Nuevo</span>
            </button>
        </div>
    );
}
