export async function POST(request: Request) {
    const res = await request.json();

    const sessionToken = res.sessionToken as string | undefined;
    const expiresAt = res.expiresAt as string;

    if (!sessionToken) {
        return Response.json(
            { message: "Session token is missing" },
            {
                status: 422,
            }
        );
    }

    const expiresDate = new Date(expiresAt).toUTCString();
    return Response.json(res, {
        status: 200,
        headers: {
            "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${expiresDate}`,
        },
    });
}
