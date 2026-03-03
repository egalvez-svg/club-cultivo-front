import { API_URL } from "./auth";
import { Strain } from "./strain";
import { translateEnum } from "../utils/mappers";

export type ProductPresentationType = "FLOWER" | "OIL" | "EXTRACT" | "OTHER";
export type ProductPhysicalUnit = "GRAMS" | "ML" | "UNIT";

export interface Product {
    id: string;
    name: string;
    strainId: string;
    strain?: Strain;
    presentationType: ProductPresentationType;
    translatedPresentationType?: string;
    physicalUnitType: ProductPhysicalUnit;
    translatedPhysicalUnitType?: string;
    netPhysicalQuantity: number;
    equivalentDryGrams: number;
    price: number;
    currentStock: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    lots?: { id: string; lotCode: string }[];
    productionLotId?: string;
}

export interface CreateProductDto {
    strainId: string;
    name: string;
    presentationType: ProductPresentationType;
    physicalUnitType: ProductPhysicalUnit;
    netPhysicalQuantity: number;
    equivalentDryGrams: number;
    price: number;
    currentStock: number;
    productionLotId: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
    active?: boolean;
}

const formatProduct = (p: any): Product => ({
    ...p,
    translatedPresentationType: translateEnum(p.presentationType),
    translatedPhysicalUnitType: translateEnum(p.physicalUnitType)
});

export const productService = {
    async getProducts(token: string): Promise<Product[]> {
        const response = await fetch(`${API_URL}/products`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al obtener productos");
        }
        const rawData = await response.json();
        return rawData.map(formatProduct);
    },

    async getProductById(id: string, token: string): Promise<Product> {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al obtener producto");
        }
        const rawData = await response.json();
        return formatProduct(rawData);
    },

    async createProduct(data: CreateProductDto, token: string): Promise<Product> {
        const response = await fetch(`${API_URL}/products`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const resData = await response.json();
        if (!response.ok) {
            throw new Error(resData.message || "Error al crear producto");
        }
        return formatProduct(resData);
    },

    async updateProduct(id: string, data: UpdateProductDto, token: string): Promise<Product> {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const resData = await response.json();
        if (!response.ok) {
            throw new Error(resData.message || "Error al actualizar producto");
        }
        return formatProduct(resData);
    },

    async deleteProduct(id: string, token: string): Promise<void> {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al eliminar producto");
        }
    },
};
