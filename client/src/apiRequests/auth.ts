import http from "@/lib/http";
import {
    LoginBodyType,
    LoginResType,
    RegisterBodyType,
    RegisterResType,
    SlideSessionResType,
} from "@/schemaValidations/auth.schema";
import { MessageResType } from "@/schemaValidations/common.schema";

const authApiRequests = {
    login: async (body: LoginBodyType) => {
        return http.post<LoginResType>("/auth/login", body);
    },

    register: async (body: RegisterBodyType) => {
        return http.post<RegisterResType>("/auth/register", body);
    },

    auth: async (body: { sessionToken: string; expiresAt: string }) => {
        return http.post<LoginResType>("/api/auth", body, {
            baseUrl: "",
        });
    },

    logoutFromNextServerToServer: async (sessionToken: string) => {
        return http.post<MessageResType>(
            "/auth/logout",
            {},
            {
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                },
            }
        );
    },

    logoutFromNextClientToNextServer: async (
        force?: boolean | undefined,
        signal?: AbortSignal | undefined
    ) => {
        http.post<MessageResType>(
            "/api/auth/logout",
            {
                force,
            },
            {
                baseUrl: "",
                signal,
            }
        );
    },

    slideSessionFromNextServerToServer: async (sessionToken: string) => {
        return http.post<SlideSessionResType>(
            "/auth/slide-session",
            {},
            {
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                },
            }
        );
    },

    slideSessionFromNextClientToNextServer: async () => {
        return http.post<SlideSessionResType>(
            "/api/auth/slide-session",
            {},
            {
                baseUrl: "",
            }
        );
    },
};

export default authApiRequests;
