import http from "@/lib/http";
import {
    CreateProductBodyType,
    ProductListResType,
    ProductResType,
} from "@/schemaValidations/product.schema";

const productApiRequests = {
    getList: () => {
        return http.get<ProductListResType>("/products");
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
