import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRIVATE_PATHS = ["/me"];
const AUTH_PATHS = ["/login", "/register"];
const PRODUCT_EDIT_PATTERN = /^\/products\/[^/]+\/edit$/;

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionToken = request.cookies.get("sessionToken")?.value;

    // Check if the request is for a private path
    if (PRIVATE_PATHS.some((path) => pathname.startsWith(path)) && !sessionToken) {
        // If not, redirect to the login page
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check if the request is for an auth path
    if (AUTH_PATHS.some((path) => pathname.startsWith(path)) && sessionToken) {
        // If so, redirect to the profile page
        return NextResponse.redirect(new URL("/me", request.url));
    }

    // Check if the request is for a product edit page
    if (PRODUCT_EDIT_PATTERN.test(pathname) && !sessionToken) {
        // If not, redirect to the login page
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ["/me", "/login", "/register", "/products/:id/edit"],
};
