"use client";

import { useEffect } from "react";

// import { useAppContext } from "@/app/AppProvider";
import accountApiRequests from "@/apiRequests/account";
import { handleErrorApi } from "@/lib/utils";
// import { clientSessionToken } from "@/lib/http";

const Profile = () => {
    // const { sessionToken } = useAppContext();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await accountApiRequests.meClient();

                return result;
            } catch (error) {
                handleErrorApi({
                    error,
                    // setError: setError,
                    // duration: 3000,
                });
            }
        };

        fetchData();
    }, []);

    return <div>Profile</div>;
};
export default Profile;
