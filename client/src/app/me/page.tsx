import { cookies } from "next/headers";

import Profile from "@/app/me/profile";
import accountApiRequests from "@/apiRequests/account";

const MeProfile = async () => {
    const cookieStore = await cookies();

    const sessionToken = cookieStore.get("sessionToken")?.value ?? "";

    const result = await accountApiRequests.me(sessionToken as string);

    return (
        <div>
            <h1>Profile</h1>
            <div>Xin chào {result.payload.data.name}</div>
            <Profile />
        </div>
    );
};
export default MeProfile;
