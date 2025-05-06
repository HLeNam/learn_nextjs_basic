import productApiRequests from "@/apiRequests/product";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const ProductListPage = async () => {
    const {
        payload: { data: productList },
    } = await productApiRequests.getList();

    return (
        <div>
            <h1>Product List</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {productList.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td className="flex items-center gap-2">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={180}
                                    height={270}
                                    priority
                                    className="rounded-md object-cover"
                                />

                                {product.name}
                            </td>
                            <td>{product.price}</td>
                            <td>{product.description}</td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline">Edit</Button>
                                    <Button variant="destructive">Delete</Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default ProductListPage;
