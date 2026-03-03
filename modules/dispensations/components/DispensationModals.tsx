"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, BadgeDollarSign, User, PenTool, Loader2, CreditCard, Banknote } from "lucide-react";
import { Patient } from "@/lib/services/patient";
import { CartItem } from "./DispensationCart";
import { PaymentMethod } from "@/lib/services/dispensation";

interface DispensationModalsProps {
    isConfirmModalOpen: boolean;
    setIsConfirmModalOpen: (open: boolean) => void;
    isSuccessModalOpen: boolean;
    setIsSuccessModalOpen: (open: boolean) => void;
    onFinalize: () => void;
    isPending: boolean;
    selectedPatient: Patient | null;
    total: number;
    paymentMethod: PaymentMethod;
    cartItems: CartItem[];
}

export function DispensationModals({
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    onFinalize,
    isPending,
    selectedPatient,
    total,
    paymentMethod,
    cartItems
}: DispensationModalsProps) {
    return (
        <AnimatePresence>
            {isConfirmModalOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => !isPending && setIsConfirmModalOpen(false)}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-2xl bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl z-[70] overflow-hidden max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 md:p-12">
                            <button
                                onClick={() => setIsConfirmModalOpen(false)}
                                className="absolute top-6 right-6 md:top-8 md:right-8 p-2 text-slate-300 hover:text-slate-900 transition-colors"
                            >
                                <X className="w-5 h-5 md:w-6 md:h-6" />
                            </button>

                            <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-10">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                                    <PenTool className="w-6 h-6 md:w-8 md:h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">Resumen</h3>
                                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[9px] md:text-xs">Confirma los detalles.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                                <div className="p-4 md:p-6 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100">
                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 md:mb-2 block">Socio</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-lg flex items-center justify-center text-slate-400">
                                            <User className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        </div>
                                        <p className="font-black text-slate-800 text-xs md:text-sm truncate">{selectedPatient?.fullName}</p>
                                    </div>
                                </div>
                                <div className="p-4 md:p-6 bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] text-white">
                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40 mb-1 md:mb-2 block">Monto Total</span>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-black text-xl md:text-2xl">${total.toLocaleString()}</p>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full shrink-0">
                                            {paymentMethod === 'CASH' ? <Banknote size={12} className="text-emerald-400" /> : <CreditCard size={12} className="text-blue-400" />}
                                            <span className="text-[8px] md:text-[9px] font-black uppercase">{paymentMethod === 'CASH' ? 'Ef.' : 'Tarj.'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                                <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400 px-2">Detalle de Productos</h4>
                                <div className="max-h-[150px] md:max-h-[200px] overflow-y-auto custom-scrollbar px-2 space-y-2">
                                    {cartItems.map(item => (
                                        <div key={item.product.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                                            <div className="flex flex-col">
                                                <p className="text-[11px] md:text-xs font-black text-slate-800 uppercase tracking-tight">{item.product.name} x{item.quantity}</p>
                                                <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase">Lote: {item.lotCode}</p>
                                            </div>
                                            <p className="text-[11px] md:text-xs font-black text-slate-900">${(item.product.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={onFinalize}
                                disabled={isPending}
                                className="w-full h-16 md:h-20 bg-primary text-white rounded-[1.5rem] md:rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center justify-center gap-2 md:gap-3 transition-all transform active:scale-95 shadow-2xl shadow-primary/30"
                            >
                                {isPending ? <Loader2 className="animate-spin w-5 h-5 md:w-6 md:h-6" /> : "Finalizar Dispensación"}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}

            {isSuccessModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-primary/95 backdrop-blur-xl z-[80] flex items-center justify-center p-6"
                >
                    <div className="max-w-md w-full text-center space-y-8">
                        <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl"
                        >
                            <CheckCircle2 size={64} className="text-primary" />
                        </motion.div>

                        <div className="space-y-2">
                            <h1 className="text-4xl font-black text-white uppercase tracking-tighter shrink-0">¡Completado!</h1>
                            <p className="text-white/60 font-bold uppercase tracking-widest text-xs">La operación ha sido registrada exitosamente.</p>
                        </div>

                        <button
                            onClick={() => setIsSuccessModalOpen(false)}
                            className="w-full h-16 bg-white text-primary rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all"
                        >
                            Nueva Dispensación
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
