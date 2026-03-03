"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, PackageOpen, Leaf, Droplet, Beaker, Hash, BadgeDollarSign, AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { sileo } from "sileo";
import { useCreateProduct, useUpdateProduct } from "@/lib/hooks/useProducts";
import { useStrainsList } from "@/lib/hooks/useStrains";
import { useLotsByStrain } from "@/lib/hooks/useLots";
import { Product, ProductPresentationType, ProductPhysicalUnit } from "@/lib/services/product";

interface CreateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product | null;
}

const PRESENTATION_OPTIONS: { value: ProductPresentationType; label: string; icon: typeof Leaf }[] = [
    { value: "FLOWER", label: "Flor Seca", icon: Leaf },
    { value: "OIL", label: "Aceite", icon: Droplet },
    { value: "EXTRACT", label: "Extracto", icon: Beaker },
    { value: "OTHER", label: "Otro", icon: PackageOpen },
];

const UNIT_OPTIONS: { value: ProductPhysicalUnit; label: string }[] = [
    { value: "GRAMS", label: "Gramos (g)" },
    { value: "ML", label: "Mililitros (ml)" },
    { value: "UNIT", label: "Unidades (u)" },
];

export function CreateProductModal({ isOpen, onClose, product }: CreateProductModalProps) {
    const isEditing = !!product;
    const { data: strains } = useStrainsList();
    const createProductMutation = useCreateProduct();
    const updateProductMutation = useUpdateProduct();

    // Form state
    const [name, setName] = useState("");
    const [strainId, setStrainId] = useState("");
    const [presentationType, setPresentationType] = useState<ProductPresentationType>("FLOWER");
    const [physicalUnitType, setPhysicalUnitType] = useState<ProductPhysicalUnit>("GRAMS");
    const [netPhysicalQuantity, setNetPhysicalQuantity] = useState<number>(0);
    const [equivalentDryGrams, setEquivalentDryGrams] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [currentStock, setCurrentStock] = useState<number>(0);
    const [productionLotId, setProductionLotId] = useState("");

    const { data: lots, isLoading: isLoadingLots } = useLotsByStrain(strainId || null);

    // Initialize/Reset form based on product prop
    useEffect(() => {
        if (product && isOpen) {
            setName(product.name);
            setStrainId(product.strainId);
            setPresentationType(product.presentationType);
            setPhysicalUnitType(product.physicalUnitType);
            setNetPhysicalQuantity(product.netPhysicalQuantity);
            setEquivalentDryGrams(product.equivalentDryGrams);
            setPrice(product.price);
            setCurrentStock(product.currentStock);
            setProductionLotId(product.productionLotId || product.lots?.[0]?.id || "");
        } else if (!isOpen) {
            // Clean up when closed
            // reset logic is usually in handleClose but useEffect ensures it
        }
    }, [product, isOpen]);

    // Effect to reset lot selection ONLY when strain changes manually (not on initial load/edit)
    useEffect(() => {
        // Only reset if we are not initializing from a product edit
        if (strainId && product?.strainId !== strainId) {
            setProductionLotId("");
        }
    }, [strainId, product?.strainId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !strainId) return;

        try {
            if (isEditing && product) {
                // Determine what to send for update - some fields might cause 500 if sent redundantly or wrongly
                const updateData: any = {
                    name,
                    strainId,
                    presentationType,
                    physicalUnitType,
                    netPhysicalQuantity: Number(netPhysicalQuantity),
                    equivalentDryGrams: Number(equivalentDryGrams),
                    price: Number(price),
                    currentStock: Number(currentStock),
                };

                if (productionLotId) {
                    updateData.productionLotId = productionLotId;
                }

                await sileo.promise(
                    updateProductMutation.mutateAsync({
                        id: product.id,
                        data: updateData,
                    }),
                    {
                        loading: { title: "Actualizando producto...", description: "Por favor espere" },
                        success: { title: "Producto actualizado", description: "Cambios guardados correctamente" },
                        error: { title: "Error", description: "No se pudo actualizar el producto" },
                    }
                );
            } else {
                await sileo.promise(
                    createProductMutation.mutateAsync({
                        name,
                        strainId,
                        presentationType,
                        physicalUnitType,
                        netPhysicalQuantity: Number(netPhysicalQuantity),
                        equivalentDryGrams: Number(equivalentDryGrams),
                        price: Number(price),
                        currentStock: Number(currentStock),
                        productionLotId,
                    }),
                    {
                        loading: { title: "Creando producto...", description: "Por favor espere" },
                        success: { title: "Producto creado", description: "Añadido al inventario" },
                        error: { title: "Error", description: "No se pudo crear el producto" },
                    }
                );
            }
            handleClose();
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    const handleClose = () => {
        setName("");
        setStrainId("");
        setPresentationType("FLOWER");
        setPhysicalUnitType("GRAMS");
        setNetPhysicalQuantity(0);
        setEquivalentDryGrams(0);
        setPrice(0);
        setCurrentStock(0);
        setProductionLotId("");
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-card border border-border shadow-2xl rounded-3xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-border/50 shrink-0">
                            <div>
                                <h2 className="text-2xl font-bold font-display text-foreground">
                                    {isEditing ? `Editar: ${product?.name}` : "Nuevo Producto"}
                                </h2>
                                <p className="text-muted-foreground font-medium text-sm mt-1">
                                    {isEditing ? "Modificá la información o stock de este producto." : "Agregá un producto y su stock inicial al menú del club."}
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-slate-50/30">
                            <form id="create-product-form" onSubmit={handleSubmit} className="space-y-10">

                                {/* SECTION: INFORMACIÓN BÁSICA */}
                                <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm space-y-6">
                                    <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                            <PackageOpen size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Definición General</h3>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Datos principales del catálogo</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Nombre</label>
                                            <div className="relative group/input">
                                                <PackageOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    required
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px]"
                                                    placeholder="Ej. Frasco Amnesia Haze 5g"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Genética</label>
                                                <div className="relative group/input">
                                                    <Leaf className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                                    <select
                                                        required
                                                        value={strainId}
                                                        onChange={(e) => setStrainId(e.target.value)}
                                                        className="w-full pl-12 pr-10 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px] appearance-none cursor-pointer text-slate-700"
                                                    >
                                                        <option value="" className="text-muted-foreground">Seleccionar cepa...</option>
                                                        {strains?.filter(s => s.active).map(s => (
                                                            <option key={s.id} value={s.id} className="text-slate-700">{s.name} ({s.type})</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                        <ChevronDown size={18} />
                                                    </div>
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {strainId && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.98 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="space-y-2"
                                                    >
                                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Lote Origen</label>
                                                        <div className="relative group/input">
                                                            <Hash className={cn(
                                                                "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
                                                                isLoadingLots ? "text-primary animate-pulse" : "text-muted-foreground group-focus-within/input:text-primary"
                                                            )} size={18} />
                                                            <select
                                                                required
                                                                value={productionLotId}
                                                                onChange={(e) => setProductionLotId(e.target.value)}
                                                                className={cn(
                                                                    "w-full pl-12 pr-10 py-3.5 border-2 rounded-[1.25rem] transition-all font-medium text-[15px] outline-none appearance-none cursor-pointer",
                                                                    isLoadingLots ? "bg-slate-100 text-muted-foreground border-transparent" : "bg-muted/30 border-transparent focus:border-primary/20 focus:ring-4 focus:ring-primary/10 text-slate-700"
                                                                )}
                                                            >
                                                                <option value="" className="text-slate-400">
                                                                    {isLoadingLots ? "Consultando disponibilidad..." : "Vincular con un lote físico..."}
                                                                </option>
                                                                {lots && lots.length > 0 && lots.map(l => (
                                                                    <option key={l.id} value={l.id} className="text-slate-800 font-bold">
                                                                        {l.lotCode} | Stock: {l.availableEquivalentGrams ?? l.totalOutputEquivalentGrams}g
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
                                                                {isLoadingLots && <Loader2 size={16} className="animate-spin text-primary" />}
                                                                {!isLoadingLots && <ChevronDown size={18} className="text-slate-400" />}
                                                            </div>
                                                            {(!lots || (lots && lots.length === 0)) && !isLoadingLots && (
                                                                <div className="absolute left-0 -bottom-8 w-full">
                                                                    <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest px-2 flex items-center gap-1.5 animate-pulse">
                                                                        <AlertCircle size={12} />
                                                                        No hay lotes disponibles para esta cepa. (Es obligatorio)
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION: FORMATO Y MÉTRICAS */}
                                <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm space-y-8 pb-8">
                                    <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                            <Beaker size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Formato y Pesaje</h3>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Configuración física del producto</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {PRESENTATION_OPTIONS.map((opt) => (
                                            <label
                                                key={opt.value}
                                                className={cn(
                                                    "cursor-pointer flex flex-col items-center justify-center p-5 border-2 rounded-3xl transition-all relative group",
                                                    presentationType === opt.value
                                                        ? "bg-primary/5 border-primary shadow-lg shadow-primary/5"
                                                        : "bg-slate-50/50 border-transparent hover:bg-slate-50"
                                                )}
                                            >
                                                <input
                                                    type="radio"
                                                    name="presentationType"
                                                    value={opt.value}
                                                    checked={presentationType === opt.value}
                                                    onChange={(e) => setPresentationType(e.target.value as ProductPresentationType)}
                                                    className="sr-only"
                                                />
                                                <opt.icon size={22} className={cn("mb-2 transition-transform group-hover:scale-110", presentationType === opt.value ? "text-primary" : "text-slate-300")} />
                                                <span className={cn("text-[10px] font-black uppercase tracking-widest", presentationType === opt.value ? "text-primary" : "text-slate-400")}>
                                                    {opt.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contenido</label>
                                            <div className="flex bg-slate-50 rounded-2xl border-2 border-transparent focus-within:bg-white focus-within:border-primary/20 focus-within:ring-4 focus-within:ring-primary/5 transition-all overflow-hidden h-[54px]">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                    value={netPhysicalQuantity}
                                                    onChange={(e) => setNetPhysicalQuantity(Number(e.target.value))}
                                                    className="w-full px-4 bg-transparent text-sm font-bold outline-none font-mono text-slate-700"
                                                    placeholder="0"
                                                />
                                                <div className="relative border-l border-slate-200/50 min-w-[65px]">
                                                    <select
                                                        value={physicalUnitType}
                                                        onChange={(e) => setPhysicalUnitType(e.target.value as ProductPhysicalUnit)}
                                                        className="w-full h-full pl-3 pr-7 bg-transparent text-[9px] font-black uppercase outline-none appearance-none cursor-pointer text-primary"
                                                    >
                                                        {UNIT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label.split(' ')[0]}</option>)}
                                                    </select>
                                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-primary/40">
                                                        <ChevronDown size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Eq. Gramos Secos</label>
                                            <div className="bg-slate-50 rounded-2xl border-2 border-transparent focus-within:bg-white focus-within:border-primary/20 focus-within:ring-4 focus-within:ring-primary/5 transition-all h-[54px] flex items-center pr-4">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                    value={equivalentDryGrams}
                                                    onChange={(e) => setEquivalentDryGrams(Number(e.target.value))}
                                                    className="w-full px-4 bg-transparent text-sm font-bold outline-none font-mono text-slate-700"
                                                    placeholder="0"
                                                />
                                                <span className="text-[10px] font-black text-slate-300 uppercase">GR</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Stock Inicial</label>
                                            <div className="bg-slate-50 rounded-2xl border-2 border-transparent focus-within:bg-white focus-within:border-primary/20 focus-within:ring-4 focus-within:ring-primary/5 transition-all h-[54px] flex items-center pr-4">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    required
                                                    value={currentStock}
                                                    onChange={(e) => setCurrentStock(Number(e.target.value))}
                                                    className="w-full px-4 bg-transparent text-sm font-bold outline-none font-mono text-slate-700"
                                                    placeholder="0"
                                                />
                                                <Hash size={16} className="text-slate-200" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION: RECUPERACIÓN / PRECIO */}
                                <div className="bg-emerald-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-200/50 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-700" />
                                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-1 block">Recuperación Sugerida</span>
                                            <h4 className="text-xl font-black text-white">Monto Total por Unidad</h4>
                                        </div>
                                        <div className="relative flex-1 max-w-[240px]">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-400/50 text-2xl font-black">$</span>
                                            <input
                                                type="number"
                                                min="0"
                                                required
                                                value={price}
                                                onChange={(e) => setPrice(Number(e.target.value))}
                                                className="w-full h-16 pl-12 pr-6 bg-white/10 border-2 border-white/10 focus:bg-white focus:text-slate-900 rounded-3xl outline-none transition-all text-3xl font-black font-mono placeholder:text-white/20"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 sm:p-8 border-t border-border/50 bg-muted/10 shrink-0 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-6 py-3 rounded-xl font-bold text-sm hover:bg-muted transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                form="create-product-form"
                                disabled={createProductMutation.isPending || updateProductMutation.isPending}
                                className="px-6 py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground flex items-center gap-2 hover:bg-primary/95 transition-all shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-0.5"
                            >
                                {createProductMutation.isPending || updateProductMutation.isPending ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    isEditing ? "Guardar Cambios" : "Crear Producto"
                                )}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

