import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET() {
    const queue = await kv.lrange("queue", 0, -1);

    return NextResponse.json({
        queue,
        current: null,
    });
}