import http from "@/lib/http";
import {
    LoginBodyType,
    LoginResType,
    RegisterBodyType,
    RegisterResType,
} from "@/schemaValidations/auth.schema";
import { MessageResType } from "@/schemaValidations/common.schema";

const authApiRequests = {
    login: async (body: LoginBodyType) => {
        return http.post<LoginResType>("/auth/login", body);
    },

    register: async (body: RegisterBodyType) => {
        return http.post<RegisterResType>("/auth/register", body);
    },

    auth: async (body: { sessionToken: string }) => {
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
        force: boolean | undefined,
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
};

export default authApiRequests;
