
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        // 1. Check logged-in user
        const requestHeaders = await headers();

        const session = await auth.api.getSession({
            headers: requestHeaders,
        });

        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login first.",
                },
                { status: 401 }
            );
        }

        // 2. Generate JWT
        const tokenResult = await auth.api.getToken({
            headers: requestHeaders,
        });

        if (!tokenResult?.token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unable to generate authentication token.",
                },
                { status: 401 }
            );
        }

        // 3. Get booking data
        const bookingData = await request.json();

        // 4. Forward request to Express backend
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        if (!API_URL) {
            throw new Error("NEXT_PUBLIC_API_URL is not configured");
        }

        const backendResponse = await fetch(
            `${API_URL}/bookings`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenResult.token}`,
                },
                body: JSON.stringify(bookingData),
                cache: "no-store",
            }
        );

        const result = await backendResponse.json();

        return NextResponse.json(result, {
            status: backendResponse.status,
        });

    } catch (error) {
        console.error("Booking proxy error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while creating booking.",
            },
            { status: 500 }
        );
    }
}
