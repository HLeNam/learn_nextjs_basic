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
import { handleErrorApi } from "@/lib/utils";
import { useState } from "react";
// import { clientSessionToken } from "@/lib/http";

const LoginForm = () => {
    // const { setSessionToken } = useAppContext();
    const router = useRouter();

    const [loading, setLoading] = useState(false);

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
        if (loading) return;
        setLoading(true);
        try {
            const result = await authApiRequests.login(values);

            const resultFromNextServer = await authApiRequests.auth({
                sessionToken: result.payload.data.token,
                expiresAt: result.payload.data.expiresAt,
            });

            console.log(">>> resultFromNextServer", resultFromNextServer);

            toast.success(result.payload.message);
            // setSessionToken(result.payload.data.token);
            // clientSessionToken.value = result.payload.data.token;

            // Chuyển hướng đến trang "/me"
            // router.push("/me");
            router.push("/");
        } catch (error: unknown) {
            handleErrorApi<LoginBodyType>({
                error,
                setError: form.setError,
            });
        } finally {
            setLoading(false);
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

                <Button type="submit" className="mt-8 w-full" disabled={loading}>
                    Đăng nhập
                </Button>
            </form>
        </Form>
    );
};
export default LoginForm;
