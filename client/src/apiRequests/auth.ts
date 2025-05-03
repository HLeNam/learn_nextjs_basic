import http from "@/lib/http";
import {
    LoginBodyType,
    LoginResType,
    RegisterBodyType,
    RegisterResType,
} from "@/schemaValidations/auth.schema";

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
};

export default authApiRequests;
