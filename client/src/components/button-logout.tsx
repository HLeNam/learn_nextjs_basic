"use client";

import authApiRequests from "@/apiRequests/auth";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

const ButtonLogout = () => {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await authApiRequests.logoutFromNextClientToNextServer(false);

            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Error during logout:", error);

            await authApiRequests.logoutFromNextClientToNextServer(true).then(() => {
                router.push(`/login?redirectFrom=${pathname}`);
            });
        } finally {
            localStorage.removeItem("sessionToken");
            localStorage.removeItem("sessionTokenExpiresAt");
        }
    };

    return (
        <Button size={"sm"} onClick={() => handleLogout()}>
            Đăng xuất
        </Button>
    );
};
export default ButtonLogout;
