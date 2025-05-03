import envConfig from "@/config";
import { LoginResType } from "@/schemaValidations/auth.schema";

type CustomOptions = RequestInit & {
    baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 422;

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

    get value() {
        return this.token;
    }

    set value(token: string | undefined) {
        if (typeof window === "undefined") {
            throw new Error("Cannot set session token on server side");
        }
        this.token = token || "";
    }
}

export const clientSessionToken = new SessionToken();

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

    if (["/auth/login", "/auth/register"].some((path) => url.includes(path))) {
        clientSessionToken.value = (payload as LoginResType).data?.token;
    } else if ("/auth/logout".includes(url)) {
        clientSessionToken.value = "";
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
