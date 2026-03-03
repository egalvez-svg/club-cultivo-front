"use client";

import { useState } from "react";
import { useProducts, useDeleteProduct } from "@/lib/hooks/useProducts";
import { Product } from "@/lib/services/product";
import { CreateProductModal } from "@/modules/products/components/create-product-modal";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { sileo } from "sileo";

// Components
import { ProductHeader } from "@/modules/products/components/ProductHeader";
import { ProductGrid } from "@/modules/products/components/ProductGrid";

export default function ProductsPage() {
    const { data: products, isLoading: isProductsLoading } = useProducts();
    const deleteProductMutation = useDeleteProduct();

    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const filteredProducts = products?.filter((p: Product) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.strain?.name?.toLowerCase().includes(q);
    });

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsCreateModalOpen(true);
    };

    const handleCreateProduct = () => {
        setSelectedProduct(null);
        setIsCreateModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsCreateModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
    };

    const confirmDelete = () => {
        if (!selectedProduct) return;
        deleteProductMutation.mutate(selectedProduct.id, {
            onSuccess: () => {
                sileo.success({ title: "Eliminado", description: "El producto fue removido correctamente." });
                handleCloseModal();
            },
            onError: (err) => {
                sileo.error({ title: "Error", description: err.message || "No se pudo eliminar." });
            }
        });
    };

    return (
        <div className="space-y-8 h-[calc(100vh-8rem)] flex flex-col">
            <ProductHeader
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onCreateProduct={handleCreateProduct}
            />

            <ProductGrid
                products={filteredProducts}
                isLoading={isProductsLoading}
                searchQuery={searchQuery}
                onEditProduct={handleEditProduct}
                onDeleteProduct={(p) => {
                    setSelectedProduct(p);
                    setIsDeleteModalOpen(true);
                }}
            />

            <CreateProductModal
                isOpen={isCreateModalOpen}
                product={selectedProduct}
                onClose={handleCloseModal}
            />

            <AnimatePresence>
                {isDeleteModalOpen && selectedProduct && (
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
                            className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden text-center"
                        >
                            <div className="p-8 pb-6">
                                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-6">
                                    <AlertTriangle size={32} />
                                </div>
                                <h3 className="text-xl font-black mb-2 text-slate-800">¿Eliminar Producto?</h3>
                                <p className="text-muted-foreground text-sm font-medium">
                                    Estás a punto de eliminar <span className="text-slate-900 font-bold">{selectedProduct.name}</span>. El lote recuperará este stock.
                                </p>
                            </div>
                            <div className="p-6 pt-0 flex gap-3">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={deleteProductMutation.isPending}
                                    className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 shadow-xl shadow-red-500/20 hover:shadow-2xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {deleteProductMutation.isPending ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        "Eliminar"
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
