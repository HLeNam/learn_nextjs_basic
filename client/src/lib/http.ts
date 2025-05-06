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

class SessionToken {
    private token = "";
    private _expiresAt = new Date().toISOString();

    get value() {
        return this.token;
    }

    set value(token: string | undefined) {
        if (typeof window === "undefined") {
            throw new Error("Cannot set session token on server side");
        }
        this.token = token || "";
    }

    get expiresAt() {
        return this._expiresAt;
    }

    set expiresAt(expiresAt: string) {
        if (typeof window === "undefined") {
            throw new Error("Cannot set session token on server side");
        }
        this._expiresAt = expiresAt;
    }
}

export const clientSessionToken = new SessionToken();

let clientLogoutRequest: null | Response = null;
const request = async <Response>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    options?: CustomOptions | undefined
) => {
    const body = options?.body ? JSON.stringify(options.body) : undefined;

    const baseHeaders = {
        "Content-Type": "application/json",
        Authorization: clientSessionToken.value ? `Bearer ${clientSessionToken.value}` : "",
    };

    const baseUrl =
        options?.baseUrl === undefined ? envConfig.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl;

    const fullUrl = url.startsWith("/") ? `${baseUrl}${url}` : `${baseUrl}/${url}`;

    const res = await fetch(fullUrl, {
        ...options,
        method,
        headers: {
            ...baseHeaders,
            ...options?.headers,
        },
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
            if (typeof window !== "undefined") {
                if (!clientLogoutRequest) {
                    clientLogoutRequest = await fetch("/api/auth/logout", {
                        method: "POST",
                        body: JSON.stringify({
                            force: true,
                        }),
                        headers: {
                            ...baseHeaders,
                        },
                    });

                    await clientLogoutRequest.json();
                    clientSessionToken.value = "";
                    clientSessionToken.expiresAt = "";
                    location.href = "/login";
                }

                clientLogoutRequest = null;
            } else {
                const sessionToken = (
                    options?.headers as Record<string, string>
                )?.Authorization?.split(" ")[1];
                redirect(`/logout?sessionToken=${sessionToken}`);
            }
        } else {
            throw new HttpError(
                data as {
                    status: number;
                    payload: {
                        message: string;
                        [key: string]: unknown;
                    };
                }
            );
        }
    }

    // Đảm bảo logic chỉ chạy trên client
    if (typeof window !== "undefined") {
        if (["auth/login", "auth/register"].some((path) => path === normalizePath(url))) {
            clientSessionToken.value = (payload as LoginResType).data?.token;
            clientSessionToken.expiresAt = (payload as LoginResType).data?.expiresAt;
        } else if ("auth/logout" === normalizePath(url)) {
            clientSessionToken.value = "";
            clientSessionToken.expiresAt = "";
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

    delete<Response>(
        url: string,
        body: unknown,
        options?: Omit<CustomOptions, "body"> | undefined
    ) {
        return request<Response>("DELETE", url, { ...options, body: body as BodyInit });
    },
};

export default http;
