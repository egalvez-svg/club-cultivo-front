import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService, CreateProductDto, UpdateProductDto } from "../services/product";
import { useAuth } from "@/context/auth-context";

export function useProducts() {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["products"],
        queryFn: () => productService.getProducts(token || ""),
        enabled: !!token,
    });
}

export function useProduct(id: string) {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["products", id],
        queryFn: () => productService.getProductById(id, token || ""),
        enabled: !!id && !!token,
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: (data: CreateProductDto) => productService.createProduct(data, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product-catalog"] });
            queryClient.invalidateQueries({ queryKey: ["lots-list"] });
            queryClient.invalidateQueries({ queryKey: ["lots-by-strain"] });
        },
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
            productService.updateProduct(id, data, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product-catalog"] });
            queryClient.invalidateQueries({ queryKey: ["lots-list"] });
            queryClient.invalidateQueries({ queryKey: ["lots-by-strain"] });
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: (id: string) => productService.deleteProduct(id, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product-catalog"] });
            queryClient.invalidateQueries({ queryKey: ["lots-list"] });
            queryClient.invalidateQueries({ queryKey: ["lots-by-strain"] });
        },
    });
}

export function useCatalog() {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["product-catalog"],
        queryFn: () => productService.getCatalog(token || ""),
        enabled: !!token,
    });
}
