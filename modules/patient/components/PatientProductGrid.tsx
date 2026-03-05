"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Leaf, Droplet, Beaker, PackageOpen, ShoppingBag, Fingerprint, Zap, Activity } from "lucide-react";
import { StrainGroup, ProductPresentationType } from "@/lib/services/product";
import { cn } from "@/lib/utils";

const PRESENTATION_CONFIG: Record<ProductPresentationType, { label: string; icon: any; color: string; bg: string }> = {
    FLOWER: { label: "Flor Seca", icon: Leaf, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    OIL: { label: "Aceite", icon: Droplet, color: "text-amber-500", bg: "bg-amber-500/10" },
    EXTRACT: { label: "Extracto", icon: Beaker, color: "text-purple-500", bg: "bg-purple-500/10" },
    OTHER: { label: "Otro", icon: PackageOpen, color: "text-slate-400", bg: "bg-slate-100" },
};

interface PatientProductGridProps {
    groups: StrainGroup[] | undefined;
    isLoading: boolean;
    searchQuery: string;
}

export function PatientProductGrid({ groups, isLoading, searchQuery }: PatientProductGridProps) {
    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Cargando catálogo</h3>
                <p className="text-slate-400 font-medium">Sincronizando productos disponibles...</p>
            </div>
        );
    }

    // Flatten groups for a continuous grid
    const allCards = groups?.flatMap(group =>
        group.products.map(product => ({
            ...product,
            strain: group.strain
        }))
    );

    if (!allCards || allCards.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-white/40 backdrop-blur-sm border-2 border-dashed border-white/60 rounded-[2.5rem]">
                <div className="w-20 h-20 bg-white shadow-xl border border-white/50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                    <ShoppingBag size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No se encontraron productos</h3>
                <p className="text-slate-400 font-medium">{searchQuery ? `No hay resultados para "${searchQuery}"` : "El catálogo está vacío por el momento."}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            <AnimatePresence mode="popLayout">
                {allCards.map((product, i) => {
                    const presConfig = PRESENTATION_CONFIG[product.presentationType] || PRESENTATION_CONFIG.OTHER;
                    const PresIcon = presConfig.icon;
                    const isOut = !product.available;

                    return (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: i * 0.03 }}
                            className="group relative bg-white/70 hover:bg-white backdrop-blur-md border border-white/60 rounded-[2rem] p-5 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all flex flex-col h-full"
                        >
                            {/* Card Header: Strain Identity */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 group-hover:bg-primary transition-colors">
                                        <Fingerprint size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-[10px] font-black text-primary uppercase tracking-widest truncate">
                                            {product.strain.type}
                                        </h4>
                                        <h3 className="text-sm font-black text-slate-800 truncate leading-tight">
                                            {product.strain.name}
                                        </h3>
                                    </div>
                                </div>
                                <div className={cn(
                                    "px-2.5 py-1 rounded-lg border text-[8px] font-black uppercase tracking-tighter shrink-0",
                                    isOut ? "bg-red-50 border-red-100 text-red-500" : "bg-emerald-50 border-emerald-100 text-emerald-600"
                                )}>
                                    {isOut ? "Agotado" : "Disponible"}
                                </div>
                            </div>

                            {/* Product Info Section */}
                            <div className="bg-slate-50/50 rounded-2xl p-4 mb-4 border border-slate-100 group-hover:border-primary/10 group-hover:bg-white transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-base font-black text-slate-800 leading-tight">
                                        {product.name}
                                    </h2>
                                    <div className={`${presConfig.color} ${presConfig.bg} p-1.5 rounded-lg shrink-0`}>
                                        <PresIcon size={16} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <Zap size={12} className="text-primary/40" />
                                    <span className="text-[10px] font-bold uppercase tracking-tight">
                                        {product.netPhysicalQuantity}{product.physicalUnitType === "GRAMS" ? "g" : product.physicalUnitType === "ML" ? "ml" : "u"}
                                    </span>
                                    <span className="text-[10px] text-slate-300">•</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tight">
                                        {presConfig.label}
                                    </span>
                                </div>
                            </div>

                            {/* Clinical Metrics Cluster */}
                            <div className="grid grid-cols-2 gap-2 mb-6">
                                <div className="bg-white rounded-xl p-2.5 border border-slate-50 shadow-sm">
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Potencia THC</span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-slate-800">{product.strain.thcPercentage}%</span>
                                        <Activity size={10} className="text-emerald-500/40" />
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl p-2.5 border border-slate-50 shadow-sm">
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Balance CBD</span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-primary">{product.strain.cbdPercentage}%</span>
                                        <div className="w-2 h-2 rounded-full bg-primary/20" />
                                    </div>
                                </div>
                                <div className="col-span-2 bg-slate-900/[0.02] rounded-xl px-3 py-2">
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Linaje Genético</span>
                                    <p className="text-[10px] font-bold text-slate-600 truncate leading-none capitalize">
                                        {product.strain.genetics}
                                    </p>
                                </div>
                            </div>

                            {/* Commercial Footer */}
                            <div className="mt-auto pt-4 border-t border-slate-100/50 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Valor</span>
                                    <div className="flex items-baseline gap-0.5">
                                        <span className="text-xs font-black text-primary tracking-tighter">$</span>
                                        <span className="text-xl font-black text-slate-800 tracking-tighter">
                                            {product.price.toLocaleString("es-AR")}
                                        </span>
                                    </div>
                                </div>
                                {!isOut && (
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Stock Club</span>
                                        <span className="text-xs font-black text-primary-dark tracking-tight">
                                            {product.stock} unidades
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
