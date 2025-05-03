import { cookies } from "next/headers";

import envConfig from "@/config";
import Profile from "@/app/me/profile";

const MeProfile = async () => {
    const cookieStore = await cookies();

    const sessionToken = cookieStore.get("sessionToken")?.value;

    const result = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/account/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
            Cookie: `sessionToken=${sessionToken}`,
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

    return (
        <div>
            <h1>Profile</h1>
            <div>Xin chào {result.payload.data.name}</div>
            <Profile />
        </div>
    );
};
export default MeProfile;
