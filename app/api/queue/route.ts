import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
    try {

        const queue = await kv.lrange("queue", 0, -1);

        const parsed = queue.map((item: any) => {
            if (typeof item === "string") {
                return JSON.parse(item);
            }
            return item;
        });

        return NextResponse.json({
            queue: parsed
        });

    } catch (error) {

        console.error("Erro queue:", error);

        return NextResponse.json({
            queue: []
        });

    }
}