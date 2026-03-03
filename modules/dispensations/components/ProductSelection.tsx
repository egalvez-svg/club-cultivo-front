"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Droplet, Beaker, PackageOpen, Plus, Loader2 } from "lucide-react";
import { Product, ProductPresentationType } from "@/lib/services/product";
import { cn } from "@/lib/utils";
import { sileo } from "sileo";

const CATEGORIES: { id: ProductPresentationType | "ALL"; label: string; icon: any }[] = [
    { id: "ALL", label: "Todo", icon: PackageOpen },
    { id: "FLOWER", label: "Flores", icon: Leaf },
    { id: "OIL", label: "Aceites", icon: Droplet },
    { id: "EXTRACT", label: "Extractos", icon: Beaker },
];

const PRESENTATION_CONFIG: Record<ProductPresentationType, { label: string; icon: any; color: string; bg: string }> = {
    FLOWER: { label: "Flor Seca", icon: Leaf, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    OIL: { label: "Aceite", icon: Droplet, color: "text-blue-500", bg: "bg-blue-500/10" },
    EXTRACT: { label: "Extracto", icon: Beaker, color: "text-amber-500", bg: "bg-amber-500/10" },
    OTHER: { label: "Otros", icon: PackageOpen, color: "text-slate-500", bg: "bg-slate-500/10" },
};

interface ProductSelectionProps {
    products: Product[] | undefined;
    isLoading: boolean;
    selectedCategory: ProductPresentationType | "ALL";
    onSelectCategory: (category: ProductPresentationType | "ALL") => void;
    onAddToCart: (product: Product) => void;
}

export function ProductSelection({
    products,
    isLoading,
    selectedCategory,
    onSelectCategory,
    onAddToCart
}: ProductSelectionProps) {
    const filteredProducts = products?.filter(p =>
        p.active && (selectedCategory === "ALL" || p.presentationType === selectedCategory)
    );

    return (
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                {CATEGORIES.map(category => (
                    <button
                        key={category.id}
                        onClick={() => onSelectCategory(category.id)}
                        className={cn(
                            "px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 transition-all shrink-0",
                            selectedCategory === category.id
                                ? "bg-slate-900 text-white shadow-xl shadow-slate-200 scale-105"
                                : "bg-white border-2 border-slate-50 text-slate-400 hover:border-primary/20 hover:text-primary"
                        )}
                    >
                        <category.icon size={16} />
                        {category.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                    {isLoading ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                            <Loader2 className="animate-spin" size={32} />
                            <span className="font-black text-xs uppercase tracking-widest text-slate-400">Buscando inventario...</span>
                        </div>
                    ) : filteredProducts?.length ? (
                        filteredProducts.map((product, idx) => {
                            const config = PRESENTATION_CONFIG[product.presentationType] || PRESENTATION_CONFIG.OTHER;
                            const isOut = product.currentStock <= 0;

                            return (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                                    onClick={() => !isOut && onAddToCart(product)}
                                    className={cn(
                                        "group flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-primary/20 cursor-pointer active:scale-[0.98] relative overflow-hidden",
                                        isOut && "opacity-50 cursor-not-allowed grayscale-[0.8]"
                                    )}
                                >
                                    <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full opacity-[0.03] transition-opacity group-hover:opacity-[0.08]", config.bg)} />

                                    <div className={cn("w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", config.bg)}>
                                        <config.icon size={28} className={cn(config.color)} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-black text-[15px] text-slate-800 truncate mb-1">{product.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest", config.bg, config.color)}>
                                                {config.label}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                Stock: {product.currentStock}{product.physicalUnitType === 'GRAMS' ? 'g' : product.physicalUnitType === 'ML' ? 'ml' : 'u'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <div className="text-[17px] font-black text-slate-800 tracking-tight">${product.price.toLocaleString()}</div>
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                            {product.physicalUnitType === 'GRAMS' ? 'por gramo' : 'por unidad'}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="col-span-full p-12 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100 italic text-slate-400 text-sm">
                            No se encontraron productos coincidentes.
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
