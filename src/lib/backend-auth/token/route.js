import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const tokenResult = await auth.api.getToken({
            headers: await headers(),
        });

        if (!tokenResult?.token) {
            return NextResponse.json(
                { success: false, message: "Unable to generate token" },
                { status: 401 }
            );
        }

        const response = NextResponse.json({
            success: true,
            message: "Authentication successful",
        });

        response.cookies.set("studio_access_token", tokenResult.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60,
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