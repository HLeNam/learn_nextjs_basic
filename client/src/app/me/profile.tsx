"use client";

import { useEffect } from "react";

import { useAppContext } from "@/app/AppProvider";
import envConfig from "@/config";

const Profile = () => {
    const { sessionToken } = useAppContext();

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/account/me`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionToken}`,
                },
            }).then(async (res) => {
                const payload = await res.json();
                const data = {
                    status: res.status,
                    payload: payload,
                };

                if (!res.ok) {
                    throw data;
                }

                return data;
            });

            return result;
        };

        fetchData();
    }, [sessionToken]);

    return <div>Profile</div>;
};
export default Profile;
