"use client";

import { useState } from "react";
import { useProducts } from "@/lib/hooks/useProducts";
import { Product } from "@/lib/services/product";
import { CreateProductModal } from "@/modules/products/components/create-product-modal";

// Components
import { ProductHeader } from "@/modules/products/components/ProductHeader";
import { ProductGrid } from "@/modules/products/components/ProductGrid";

export default function ProductsPage() {
    const { data: products, isLoading: isProductsLoading } = useProducts();
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
        setSelectedProduct(null);
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
            />

            <CreateProductModal
                isOpen={isCreateModalOpen}
                product={selectedProduct}
                onClose={handleCloseModal}
            />
        </div>
    );
}
