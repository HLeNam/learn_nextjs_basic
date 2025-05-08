import envConfig from "@/config";
import { normalizePath } from "@/lib/utils";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { redirect } from "next/navigation";

type CustomOptions = RequestInit & {
    baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPayload = {
    message: string;
    errors: {
        field: string;
        message: string;
    }[];
};

export class HttpError extends Error {
    status: number;
    payload: {
        message: string;
        statusCode?: number;
        [key: string]: unknown;
    };
    constructor({
        status,
        payload,
    }: {
        status: number;
        payload: {
            message: string;
            [key: string]: unknown;
        };
    }) {
        super("Http Error");
        this.status = status;
        this.payload = payload;
    }

    get errorPayload() {
        return this.payload;
    }

    get statusCode() {
        return this.status;
    }
}

export class EntityError extends HttpError {
    status = ENTITY_ERROR_STATUS;
    payload: EntityErrorPayload;
    constructor(payload: EntityErrorPayload) {
        super({
            status: ENTITY_ERROR_STATUS,
            payload,
        });
        this.payload = payload;
        this.status = ENTITY_ERROR_STATUS;
    }
}

let clientLogoutRequest: null | Response = null;
export const isClient = () => typeof window !== "undefined";
const request = async <Response>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    options?: CustomOptions | undefined
) => {
    let body: FormData | BodyInit | null | undefined = undefined;
    if (options?.body && options.body instanceof FormData) {
        body = options.body;
    } else if (options?.body) {
        body = JSON.stringify(options.body);
    }

    const baseHeaders: {
        [key: string]: string | undefined;
    } = body instanceof FormData ? {} : { "Content-Type": "application/json" };

    if (isClient()) {
        const sessionToken = localStorage.getItem("sessionToken");

        if (sessionToken) {
            baseHeaders.Authorization = `Bearer ${sessionToken}`;
        }
    }

    const baseUrl =
        options?.baseUrl === undefined ? envConfig.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl;

    const fullUrl = url.startsWith("/") ? `${baseUrl}${url}` : `${baseUrl}/${url}`;

    const res = await fetch(fullUrl, {
        ...options,
        method,
        headers: {
            ...baseHeaders,
            ...options?.headers,
        } as HeadersInit,
        body,
    });

    const payload: Response = await res.json();

    const data = {
        status: res.status,
        payload: payload,
    };

    if (!res.ok) {
        if (res.status === ENTITY_ERROR_STATUS) {
            throw new EntityError(payload as EntityErrorPayload);
        } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
            if (isClient()) {
                if (!clientLogoutRequest) {
                    clientLogoutRequest = await fetch("/api/auth/logout", {
                        method: "POST",
                        body: JSON.stringify({
                            force: true,
                        }),
                        headers: {
                            ...baseHeaders,
                        } as HeadersInit,
                    });
                    try {
                        await clientLogoutRequest.json();
                    } catch (error) {
                        console.error("Logout error", error);
                    } finally {
                        localStorage.removeItem("sessionToken");
                        localStorage.removeItem("sessionTokenExpiresAt");
                        clientLogoutRequest = null;
                        location.href = "/login";
                    }
                }
            } else {
                const sessionToken = (
                    options?.headers as Record<string, string>
                )?.Authorization?.split(" ")[1];
                redirect(`/logout?sessionToken=${sessionToken}`);
            }
        } else {
            const error = new HttpError({
                status: data.status,
                payload: data.payload as {
                    message: string;
                    [key: string]: unknown;
                },
            });
            throw error;
        }
    }

    // Đảm bảo logic chỉ chạy trên client
    if (isClient()) {
        if (["auth/login", "auth/register"].some((path) => path === normalizePath(url))) {
            const { token, expiresAt } = (payload as LoginResType).data || {};
            localStorage.setItem("sessionToken", token);
            localStorage.setItem("sessionTokenExpiresAt", expiresAt);
        } else if ("auth/logout" === normalizePath(url)) {
            localStorage.removeItem("sessionToken");
            localStorage.removeItem("sessionTokenExpiresAt");
        }
    }

    return data;
};

const http = {
    get<Response>(url: string, options?: Omit<CustomOptions, "body"> | undefined) {
        return request<Response>("GET", url, options);
    },

    post<Response>(url: string, body: unknown, options?: Omit<CustomOptions, "body"> | undefined) {
        return request<Response>("POST", url, { ...options, body: body as BodyInit });
    },

    put<Response>(url: string, body: unknown, options?: Omit<CustomOptions, "body"> | undefined) {
        return request<Response>("PUT", url, { ...options, body: body as BodyInit });
    },

    delete<Response>(url: string, options?: Omit<CustomOptions, "body"> | undefined) {
        return request<Response>("DELETE", url, { ...options });
    },
};

export default http;
