import http from "@/lib/http";
import { CreateProductBodyType, ProductResType } from "@/schemaValidations/product.schema";

const productApiRequests = {
    get: () => {
        return http.get("/products");
    },

    create: (body: CreateProductBodyType) => {
        return http.post<ProductResType>("/products", body);
    },

    uploadImage: (body: FormData) => {
        return http.post<{
            message: string;
            data: string;
        }>("/media/upload", body);
    },
};

export default productApiRequests;
