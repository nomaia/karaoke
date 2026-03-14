import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";

function getYoutubeId(url: string) {
    try {
        const parsed = new URL(url);

        if (parsed.hostname.includes("youtu.be")) {
            return parsed.pathname.replace("/", "");
        }

        return parsed.searchParams.get("v");
    } catch {
        return null;
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nome, link } = body;

        if (!nome || !link) {
            return NextResponse.json(
                { error: "Nome e link são obrigatórios" },
                { status: 400 }
            );
        }

        const youtubeId = getYoutubeId(link);

        if (!youtubeId) {
            return NextResponse.json(
                { error: "Link do YouTube inválido" },
                { status: 400 }
            );
        }

        const novaMusica = {
            id: Date.now(),
            nome,
            link,
            youtubeId,
            status: "waiting",
        };

        await kv.rpush("queue", novaMusica);
        return NextResponse.json({
            success: true,
            musica: novaMusica,
        });
    } catch (error) {
        console.error("Erro em /api/add:", error);

        return NextResponse.json(
            { error: "Erro ao adicionar música." },
            { status: 500 }
        );
    }
}