import { decodeJWT } from "@/lib/utils";

type PayloadJWT = {
    iat: number;
    exp: number;
    tokenType: string;
    userId: number;
};

export async function POST(request: Request) {
    const res = await request.json();

    const sessionToken = res.sessionToken as string | undefined;

    if (!sessionToken) {
        return Response.json(
            { message: "Session token is missing" },
            {
                status: 422,
            }
        );
    }

    // Decode the JWT token to get the payload
    const decodedPayload = decodeJWT<PayloadJWT>(sessionToken);
    const expiresDate = new Date(decodedPayload.exp * 1000).toUTCString();
    return Response.json(res, {
        status: 200,
        headers: {
            "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${expiresDate}`,
        },
    });
}
