import { apiClient } from "./api-client";
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

export interface CatalogProduct {
    id: string;
    name: string;
    presentationType: ProductPresentationType;
    physicalUnitType: ProductPhysicalUnit;
    netPhysicalQuantity: number;
    equivalentDryGrams: number;
    price: number;
    stock: number;
    available: boolean;
}

export interface StrainGroup {
    strain: {
        id: string;
        name: string;
        type: string;
        genetics: string;
        thcPercentage: number;
        cbdPercentage: number;
    };
    products: CatalogProduct[];
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
        const rawData = await apiClient.get("/products", token);
        return rawData.map(formatProduct);
    },

    async getProductById(id: string, token: string): Promise<Product> {
        const rawData = await apiClient.get(`/products/${id}`, token);
        return formatProduct(rawData);
    },

    async createProduct(data: CreateProductDto, token: string): Promise<Product> {
        const resData = await apiClient.post("/products", data, token);
        return formatProduct(resData);
    },

    async updateProduct(id: string, data: UpdateProductDto, token: string): Promise<Product> {
        const resData = await apiClient.patch(`/products/${id}`, data, token);
        return formatProduct(resData);
    },

    async deleteProduct(id: string, token: string): Promise<void> {
        await apiClient.delete(`/products/${id}`, token);
    },

    async getCatalog(token: string): Promise<StrainGroup[]> {
        return apiClient.get("/products/catalog", token);
    },
};
