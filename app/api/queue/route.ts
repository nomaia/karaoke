import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";

export async function GET() {

    const queue = await kv.lrange("queue", 0, -1);

    const parsedQueue = queue.map((item: any) => {
        try {
            return JSON.parse(item);
        } catch {
            return item;
        }
    });

    return NextResponse.json({
        queue: parsedQueue,
        current: null,
    });
}