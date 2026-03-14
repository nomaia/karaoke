import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const queue = await kv.lrange("queue", 0, -1);

        const parsedQueue = queue.map((item: any) => {
            const musica = typeof item === "string" ? JSON.parse(item) : item;

            return {
                id: musica.id,
                nome: musica.nome || musica.name || "Sem nome",
                link: musica.link,
                youtubeId: musica.youtubeId,
                status: musica.status || "waiting",
            };
        });

        return NextResponse.json({
            queue: parsedQueue,
            current: null,
        });
    } catch (error) {
        console.error("Erro em /api/queue:", error);

        return NextResponse.json(
            { queue: [], current: null },
            { status: 500 }
        );
    }
}