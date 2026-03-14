import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";

export async function GET() {

    const queue = await kv.lrange("queue", 0, -1);

    const parsedQueue = queue.map((item: any) => {
        const m = typeof item === "string" ? JSON.parse(item) : item;

        return {
            name: m.name || m.nome || "Sem nome",
            link: m.link
        };
    });

    return NextResponse.json({
        queue: parsedQueue
    });
}