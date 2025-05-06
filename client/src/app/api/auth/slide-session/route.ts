import authApiRequests from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

export async function POST() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sessionToken")?.value;

    if (!sessionToken) {
        return Response.json(
            { message: "Session token is missing" },
            {
                status: 401,
            }
        );
    }

    try {
        const res = await authApiRequests.slideSessionFromNextServerToServer(sessionToken);
        const newExpiresDate = new Date(res.payload.data.expiresAt).toUTCString();

        return Response.json(res.payload, {
            status: 200,
            headers: {
                "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${newExpiresDate}`,
            },
        });
    } catch (error) {
        console.error("Error sliding session:", error);
        if (error instanceof HttpError) {
            return Response.json(error.payload, {
                status: error.status,
            });
        } else {
            return Response.json(
                { message: "Internal server error" },
                {
                    status: 500,
                }
            );
        }
    }
}
