import { API_URL } from "@/services/utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = 'edge'

export const POST = async (req: Request) => {
    const { data } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Authorization token is missing.' }, { status: 401 });
    }

    const request = await fetch(`${API_URL}/chats/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
    });

    const response = await request.json();
    if (!request.ok) {
        return NextResponse.json(response, { status: request.status });
    }
    return NextResponse.json(response, { status: 200 });
}