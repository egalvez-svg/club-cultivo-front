"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Unlock, BadgeDollarSign, Loader2, Plus, TrendingUp, TrendingDown, ArrowUpDown, Lock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MovementType } from "@/lib/services/cash-register";

interface FinanceModalsProps {
    // Visibility
    isOpeningModalOpen: boolean;
    setIsOpeningModalOpen: (open: boolean) => void;
    isMovementModalOpen: boolean;
    setIsMovementModalOpen: (open: boolean) => void;
    isCloseModalOpen: boolean;
    setIsCloseModalOpen: (open: boolean) => void;

    // Form States
    openingAmount: number;
    setOpeningAmount: (val: number) => void;
    movementAmount: number;
    setMovementAmount: (val: number) => void;
    movementDescription: string;
    setMovementDescription: (val: string) => void;
    movementType: MovementType;
    setMovementType: (val: MovementType) => void;
    closingAmount: number;
    setClosingAmount: (val: number) => void;

    // Actions
    onOpenRegister: (e: React.FormEvent) => void;
    onCreateMovement: (e: React.FormEvent) => void;
    onCloseRegister: (e: React.FormEvent) => void;

    // Status
    activeRegister: any;
    isPendingOpening: boolean;
    isPendingMovement: boolean;
    isPendingClosing: boolean;
}

export function FinanceModals({
    isOpeningModalOpen,
    setIsOpeningModalOpen,
    isMovementModalOpen,
    setIsMovementModalOpen,
    isCloseModalOpen,
    setIsCloseModalOpen,
    openingAmount,
    setOpeningAmount,
    movementAmount,
    setMovementAmount,
    movementDescription,
    setMovementDescription,
    movementType,
    setMovementType,
    closingAmount,
    setClosingAmount,
    onOpenRegister,
    onCreateMovement,
    onCloseRegister,
    activeRegister,
    isPendingOpening,
    isPendingMovement,
    isPendingClosing
}: FinanceModalsProps) {
    return (
        <AnimatePresence>
            {/* 1. Opening Modal */}
            {isOpeningModalOpen && (
                <ModalWrapper onClose={() => setIsOpeningModalOpen(false)}>
                    <form onSubmit={onOpenRegister} className="p-8 space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <Unlock size={28} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-foreground">Apertura de Caja</h3>
                                <p className="text-muted-foreground text-sm font-medium">Ingresa el saldo inicial para comenzar.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Monto Inicial (ARS)</label>
                            <div className="relative">
                                <BadgeDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                <input
                                    type="number"
                                    required
                                    autoFocus
                                    value={openingAmount || ""}
                                    onChange={(e) => setOpeningAmount(Number(e.target.value))}
                                    className="w-full h-16 pl-12 pr-4 bg-muted/50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all text-2xl font-black"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isPendingOpening}
                            className="w-full h-16 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl shadow-primary/20"
                        >
                            {isPendingOpening && <Loader2 className="animate-spin" size={20} />}
                            Confirmar Apertura
                        </button>
                    </form>
                </ModalWrapper>
            )}

            {/* 2. Movement Modal */}
            {isMovementModalOpen && (
                <ModalWrapper onClose={() => setIsMovementModalOpen(false)}>
                    <form onSubmit={onCreateMovement} className="p-8 space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <Plus size={28} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-foreground">Nuevo Movimiento</h3>
                                <p className="text-muted-foreground text-sm font-medium">Registra un ingreso o egreso extra.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-2">
                            <button
                                type="button"
                                onClick={() => setMovementType("INCOME")}
                                className={cn(
                                    "h-14 rounded-xl border-2 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                                    movementType === "INCOME" ? "bg-emerald-50 border-emerald-500 text-emerald-600" : "bg-slate-50 border-transparent text-slate-400"
                                )}
                            >
                                <TrendingUp size={16} />
                                Ingreso
                            </button>
                            <button
                                type="button"
                                onClick={() => setMovementType("EXPENSE")}
                                className={cn(
                                    "h-14 rounded-xl border-2 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                                    movementType === "EXPENSE" ? "bg-rose-50 border-rose-500 text-rose-600" : "bg-slate-50 border-transparent text-slate-400"
                                )}
                            >
                                <TrendingDown size={16} />
                                Egreso
                            </button>
                            <button
                                type="button"
                                onClick={() => setMovementType("ADJUSTMENT")}
                                className={cn(
                                    "col-span-2 h-14 rounded-xl border-2 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                                    movementType === "ADJUSTMENT" ? "bg-amber-50 border-amber-500 text-amber-600" : "bg-slate-50 border-transparent text-slate-400"
                                )}
                            >
                                <ArrowUpDown size={16} />
                                Ajuste
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Monto</label>
                                <input
                                    type="number"
                                    required
                                    value={movementAmount || ""}
                                    onChange={(e) => setMovementAmount(Number(e.target.value))}
                                    className="w-full h-14 px-4 bg-muted/50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl outline-none transition-all text-xl font-black"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Descripción / Motivo</label>
                                <input
                                    type="text"
                                    required
                                    value={movementDescription}
                                    onChange={(e) => setMovementDescription(e.target.value)}
                                    className="w-full h-14 px-4 bg-muted/50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl outline-none transition-all text-sm font-bold"
                                    placeholder="Ej. Pago de luz, Limpieza, etc."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isPendingMovement}
                            className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl shadow-slate-200"
                        >
                            {isPendingMovement && <Loader2 className="animate-spin" size={20} />}
                            Registrar Movimiento
                        </button>
                    </form>
                </ModalWrapper>
            )}

            {/* 3. Closing Modal */}
            {isCloseModalOpen && (
                <ModalWrapper onClose={() => setIsCloseModalOpen(false)}>
                    <form onSubmit={onCloseRegister} className="p-8 space-y-6 text-center">
                        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto text-destructive mb-4">
                            <Lock size={36} />
                        </div>

                        <div>
                            <h3 className="text-2xl font-black text-foreground">Cerrar Turno</h3>
                            <p className="text-muted-foreground text-sm font-medium mt-1">
                                Balance del sistema: <span className="text-foreground font-black">${activeRegister?.currentBalance.toLocaleString()}</span>
                            </p>
                        </div>

                        <div className="space-y-2 text-left bg-slate-50 p-4 rounded-2xl">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Dinero físico en caja (Arqueo)</label>
                            <input
                                type="number"
                                required
                                autoFocus
                                value={closingAmount || ""}
                                onChange={(e) => setClosingAmount(Number(e.target.value))}
                                className="w-full h-16 px-4 bg-white border-2 border-slate-100 focus:border-primary/20 rounded-xl outline-none transition-all text-3xl font-black text-center"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3 text-left">
                            <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] font-bold text-amber-700 leading-relaxed uppercase tracking-wider">
                                Al cerrar la caja se grabará la diferencia si el arqueo no coincide con el balance del sistema.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button type="button" onClick={() => setIsCloseModalOpen(false)} className="flex-1 h-16 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors">
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isPendingClosing}
                                className="flex-[2] h-16 bg-destructive text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-destructive/20 hover:scale-[1.02] transition-all"
                            >
                                Confirmar Cierre
                            </button>
                        </div>
                    </form>
                </ModalWrapper>
            )}
        </AnimatePresence>
    );
}

function ModalWrapper({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[3rem] shadow-2xl z-[70] overflow-hidden"
            >
                <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-900 transition-colors">
                    <X size={20} />
                </button>
                {children}
            </motion.div>
        </>
    );
}
