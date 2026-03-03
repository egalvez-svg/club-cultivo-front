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
        <div className="col-span-12 lg:col-span-4 h-fit flex flex-col gap-4 md:gap-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 md:p-5 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="text-[11px] md:text-[12px] font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                        <ShoppingBag className="text-primary w-3.5 h-3.5 md:w-4 md:h-4" />
                        Productos
                    </h2>
                    {cartItems.length > 0 && (
                        <span className="px-2.5 py-0.5 bg-primary/5 text-primary rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider border border-primary/10">
                            {cartItems.length}
                        </span>
                    )}
                </div>

                <div className="max-h-[250px] md:max-h-[300px] overflow-y-auto custom-scrollbar p-4 md:p-5 space-y-3">
                    {isCartEmpty ? (
                        <div className="flex flex-col items-center justify-center py-8 md:py-10 text-slate-300 opacity-40">
                            <ShoppingBag strokeWidth={1.5} className="mb-2 md:mb-3 w-8 h-8 md:w-10 md:h-10" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Carrito Vacío</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.product.id} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 text-[13px] md:text-[14px] truncate uppercase tracking-tight">{item.product.name}</h4>
                                    <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Lote: {item.lotCode}</p>
                                </div>

                                <div className="flex items-center gap-2 md:gap-3">
                                    <div className="flex items-center gap-1.5 md:gap-2 bg-white p-1 rounded-xl border border-slate-200">
                                        <button
                                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                                            className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-lg hover:bg-slate-50 transition-colors text-slate-400"
                                        >
                                            <Minus size={12} className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                        </button>
                                        <span className="w-4 md:w-5 text-center font-black text-xs md:text-sm text-slate-800">{item.quantity}</span>
                                        <button
                                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                                            className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-lg hover:bg-slate-50 transition-colors text-slate-400"
                                        >
                                            <Plus size={12} className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => onRemoveFromCart(item.product.id)}
                                        className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 size={16} className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-5 md:p-7 shadow-sm border border-slate-100 space-y-5 md:space-y-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-[14px] md:text-[16px] font-black text-slate-800 uppercase tracking-tight">Resumen de Pago</h2>
                </div>

                <div className="space-y-3 md:space-y-4">
                    <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
                        <span>Subtotal</span>
                        <span className="text-slate-800 font-black text-[13px] md:text-[14px]">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
                        <span>Bonificación</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="0"
                                value={discount || ""}
                                onChange={(e) => setDiscount(Number(e.target.value))}
                                className="w-14 md:w-16 h-7 px-2 bg-slate-50 border border-slate-100 rounded-lg text-right text-emerald-600 font-black focus:outline-none focus:border-emerald-500/30 text-[10px] md:text-[11px]"
                            />
                            <span className="text-emerald-500 font-black text-[11px] md:text-[12px]">-${discount.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="h-px bg-slate-50 my-2 md:my-3" />

                    <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-widest">Total</span>
                        <span className="text-2xl md:text-3xl font-black text-emerald-700 tracking-tight">${total.toLocaleString()}</span>
                    </div>
                </div>

                <div>
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Método de Pago</p>
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                        {[
                            { id: 'CREDIT_CARD', label: 'Tarjeta', icon: CreditCard },
                            { id: 'CASH', label: 'Efectivo', icon: Banknote }
                        ].map((method) => (
                            <button
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1.5 md:gap-2 h-16 md:h-20 rounded-2xl border-2 transition-all group",
                                    paymentMethod === method.id
                                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md md:shadow-lg shadow-emerald-500/10"
                                        : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                                )}
                            >
                                <method.icon className={cn("transition-transform group-hover:scale-110 w-4 h-4 md:w-5 md:h-5", paymentMethod === method.id ? "text-emerald-600" : "text-slate-300")} />
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em]">{method.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={onConfirmDispensation}
                    disabled={isPending || isCartEmpty || !selectedPatient || total <= 0}
                    className="w-full h-14 md:h-16 bg-slate-900 text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 md:gap-3 transition-all transform active:scale-95 shadow-xl shadow-slate-200 disabled:opacity-50"
                >
                    Confirmar Operación
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
            </div>
        </div>
    );
}
