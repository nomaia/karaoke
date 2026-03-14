import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function POST(request: Request) {
    const { id } = await request.json();

    const queue: any[] = await kv.lrange("queue", 0, -1);

    const novaFila = queue.filter((item) => item.id !== id);

    await kv.del("queue");

    for (const item of novaFila) {
        await kv.rpush("queue", item);
    }

    return NextResponse.json({ success: true });
}