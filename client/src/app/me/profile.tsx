"use client";

import { useEffect } from "react";

// import { useAppContext } from "@/app/AppProvider";
import accountApiRequests from "@/apiRequests/account";
// import { clientSessionToken } from "@/lib/http";

const Profile = () => {
    // const { sessionToken } = useAppContext();

    useEffect(() => {
        const fetchData = async () => {
            const result = await accountApiRequests.meClient();

            return result;
        };

        fetchData();
    }, []);

    return <div>Profile</div>;
};
export default Profile;
