"use client";

import authApiRequests from "@/apiRequests/auth";
import { clientSessionToken } from "@/lib/http";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const LogoutPage = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const sessionToken = searchParams.get("sessionToken");
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        if (sessionToken === clientSessionToken.value) {
            authApiRequests.logoutFromNextClientToNextServer(true, signal).then(() => {
                router.push(`/login?redirectFrom=${pathname}`);
            });
        }
        return () => {
            controller.abort(); // Hủy yêu cầu khi component bị hủy
        };
    }, [pathname, router, sessionToken]);

    return <div></div>;
};
export default LogoutPage;
