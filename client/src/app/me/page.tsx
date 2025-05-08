import { cookies } from "next/headers";

import Profile from "@/app/me/profile";
import accountApiRequests from "@/apiRequests/account";
import ProfileForm from "@/app/me/profile-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hồ sơ cá nhân",
    description: "Hồ sơ cá nhân của bạn",
};

const MeProfile = async () => {
    const cookieStore = await cookies();

    const sessionToken = cookieStore.get("sessionToken")?.value ?? "";

    // console.log("sessionToken", sessionToken);

    // Vì dùng cookie nên api này không được cache trên server
    let result = null;
    result = await accountApiRequests.me(sessionToken as string);

    return (
        <div>
            <h1>Profile</h1>
            <div>Xin chào {result?.payload?.data?.name ?? "Guest"}</div>
            <Profile />
            <ProfileForm profile={result?.payload?.data} />
        </div>
    );
};
export default MeProfile;
