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
                status: 400,
            }
        );
    }

    try {
        const result = await authApiRequests.logoutFromNextServerToServer(sessionToken);

        return Response.json(result.payload, {
            status: 200,
            headers: {
                // xóa cookie
                "Set-Cookie": `sessionToken=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
            },
        });
    } catch (error) {
        if (error instanceof HttpError) {
            return Response.json(error.payload, {
                status: error.status,
            });
        } else {
            return Response.json(
                { message: "Logout failed" },
                {
                    status: 500,
                }
            );
        }
    }
}
