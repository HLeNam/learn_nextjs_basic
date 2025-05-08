"use client";

import authApiRequests from "@/apiRequests/auth";
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
            const sessionTokenExpiresAt = localStorage.getItem("sessionTokenExpiresAt");
            const expiresAt = sessionTokenExpiresAt ? new Date(sessionTokenExpiresAt) : new Date();

            if (differenceInHours(expiresAt, now) < 1) {
                const res = await authApiRequests.slideSessionFromNextClientToNextServer();
                localStorage.setItem("sessionTokenExpiresAt", res.payload.data.expiresAt);
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
