"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";
import { useState } from "react";
import {
    CreateProductBody,
    CreateProductBodyType,
    ProductResType,
} from "@/schemaValidations/product.schema";
import productApiRequests from "@/apiRequests/product";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Product = ProductResType["data"];

const ProductAddForm = ({ product }: { product?: Product }) => {
    // const router = useRouter();

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    // 1. Define your form.
    const form = useForm<CreateProductBodyType>({
        resolver: zodResolver(CreateProductBody),
        defaultValues: {
            name: product?.name ?? "",
            price: product?.price ?? 0,
            description: product?.description ?? "",
            image: product?.image ?? "",
        },
    });

    const image = form.watch("image");

    const router = useRouter();

    // 2. Define a submit handler.
    async function onSubmit(values: CreateProductBodyType) {
        if (loading) return;
        setLoading(true);
        try {
            // Nếu có file, bạn cần xử lý upload ảnh trước khi gửi form
            if (file) {
                // Đảm bảo trường image trong values chứa URL hoặc path của ảnh đã upload
                values.image = "http:/localhost:3000/" + file.name; // Hoặc URL từ kết quả upload
            }

            let imageUrl = "";
            if (file) {
                const formData = new FormData();
                formData.append("file", file!);
                const uploadImageResult = await productApiRequests.uploadImage(formData);
                imageUrl = uploadImageResult.payload.data;
                values.image = imageUrl;
            } else if (product) {
                imageUrl = form.getValues("image");
                values.image = imageUrl;
            }

            let result = null;

            if (product) {
                // Nếu có sản phẩm, gọi API cập nhật
                result = await productApiRequests.update(product.id, {
                    ...values,
                });
                router.refresh();
            } else {
                // Nếu không có sản phẩm, gọi API tạo mới
                result = await productApiRequests.create({
                    ...values,
                    image: imageUrl,
                });
            }

            toast.success(result.payload.message);
            // router.push("/products");
        } catch (error: unknown) {
            handleErrorApi<CreateProductBodyType>({
                error,
                setError: form.setError,
            });
        } finally {
            setLoading(false);
        }
    }

    // Xử lý khi chọn file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFile(files[0]);
            // Lưu tên file vào form state nhưng KHÔNG đặt lại giá trị của input file
            form.setValue("image", "http:/localhost:3000/" + files[0].name);
        }
    };

    // Xử lý khi xóa file
    const handleDeleteImage = () => {
        setFile(null);
        form.setValue("image", "");
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit, (error) => {
                    console.log(error);
                })}
                className="space-y-2 max-w-[600px] w-full"
                noValidate
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên</FormLabel>
                            <FormControl>
                                <Input placeholder="Tên" type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Giá</FormLabel>
                            <FormControl>
                                <Input placeholder="Giá" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mô tả</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Mô tả" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="image"
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                            <FormLabel>Hình ảnh</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    {...fieldProps}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {(file || image) && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            Hình ảnh đã chọn: {file?.name ?? image ?? ""}
                        </p>
                        <Image
                            src={file ? URL.createObjectURL(file as File) : image ?? ""}
                            alt="Selected Image"
                            width={128}
                            height={128}
                            className="rounded-md w-32 h-32 object-cover"
                        />
                        <div className="mt-2">
                            <Button
                                variant={"destructive"}
                                size={"icon"}
                                type="button"
                                onClick={() => {
                                    handleDeleteImage();
                                }}
                            >
                                <span>Xóa</span>
                            </Button>
                        </div>
                    </div>
                )}

                <Button type="submit" className="mt-8 w-full" disabled={loading}>
                    {loading
                        ? "Đang xử lý..."
                        : product
                        ? "Cập nhật sản phẩm"
                        : "Thêm mới sản phẩm"}
                </Button>
            </form>
        </Form>
    );
};
export default ProductAddForm;
