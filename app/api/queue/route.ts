import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";
export const preferredRegion = "gru1";

export const dynamic = "force-dynamic";

export async function GET() {
    try {

        const queue = await kv.lrange("queue", 0, -1);

        const parsedQueue = queue
            .map((item: any) => {
                try {

                    const musica = typeof item === "string"
                        ? JSON.parse(item)
                        : item;

                    return {
                        id: musica?.id ?? Date.now(),
                        nome: musica?.nome ?? musica?.name ?? "Sem nome",
                        link: musica?.link ?? "",
                        youtubeId: musica?.youtubeId ?? "",
                        status: musica?.status ?? "waiting",
                    };

                } catch (err) {
                    console.error("Item inválido na fila:", item);
                    return null;
                }
            })
            .filter(Boolean);

        return NextResponse.json({
            queue: parsedQueue,
            current: null
        });

    } catch (error) {

        console.error("Erro em /api/queue:", error);

        return NextResponse.json(
            { queue: [], current: null },
            { status: 500 }
        );
    }
}