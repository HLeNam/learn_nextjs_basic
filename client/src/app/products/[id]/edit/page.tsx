import productApiRequests from "@/apiRequests/product";
import ProductAddForm from "@/app/products/_components/product-add-form";
import { HttpError } from "@/lib/http";
import { Metadata } from "next";
import { cache } from "react";

const getDetail = cache(productApiRequests.getDetail);

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    // read route params
    const { id } = await params;

    // fetch data
    const {
        payload: { data },
    } = await getDetail(Number(id));
    const product = data;

    return {
        title: `Sửa sản phẩm: ${product.name}`,
        description: product.description,
    };
}

const ProductEdit = async ({
    params,
}: {
    params: {
        id: string;
    };
}) => {
    const { id } = await params;

    let product = null;

    let fetchError = null;

    try {
        const {
            payload: { data },
        } = await productApiRequests.getDetail(Number(id));
        product = data;
    } catch (error: HttpError | unknown) {
        if (error instanceof HttpError) {
            console.error("HttpError:", error.errorPayload);
            fetchError = error.errorPayload;
        } else {
            console.error("Unknown error:", error);
            fetchError = {
                message: "An unknown error occurred",
            };
        }
    }

    return (
        <div>
            {!product && fetchError && (
                <div className="flex flex-col items-center justify-center gap-2">
                    <h1 className="text-3xl font-bold">{fetchError.statusCode}</h1>
                    <p className="text-red-500">{fetchError.message}</p>
                </div>
            )}

            {product && (
                <div className="flex flex-col items-center justify-center gap-2">
                    <ProductAddForm product={product} />
                </div>
            )}
        </div>
    );
};
export default ProductEdit;
