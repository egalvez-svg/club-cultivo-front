"use client";


import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { sileo } from "sileo";

// Hooks
import { useProducts } from "@/lib/hooks/useProducts";
import { usePatientsList } from "@/lib/hooks/usePatients";
import { useCreateDispensation } from "@/lib/hooks/useDispensations";
import { useActiveRegister } from "@/lib/hooks/useCashRegister";

// Types
import { Product, ProductPresentationType } from "@/lib/services/product";
import { Patient } from "@/lib/services/patient";
import { PaymentMethod } from "@/lib/services/dispensation";

// Components
import { DispensationHeader } from "@/modules/dispensations/components/DispensationHeader";
import { ProductSelection } from "@/modules/dispensations/components/ProductSelection";
import { DispensationCart, CartItem } from "@/modules/dispensations/components/DispensationCart";
import { DispensationModals } from "@/modules/dispensations/components/DispensationModals";

export default function DispensationsPage() {
    const { data: products, isLoading: isProductsLoading } = useProducts();
    const { data: patients, isLoading: isPatientsLoading } = usePatientsList();
    const { data: activeRegister } = useActiveRegister();
    const createDispensationMutation = useCreateDispensation();

    // State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<ProductPresentationType | "ALL">("ALL");
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
    const [discount, setDiscount] = useState(0);

    // Modals
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    // Totals
    const subtotal = useMemo(() =>
        cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0),
        [cartItems]);
    const totalGrams = useMemo(() =>
        cartItems.reduce((acc, item) => acc + (item.product.equivalentDryGrams * item.quantity), 0),
        [cartItems]);
    const total = Math.max(0, subtotal - discount);

    // Handlers
    const handleAddToCart = (product: Product) => {
        if (!selectedPatient) {
            sileo.warning({ title: "Sin Paciente", description: "Debes seleccionar un paciente antes de agregar productos." });
            return;
        }

        if (selectedPatient.membershipStatus !== "APPROVED") {
            sileo.error({
                title: "No Autorizado",
                description: "El paciente no es un socio aprobado por la ONG."
            });
            return;
        }

        if (product.currentStock <= 0) {
            sileo.error({ title: "Sin Stock", description: "Este producto no tiene unidades disponibles." });
            return;
        }

        const firstLot = product.lots?.[0];
        if (!firstLot) {
            sileo.warning({ title: "Sin Lote", description: "Este producto no tiene lotes de producción asignados." });
            return;
        }

        // Validaciones previas al estado
        const existing = cartItems.find(item => item.product.id === product.id);
        
        if (totalGrams + product.equivalentDryGrams > 40) {
            sileo.error({
                title: "Límite de Dispensación",
                description: "No se pueden superar los 40g por operación."
            });
            return;
        }

        if (existing && existing.quantity >= product.currentStock) {
            sileo.error({ title: "Límite excedido", description: "No puedes agregar más del stock disponible." });
            return;
        }

        setCartItems(prev => {
            const isAlreadyInCart = prev.some(item => item.product.id === product.id);

            if (isAlreadyInCart) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prev, {
                product,
                quantity: 1,
                lotId: firstLot.id,
                lotCode: firstLot.lotCode
            }];
        });
    };

    const handleUpdateQuantity = (productId: string, delta: number) => {
        const item = cartItems.find(i => i.product.id === productId);
        if (!item) return;

        const newQty = item.quantity + delta;

        // Validaciones
        if (delta > 0) {
            if (totalGrams + item.product.equivalentDryGrams > 40) {
                sileo.error({
                    title: "Límite de Dispensación",
                    description: "No se pueden superar los 40g por operación."
                });
                return;
            }

            if (newQty > item.product.currentStock) {
                sileo.error({ title: "Límite excedido", description: "No puedes superar el stock actual." });
                return;
            }
        }

        if (newQty < 1) return;

        setCartItems(prev => prev.map(i =>
            i.product.id === productId
                ? { ...i, quantity: newQty }
                : i
        ));
    };

    const handleRemoveFromCart = (productId: string) => {
        setCartItems(prev => prev.filter(item => item.product.id !== productId));
    };

    const handleOpenConfirm = () => {
        if (!activeRegister) {
            sileo.error({ title: "Caja Cerrada", description: "Debes abrir la caja antes de dispensar." });
            return;
        }
        if (!selectedPatient || selectedPatient.membershipStatus !== "APPROVED") {
            sileo.error({
                title: "No Autorizado",
                description: "El paciente no es un socio aprobado por la ONG."
            });
            return;
        }
        setIsConfirmModalOpen(true);
    };

    const handleFinalize = async () => {
        if (!selectedPatient) return;

        try {
            await sileo.promise(
                createDispensationMutation.mutateAsync({
                    recipientId: selectedPatient.id,
                    paymentMethod,
                    discount,
                    items: cartItems.map(item => ({
                        productId: item.product.id,
                        productionLotId: item.lotId,
                        quantityUnits: item.quantity,
                        equivalentDryGrams: item.product.equivalentDryGrams * item.quantity,
                        costPerEquivalentGram: item.product.price / item.product.equivalentDryGrams,
                        totalRecoveryAmount: item.product.price * item.quantity
                    }))
                }),
                {
                    loading: { title: "Procesando...", description: "Registrando dispensación" },
                    success: { title: "¡Éxito!", description: "Dispensación realizada correctamente" },
                    error: { title: "Error", description: "No se pudo realizar la operación" }
                }
            );

            setIsConfirmModalOpen(false);
            setCartItems([]);
            setSelectedPatient(null);
            setDiscount(0);
            setIsSuccessModalOpen(true);
        } catch (error) {
            console.error(error);
        }
    };

    if (isPatientsLoading || isProductsLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-4 text-muted-foreground">
                <Loader2 className="animate-spin text-primary" size={40} />
                <span className="font-bold uppercase tracking-widest text-xs">Cargando dispensador...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 md:gap-10 p-2 md:p-4">
            <DispensationHeader
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                patients={patients}
                selectedPatient={selectedPatient}
                onSelectPatient={setSelectedPatient}
            />

            <div className="grid grid-cols-12 gap-6 lg:gap-10">
                <ProductSelection
                    products={products}
                    isLoading={isProductsLoading}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    onAddToCart={handleAddToCart}
                />

                <DispensationCart
                    cartItems={cartItems}
                    onRemoveFromCart={handleRemoveFromCart}
                    onUpdateQuantity={handleUpdateQuantity}
                    subtotal={subtotal}
                    totalGrams={totalGrams}
                    discount={discount}
                    setDiscount={setDiscount}
                    total={total}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    onConfirmDispensation={handleOpenConfirm}
                    selectedPatient={selectedPatient}
                    isPending={createDispensationMutation.isPending}
                />
            </div>

            <DispensationModals
                isConfirmModalOpen={isConfirmModalOpen}
                setIsConfirmModalOpen={setIsConfirmModalOpen}
                isSuccessModalOpen={isSuccessModalOpen}
                setIsSuccessModalOpen={setIsSuccessModalOpen}
                onFinalize={handleFinalize}
                isPending={createDispensationMutation.isPending}
                selectedPatient={selectedPatient}
                total={total}
                paymentMethod={paymentMethod}
                cartItems={cartItems}
            />
        </div>
    );
}
