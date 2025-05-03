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
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
// import { useAppContext } from "@/app/AppProvider";
import authApiRequests from "@/apiRequests/auth";
import { useRouter } from "next/navigation";
// import { clientSessionToken } from "@/lib/http";

// Định nghĩa interface cho cấu trúc lỗi API
interface ApiErrorResponse {
    status: number;
    payload: {
        message: string;
        errors?: { field: string; message: string }[];
    };
}

const LoginForm = () => {
    // const { setSessionToken } = useAppContext();
    const router = useRouter();

    // 1. Define your form.
    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: LoginBodyType) {
        try {
            const result = await authApiRequests.login(values);

            const resultFromNextServer = await authApiRequests.auth({
                sessionToken: result.payload.data.token,
            });

            console.log(">>> resultFromNextServer", resultFromNextServer);

            toast.success(result.payload.message);
            // setSessionToken(result.payload.data.token);
            // clientSessionToken.value = result.payload.data.token;

            // Chuyển hướng đến trang "/me"
            router.push("/me");
        } catch (error: unknown) {
            // Kiểm tra xem lỗi có cấu trúc giống ApiErrorResponse không
            if (error && typeof error === "object" && "status" in error && "payload" in error) {
                const apiError = error as ApiErrorResponse;

                if (apiError.status === 422 && apiError.payload.errors) {
                    apiError.payload.errors.forEach((err) => {
                        const field = err.field as keyof LoginBodyType;
                        form.setError(field, {
                            type: "server",
                            message: err.message,
                        });
                    });
                } else {
                    toast.error("Lỗi", {
                        description: apiError.payload.message,
                    });
                }
            } else if (error instanceof Error) {
                // Xử lý các lỗi JavaScript thông thường
                toast.error("Lỗi", {
                    description: error.message,
                });
            } else {
                // Xử lý các lỗi không xác định
                toast.error("Đã xảy ra lỗi không xác định");
            }
        }
    }

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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mật khẩu</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="mt-8 w-full">
                    Đăng nhập
                </Button>
            </form>
        </Form>
    );
};
export default LoginForm;
