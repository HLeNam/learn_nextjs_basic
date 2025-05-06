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
// import { useAppContext } from "@/app/AppProvider";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";
import { useState } from "react";
import { AccountResType, UpdateMeBody, UpdateMeBodyType } from "@/schemaValidations/account.schema";
import accountApiRequests from "@/apiRequests/account";
// import { clientSessionToken } from "@/lib/http";

type Profile = AccountResType["data"];

const ProfileForm = ({ profile }: { profile: Profile }) => {
    // const { setSessionToken } = useAppContext();
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    // 1. Define your form.
    const form = useForm<UpdateMeBodyType>({
        resolver: zodResolver(UpdateMeBody),
        defaultValues: {
            name: profile.name,
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: UpdateMeBodyType) {
        if (loading) return;
        setLoading(true);
        try {
            const result = await accountApiRequests.updateMe(values);

            if (result) {
                toast.success("Cập nhật thành công");
                router.refresh();
            }
        } catch (error: unknown) {
            handleErrorApi<UpdateMeBodyType>({
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input placeholder="shadcn" type="email" value={profile.email} readOnly />
                </FormControl>
                <FormMessage />

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

                <Button type="submit" className="mt-8 w-full" disabled={loading}>
                    Cập nhật
                </Button>
            </form>
        </Form>
    );
};
export default ProfileForm;
