import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";
export const preferredRegion = "gru1";

export const dynamic = "force-dynamic";

export async function POST() {
    try {
        const queue = await kv.lrange("queue", 0, -1);

        const parsedQueue = queue.map((item: any) =>
            typeof item === "string" ? JSON.parse(item) : item
        );

        if (parsedQueue.length === 0) {
            return NextResponse.json(
                { error: "Fila vazia" },
                { status: 400 }
            );
        }

        parsedQueue.shift();

        await kv.del("queue");

        if (parsedQueue.length > 0) {
            for (const item of parsedQueue) {
                await kv.rpush("queue", JSON.stringify(item));
            }
        }

        return NextResponse.json({
            success: true,
            queue: parsedQueue,
        });
    } catch (error) {
        console.error("Erro em /api/next:", error);

        return NextResponse.json(
            { error: "Erro ao avançar fila." },
            { status: 500 }
        );
    }
}