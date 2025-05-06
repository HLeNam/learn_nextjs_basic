import http from "@/lib/http";
import { AccountResType, UpdateMeBodyType } from "@/schemaValidations/account.schema";

const accountApiRequests = {
    me: async (sessionToken: string) => {
        return http.get<AccountResType>("/account/me", {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
            },
        });
    },

    meClient: async () => {
        return http.get<AccountResType>("/account/me");
    },

    updateMe: async (body: UpdateMeBodyType) => {
        return http.put<AccountResType>("/account/me", body);
    },
};

export default accountApiRequests;
