"use client";

import { ScanBarcode, Search, Plus } from "lucide-react";

interface ProductHeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onCreateProduct: () => void;
}

export function ProductHeader({ searchQuery, onSearchChange, onCreateProduct }: ProductHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 pb-2">
            <div>
                <h2 className="text-3xl font-bold font-display tracking-tight text-foreground flex items-center gap-3">
                    <ScanBarcode className="text-primary w-8 h-8" />
                    Inventario
                </h2>
                <p className="text-muted-foreground font-medium mt-1">
                    Catálogo de productos disponibles para dispensación.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:h-12 w-full sm:w-auto">
                <div className="relative h-12 sm:h-full flex items-center w-full sm:w-[320px] max-w-full">
                    <Search className="absolute left-4 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por cepa, producto..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full h-full pl-11 pr-4 bg-white/60 border-2 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/10 rounded-2xl outline-none transition-all text-[15px] font-medium placeholder:text-muted-foreground/50 shadow-sm"
                    />
                </div>

                <button
                    onClick={onCreateProduct}
                    className="h-12 w-full sm:w-auto px-6 bg-primary text-primary-foreground font-bold text-[13px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all hover:bg-primary/95 shrink-0 whitespace-nowrap"
                >
                    <Plus size={20} />
                    Nuevo Producto
                </button>
            </div>
        </div>
    );
}
