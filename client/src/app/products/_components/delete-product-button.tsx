"use client";

import productApiRequests from "@/apiRequests/product";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { handleErrorApi } from "@/lib/utils";
import { ProductResType } from "@/schemaValidations/product.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Product = ProductResType["data"];

const DeleteProductButton = ({ product }: { product: Product }) => {
    const router = useRouter();

    const handleDeleteProduct = async () => {
        try {
            const res = await productApiRequests.delete(product.id);

            if (res.status === 200) {
                toast.success("Xóa sản phẩm thành công");
                router.refresh();
            } else {
                toast.error("Xóa sản phẩm thất bại");
            }
        } catch (error) {
            handleErrorApi({ error });
        }
    };

    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bang muốn xóa sản phẩm này?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {`Bạn có chắc chắn muốn xóa sản phẩm ${product.name} không?
                            Nếu bạn xóa sản phẩm này, nó sẽ không còn xuất hiện trong danh sách sản phẩm của bạn nữa.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteProduct()}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
export default DeleteProductButton;
