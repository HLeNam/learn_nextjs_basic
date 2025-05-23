import { EntityError } from "@/lib/http";
import { clsx, type ClassValue } from "clsx";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const handleErrorApi = <T extends FieldValues>({
    error,
    setError,
    duration,
}: {
    error: unknown;
    setError?: UseFormSetError<T>;
    duration?: number;
}) => {
    if (error instanceof EntityError && setError) {
        error.payload.errors.forEach((err) => {
            setError(err.field as Path<T>, {
                type: "server",
                message: err.message,
            });
        });
    } else {
        toast.error("Lỗi", {
            description:
                (error as { payload?: { message?: string } })?.payload?.message || "Có lỗi xảy ra",
            duration: duration || 3000,
        });
    }
};

export const normalizePath = (path: string) => {
    return path.startsWith("/") ? path.slice(1) : path;
};

export const decodeJWT = <Payload = unknown>(token: string) => {
    return jwt.decode(token) as Payload;
};
