import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const requestHeaders = await headers();

        const session = await auth.api.getSession({
            headers: requestHeaders,
        });

        if (!session) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const tokenResult = await auth.api.getToken({
            headers: requestHeaders,
        });

        if (!tokenResult?.token) {
            return NextResponse.json(
                { success: false, message: "JWT generation failed" },
                { status: 401 }
            );
        }

        const response = NextResponse.json({
            success: true,
            message: "HTTPOnly cookie set successfully",
        });

        response.cookies.set("studio_access_token", tokenResult.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 15,
        });

        return response;

    } catch (error) {
        console.error("Backend auth error:", error);

        return NextResponse.json(
            { success: false, message: "Authentication failed" },
            { status: 500 }
        );
    }
}