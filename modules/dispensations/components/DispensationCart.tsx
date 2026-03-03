"use client";

import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, CreditCard, Banknote } from "lucide-react";
import { Product } from "@/lib/services/product";
import { Patient } from "@/lib/services/patient";
import { PaymentMethod } from "@/lib/services/dispensation";
import { cn } from "@/lib/utils";

export interface CartItem {
    product: Product;
    quantity: number;
    lotId: string;
    lotCode: string;
}

interface DispensationCartProps {
    cartItems: CartItem[];
    onRemoveFromCart: (productId: string) => void;
    onUpdateQuantity: (productId: string, delta: number) => void;
    subtotal: number;
    discount: number;
    setDiscount: (val: number) => void;
    total: number;
    paymentMethod: PaymentMethod;
    setPaymentMethod: (method: PaymentMethod) => void;
    onConfirmDispensation: () => void;
    selectedPatient: Patient | null;
    isPending: boolean;
}

export function DispensationCart({
    cartItems,
    onRemoveFromCart,
    onUpdateQuantity,
    subtotal,
    discount,
    setDiscount,
    total,
    paymentMethod,
    setPaymentMethod,
    onConfirmDispensation,
    selectedPatient,
    isPending
}: DispensationCartProps) {
    const isCartEmpty = cartItems.length === 0;

    return (
        <div className="col-span-12 lg:col-span-4 h-fit sticky top-8 flex flex-col gap-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="text-[12px] font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                        <ShoppingBag size={16} className="text-primary" />
                        Productos Seleccionados
                    </h2>
                    {cartItems.length > 0 && (
                        <span className="px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-wider border border-primary/10">
                            {cartItems.length} ítems
                        </span>
                    )}
                </div>

                <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-5 space-y-3">
                    {isCartEmpty ? (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-300 opacity-40">
                            <ShoppingBag size={40} strokeWidth={1.5} className="mb-3" />
                            <p className="text-xs font-black uppercase tracking-widest">Carrito Vacío</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.product.id} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 text-[14px] truncate uppercase tracking-tight">{item.product.name}</h4>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Lote: {item.lotCode}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200">
                                        <button
                                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-50 transition-colors text-slate-400"
                                        >
                                            <Minus size={12} />
                                        </button>
                                        <span className="w-5 text-center font-black text-sm text-slate-800">{item.quantity}</span>
                                        <button
                                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-50 transition-colors text-slate-400"
                                        >
                                            <Plus size={12} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => onRemoveFromCart(item.product.id)}
                                        className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-100 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-[16px] font-black text-slate-800 uppercase tracking-tight">Resumen de Pago</h2>
                </div>

                <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                        <span>Subtotal</span>
                        <span className="text-slate-800 font-black text-[14px]">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                        <span>Bonificación</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="0"
                                value={discount || ""}
                                onChange={(e) => setDiscount(Number(e.target.value))}
                                className="w-16 h-7 px-2 bg-slate-50 border border-slate-100 rounded-lg text-right text-emerald-600 font-black focus:outline-none focus:border-emerald-500/30 text-[11px]"
                            />
                            <span className="text-emerald-500 font-black text-[12px]">-${discount.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="h-px bg-slate-50 my-2" />

                    <div className="flex justify-between items-center">
                        <span className="text-sm font-black text-slate-800 uppercase tracking-widest">Total</span>
                        <span className="text-3xl font-black text-emerald-700 tracking-tight">${total.toLocaleString()}</span>
                    </div>
                </div>

                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Método de Pago</p>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { id: 'CREDIT_CARD', label: 'Tarjeta', icon: CreditCard },
                            { id: 'CASH', label: 'Efectivo', icon: Banknote }
                        ].map((method) => (
                            <button
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-2 h-20 rounded-2xl border-2 transition-all group",
                                    paymentMethod === method.id
                                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-lg shadow-emerald-500/10"
                                        : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                                )}
                            >
                                <method.icon size={22} className={cn("transition-transform group-hover:scale-110", paymentMethod === method.id ? "text-emerald-600" : "text-slate-300")} />
                                <span className="text-[10px] font-black uppercase tracking-[0.15em]">{method.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={onConfirmDispensation}
                    disabled={isPending || isCartEmpty || !selectedPatient || total <= 0}
                    className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl shadow-slate-200 disabled:opacity-50"
                >
                    Confirmar Operación
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}
