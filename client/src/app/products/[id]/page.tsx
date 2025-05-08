import productApiRequests from "@/apiRequests/product";
import { HttpError } from "@/lib/http";
import { Metadata } from "next";
import Image from "next/image";

import envConfig from "@/config";
import { baseOpenGraphMetadata } from "@/app/shared-metadata";

type Params = { id: string };

type Props = {
    params: Promise<Params>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    // read route params
    const { id } = await params;

    // fetch data
    const {
        payload: { data },
    } = await productApiRequests.getDetail(Number(id));
    const product = data;

    const url = envConfig.NEXT_PUBLIC_URL + "/products/" + product.id;

    return {
        title: product.name,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            url: url,
            siteName: "Productic Company",
            images: [
                {
                    url: product.image,
                },
            ],
            ...baseOpenGraphMetadata,
        },
        alternates: {
            canonical: url,
        },
    };
}

const ProductDetail = async ({ params }: { params: Promise<Params> }) => {
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
                <div className="flex flex-col items-center justify-center gap-4 max-w-2xl mx-auto p-4">
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={180}
                        height={270}
                        priority
                        className="w-auto h-auto rounded-md object-cover"
                    />
                    <p className="text-lg font-semibold">Price: {product.price}</p>
                    <p className="text-lg">{product.description}</p>
                </div>
            )}
        </div>
    );
};
export default ProductDetail;
