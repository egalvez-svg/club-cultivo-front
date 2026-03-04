"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, LayoutGrid, Leaf, Droplet, Beaker, PackageOpen, Pencil, Trash2 } from "lucide-react";
import { Product, ProductPresentationType, ProductPhysicalUnit } from "@/lib/services/product";

const PRESENTATION_CONFIG: Record<ProductPresentationType, { label: string; icon: any; color: string; bg: string }> = {
    FLOWER: { label: "Flor Seca", icon: Leaf, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    OIL: { label: "Aceite", icon: Droplet, color: "text-amber-500", bg: "bg-amber-500/10" },
    EXTRACT: { label: "Extracto", icon: Beaker, color: "text-purple-500", bg: "bg-purple-500/10" },
    OTHER: { label: "Otro", icon: PackageOpen, color: "text-muted-foreground", bg: "bg-muted" },
};

const UNIT_LABELS: Record<ProductPhysicalUnit, string> = {
    GRAMS: "g",
    ML: "ml",
    UNIT: "u",
};

interface ProductGridProps {
    products: Product[] | undefined;
    isLoading: boolean;
    searchQuery: string;
    onEditProduct: (product: Product) => void;
    onDeleteProduct: (product: Product) => void;
}

export function ProductGrid({ products, isLoading, searchQuery, onEditProduct, onDeleteProduct }: ProductGridProps) {
    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Cargando inventario</h3>
                <p className="text-muted-foreground font-medium">Sincronizando stock real...</p>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-muted/20 border-2 border-dashed border-border/50 rounded-3xl">
                <div className="w-20 h-20 bg-background shadow-xl border border-border/50 rounded-full flex items-center justify-center mb-6 text-muted-foreground">
                    <LayoutGrid size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No se encontraron productos</h3>
                {searchQuery ? (
                    <p className="text-muted-foreground font-medium">No hay resultados para "{searchQuery}"</p>
                ) : (
                    <p className="text-muted-foreground font-medium max-w-sm text-center">
                        Todavía no hay productos listos para dispensación. Cargá el primero para empezar.
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 -ml-1 pl-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
                <AnimatePresence>
                    {products.map((product: Product, i: number) => {
                        const presConfig = PRESENTATION_CONFIG[product.presentationType] || PRESENTATION_CONFIG.OTHER;
                        const PresIcon = presConfig.icon;
                        const isOut = product.currentStock <= 0;
                        const isLow = product.currentStock > 0 && product.currentStock <= 10;

                        return (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                transition={{ duration: 0.2, delay: i * 0.05 }}
                                className={`group relative bg-background border ${isOut ? 'border-destructive/20' : 'border-border/40'} rounded-[1.5rem] p-5 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between min-h-[240px]`}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="flex gap-3">
                                        <div className={`mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${presConfig.bg} ${presConfig.color}`}>
                                            <PresIcon size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-foreground text-lg leading-tight mb-1">{product.name}</h3>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                {product.strain?.name || "Sin Cepa"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 relative z-20">
                                        <button
                                            onClick={() => onEditProduct(product)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => onDeleteProduct(product)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-all shadow-sm"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-auto space-y-4">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-muted/30 rounded-lg p-2 flex flex-col">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Precio</span>
                                            <span className="font-bold text-sm text-foreground">${product.price.toLocaleString()}</span>
                                        </div>
                                        <div className="bg-muted/30 rounded-lg p-2 flex flex-col">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Tipo</span>
                                            <span className="font-bold text-sm text-foreground">{presConfig.label}</span>
                                        </div>
                                    </div>

                                    <div className={`flex items-center justify-between p-3 rounded-xl border ${isOut ? 'bg-destructive/5 border-destructive/20 text-destructive' : isLow ? 'bg-amber-500/5 border-amber-500/20 text-amber-600' : 'bg-primary/5 border-primary/20 text-primary'}`}>
                                        <span className="text-xs font-black uppercase tracking-widest">Stock Disponible</span>
                                        <span className="text-xl font-black">{product.currentStock}</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
