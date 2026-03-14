import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET() {
    const queue = await kv.lrange("queue", 0, -1);

    const parsedQueue = queue.map((item: any) => {
        if (typeof item === "string") {
            return JSON.parse(item);
        }
        return item;
    });

    return NextResponse.json({
        queue: parsedQueue,
        current: null,
    });
}