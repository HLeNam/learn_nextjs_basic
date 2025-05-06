"use client";

import authApiRequests from "@/apiRequests/auth";
import { clientSessionToken } from "@/lib/http";
import { useEffect } from "react";
import { differenceInHours } from "date-fns";

const SlideSession = () => {
    useEffect(() => {
        const interval = setInterval(async () => {
            slideSession();
        }, 1000 * 60 * 60);

        return () => clearInterval(interval);
    }, []);

    const slideSession = async () => {
        try {
            const now = new Date();
            const expiresAt = new Date(clientSessionToken.expiresAt);

            if (differenceInHours(expiresAt, now) < 1) {
                const res = await authApiRequests.slideSessionFromNextClientToNextServer();
                clientSessionToken.expiresAt = res.payload.data.expiresAt;
            }
        } catch (error) {
            console.error("Error sliding session:", error);
            // Handle error (e.g., show a toast notification)
            // toast.error("Failed to slide session");
        }
    };

    return null;
};
export default SlideSession;
