import productApiRequests from "@/apiRequests/product";
import { HttpError } from "@/lib/http";
import Image from "next/image";

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
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={180}
                        height={270}
                        priority
                        className="rounded-md object-cover"
                    />
                    <p>{product.description}</p>
                    <p>{product.price}</p>
                </div>
            )}
        </div>
    );
};
export default ProductEdit;
