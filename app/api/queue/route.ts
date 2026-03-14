import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

export async function GET() {

    const queue = await kv.lrange("queue", 0, -1);

    const parsed = queue.map((item: any) =>
        typeof item === "string" ? JSON.parse(item) : item
    );

    return NextResponse.json(
        { queue: parsed },
        {
            headers: {
                "Cache-Control": "no-store, max-age=0",
            },
        }
    );

}