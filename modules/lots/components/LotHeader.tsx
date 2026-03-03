"use client";

import { Plus } from "lucide-react";

interface LotHeaderProps {
    onAddLot: () => void;
}

export function LotHeader({ onAddLot }: LotHeaderProps) {
    return (
        <div className="flex justify-between items-end pb-2">
            <div>
                <h2 className="text-2xl font-bold font-display">Lotes de Producción</h2>
                <p className="text-muted-foreground text-sm">Trazabilidad en tiempo real (Kanban drag & drop).</p>
            </div>
            <button
                onClick={onAddLot}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
                <Plus size={18} />
                Nuevo Lote
            </button>
        </div>
    );
}
