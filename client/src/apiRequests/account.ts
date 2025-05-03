import http from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";

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
};

export default accountApiRequests;
