import productApiRequests from "@/apiRequests/product";
import ProductAddForm from "@/app/products/_components/product-add-form";
import { HttpError } from "@/lib/http";

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
