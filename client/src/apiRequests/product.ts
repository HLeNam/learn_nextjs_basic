import http from "@/lib/http";
import {
    CreateProductBodyType,
    ProductListResType,
    ProductResType,
    UpdateProductBodyType,
} from "@/schemaValidations/product.schema";

const productApiRequests = {
    getList: () => {
        return http.get<ProductListResType>("/products");
    },

    getDetail: (id: number) => {
        return http.get<ProductResType>(`/products/${id}`);
    },

    create: (body: CreateProductBodyType) => {
        return http.post<ProductResType>("/products", body);
    },

    update: (id: number, body: UpdateProductBodyType) => {
        return http.put<ProductResType>(`/products/${id}`, body);
    },

    uploadImage: (body: FormData) => {
        return http.post<{
            message: string;
            data: string;
        }>("/media/upload", body);
    },
};

export default productApiRequests;
