"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Box, Edit2, Trash2, ArrowRight, CheckCircle2, Plus, Loader2, AlertTriangle, Leaf, Scale, DollarSign, ChevronDown } from "lucide-react";
import { Lot } from "@/lib/services/lot";
import { Strain } from "@/lib/services/strain";

interface LotModalsProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (open: boolean) => void;
    isEditModalOpen: boolean;
    setIsEditModalOpen: (open: boolean) => void;
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: (open: boolean) => void;
    selectedLot: Lot | null;
    strains: Strain[] | undefined;
    strainId: string;
    setStrainId: (id: string) => void;
    lotType: string;
    setLotType: (type: "CULTIVATION" | "PACKAGING") => void;
    lotCode: string;
    setLotCode: (code: string) => void;
    totalGrams: string;
    setTotalGrams: (grams: string) => void;
    totalCost: string;
    setTotalCost: (cost: string) => void;
    onCreateLot: (e: React.FormEvent) => void;
    onUpdateLot: (e: React.FormEvent) => void;
    onConfirmDelete: () => void;
    onStatusChange: (lotId: string, status: string) => void;
    isPending: boolean;
    activeMenuId: string | null;
    setActiveMenuId: (id: string | null) => void;
    menuPosition: { top: number; left: number };
    onEditClick: () => void;
    onDeleteClick: () => void;
    KANBAN_COLUMNS: any[];
}

export function LotModals({
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedLot,
    strains,
    strainId,
    setStrainId,
    lotType,
    setLotType,
    lotCode,
    setLotCode,
    totalGrams,
    setTotalGrams,
    totalCost,
    setTotalCost,
    onCreateLot,
    onUpdateLot,
    onConfirmDelete,
    onStatusChange,
    isPending,
    activeMenuId,
    setActiveMenuId,
    menuPosition,
    onEditClick,
    onDeleteClick,
    KANBAN_COLUMNS
}: LotModalsProps) {
    return (
        <>
            {/* Context Menu overlay */}
            <AnimatePresence>
                {activeMenuId && selectedLot && (
                    <>
                        <div
                            className="fixed inset-0 z-[60]"
                            onClick={() => setActiveMenuId(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            style={{
                                position: "fixed",
                                top: menuPosition.top,
                                left: menuPosition.left,
                                width: "180px",
                            }}
                            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 z-[70] overflow-hidden"
                        >
                            <div className="px-4 py-2 bg-muted/30 border-b border-muted/30">
                                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Estado</span>
                            </div>
                            {KANBAN_COLUMNS.map(col => (
                                col.id !== selectedLot.status && (
                                    <button
                                        key={col.id}
                                        onClick={() => onStatusChange(selectedLot.id, col.id)}
                                        className="w-full px-4 py-2.5 text-left text-xs font-bold flex items-center justify-between hover:bg-muted/50 transition-colors"
                                    >
                                        Mover a {col.title} <ArrowRight size={12} className="text-muted-foreground" />
                                    </button>
                                )
                            ))}

                            <div className="border-t border-muted/50 mt-1" />

                            <button
                                onClick={onEditClick}
                                className="w-full px-4 py-3 text-left text-sm font-bold flex items-center gap-3 hover:bg-primary/5 transition-colors border-b border-muted/20"
                            >
                                <Edit2 size={14} className="text-primary" /> Editar
                            </button>

                            <button
                                onClick={onDeleteClick}
                                className="w-full px-4 py-3 text-left text-sm font-bold flex items-center gap-3 hover:bg-red-50 text-red-600 transition-colors"
                            >
                                <Trash2 size={14} /> Eliminar
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {(isCreateModalOpen || isEditModalOpen) && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setIsCreateModalOpen(false);
                                setIsEditModalOpen(false);
                            }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-muted/30 flex justify-between items-center bg-muted/10 shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                        <Box size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-foreground">
                                            {isEditModalOpen ? "Editar Lote" : "Nuevo Lote"}
                                        </h2>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {isEditModalOpen ? "Actualizar datos de producción." : "Ingreso de nuevo ciclo."}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsCreateModalOpen(false);
                                        setIsEditModalOpen(false);
                                    }}
                                    className="p-2 bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto custom-scrollbar">
                                <form onSubmit={isEditModalOpen ? onUpdateLot : onCreateLot} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Cepa Genética</label>
                                        <div className="relative group/input">
                                            <Leaf className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                            <select
                                                required
                                                value={strainId}
                                                onChange={(e) => setStrainId(e.target.value)}
                                                disabled={isEditModalOpen}
                                                className="w-full pl-12 pr-10 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-[15px] cursor-pointer appearance-none disabled:opacity-50 text-slate-700"
                                            >
                                                <option value="">Seleccionar Cepa...</option>
                                                {strains?.filter(s => s.active).map(s => (
                                                    <option key={s.id} value={s.id}>{s.name} ({s.type || "N/A"})</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <ChevronDown size={18} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 items-end">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Tipo de Lote</label>
                                            <div className="relative group/input">
                                                <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                                <select
                                                    required
                                                    value={lotType}
                                                    onChange={(e) => setLotType(e.target.value as any)}
                                                    className="w-full pl-12 pr-10 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-[15px] cursor-pointer appearance-none text-slate-700"
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    <option value="CULTIVATION">Cultivo</option>
                                                    <option value="PACKAGING">Empaque</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    <ChevronDown size={18} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Nº Lote <span className="opacity-50">(Opcional)</span></label>
                                            <div className="relative group/input">
                                                <Edit2 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    value={lotCode}
                                                    onChange={(e) => setLotCode(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-[15px] text-slate-700"
                                                    placeholder="Ej: LOT-2024-001"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 items-end">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Producción (g) <span className="opacity-50">(Opc)</span></label>
                                            <div className="relative group/input">
                                                <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={totalGrams}
                                                    onChange={(e) => setTotalGrams(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-[15px] text-slate-700"
                                                    placeholder="Ej: 1250.5"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Costo ($) <span className="opacity-50">(Opc)</span></label>
                                            <div className="relative group/input">
                                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={totalCost}
                                                    onChange={(e) => setTotalCost(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-[15px] text-slate-700"
                                                    placeholder="Ej: 85000"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsCreateModalOpen(false);
                                                setIsEditModalOpen(false);
                                            }}
                                            className="flex-1 py-4.5 rounded-2xl font-black text-sm uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isPending}
                                            className="flex-[2] py-4.5 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70"
                                        >
                                            {isPending ? (
                                                <Loader2 size={20} className="animate-spin" />
                                            ) : (
                                                <>
                                                    {isEditModalOpen ? <CheckCircle2 size={20} /> : <Plus size={20} />}
                                                    {isEditModalOpen ? "Guardar" : "Crear"}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && selectedLot && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md glass bg-white rounded-[2rem] shadow-2xl border border-white/50 p-8 text-center"
                        >
                            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-6">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-black mb-2">¿Eliminar Lote?</h3>
                            <p className="text-muted-foreground text-sm font-medium mb-8">
                                Estás a punto de eliminar el lote <span className="text-foreground font-bold">{selectedLot.lotCode}</span> de forma permanente.
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={onConfirmDelete}
                                    disabled={isPending}
                                    className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-500/20 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {isPending ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        "Eliminar"
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

