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
import envConfig from "@/config";
import { useAppContext } from "@/app/AppProvider";

// Định nghĩa interface cho cấu trúc lỗi API
interface ApiErrorResponse {
    status: number;
    payload: {
        message: string;
        errors?: { field: string; message: string }[];
    };
}

const LoginForm = () => {
    const { setSessionToken } = useAppContext();

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
            const result = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            }).then(async (res) => {
                const payload = await res.json();
                const data = {
                    status: res.status,
                    payload: payload,
                };

                if (!res.ok) {
                    throw data;
                }

                return data;
            });
            toast.success(result.payload.message);

            const resultFromNextServer = await fetch("/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(result),
            }).then(async (res) => {
                const payload = await res.json();
                const data = {
                    status: res.status,
                    payload: payload,
                };

                if (!res.ok) {
                    throw data;
                }

                return data;
            });

            console.log(">>> resultFromNextServer", resultFromNextServer);

            setSessionToken(resultFromNextServer.payload.data.token);
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
