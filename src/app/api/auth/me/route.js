import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "mysecretkey");

export async function GET(request) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
        const { payload } = await jwtVerify(token, SECRET);
        return NextResponse.json({
            authenticated: true,
            user: {
                id: payload.id,
                username: payload.username,
                role: payload.role
            }
        });
    } catch (err) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
}
