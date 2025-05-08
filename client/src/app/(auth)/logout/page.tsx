"use client";

import authApiRequests from "@/apiRequests/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const LogoutPage = () => {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const sessionToken = localStorage.getItem("sessionToken");
        const controller = new AbortController();
        const signal = controller.signal;
        if (sessionToken === sessionToken) {
            authApiRequests.logoutFromNextClientToNextServer(true, signal).then(() => {
                router.push(`/login?redirectFrom=${pathname}`);
            });
        }
        return () => {
            controller.abort(); // Hủy yêu cầu khi component bị hủy
        };
    }, [pathname, router]);

    return <div></div>;
};
export default LogoutPage;
