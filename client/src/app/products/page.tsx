import productApiRequests from "@/apiRequests/product";
import DeleteProductButton from "@/app/products/_components/delete-product-button";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Danh sách sản phẩm",
    description: "Danh sách sản phẩm của productic",
};

const ProductListPage = async () => {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sessionToken")?.value ?? undefined;
    const isAuthenticated = !!sessionToken;

    const {
        payload: { data: productList },
    } = await productApiRequests.getList();

    return (
        <div>
            <h1>Product List</h1>
            {isAuthenticated && (
                <Link
                    href="/products/add"
                    className="mb-4 inline-block rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                    Thêm sản phẩm
                </Link>
            )}

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Description</th>
                        {isAuthenticated && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {productList.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td className="flex items-center gap-2">
                                <Link
                                    href={`/products/${product.id}`}
                                    className="flex items-center gap-2"
                                >
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        width={180}
                                        height={270}
                                        priority
                                        className="w-full h-auto rounded-md object-cover"
                                    />
                                </Link>

                                {product.name}
                            </td>
                            <td>{product.price}</td>
                            <td>{product.description}</td>
                            {isAuthenticated && (
                                <td>
                                    <div className="flex items-center gap-2">
                                        <Link href={`/products/${product.id}/edit`}>
                                            <Button variant="outline">Edit</Button>
                                        </Link>
                                        <DeleteProductButton product={product} />
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default ProductListPage;
