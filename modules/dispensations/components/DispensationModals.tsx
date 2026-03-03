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
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl z-[70] overflow-hidden"
                    >
                        <div className="p-8 md:p-12">
                            <button
                                onClick={() => setIsConfirmModalOpen(false)}
                                className="absolute top-8 right-8 p-2 text-slate-300 hover:text-slate-900 transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="flex items-center gap-6 mb-10">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                    <PenTool size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Resumen de Operación</h3>
                                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Confirma los detalles antes de finalizar.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Socio Recibidor</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400">
                                            <User size={16} />
                                        </div>
                                        <p className="font-black text-slate-800 text-sm">{selectedPatient?.fullName}</p>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 block">Monto a Recuperar</span>
                                    <div className="flex items-center justify-between">
                                        <p className="font-black text-2xl">${total.toLocaleString()}</p>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                                            {paymentMethod === 'CASH' ? <Banknote size={14} className="text-emerald-400" /> : <CreditCard size={14} className="text-blue-400" />}
                                            <span className="text-[9px] font-black uppercase">{paymentMethod === 'CASH' ? 'Efectivo' : 'Tarjeta'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">Detalle de Productos</h4>
                                <div className="max-h-[200px] overflow-y-auto custom-scrollbar px-2 space-y-2">
                                    {cartItems.map(item => (
                                        <div key={item.product.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                                            <div className="flex flex-col">
                                                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{item.product.name} x{item.quantity}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">Lote: {item.lotCode}</p>
                                            </div>
                                            <p className="text-xs font-black text-slate-900">${(item.product.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={onFinalize}
                                disabled={isPending}
                                className="w-full h-20 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-2xl shadow-primary/30"
                            >
                                {isPending ? <Loader2 className="animate-spin" size={24} /> : "Finalizar Dispensación"}
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
