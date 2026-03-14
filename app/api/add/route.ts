import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

function getYoutubeId(url: string) {
    try {
        const parsed = new URL(url);
        return parsed.searchParams.get("v");
    } catch {
        return null;
    }
}

export async function POST(request: Request) {
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

    await kv.rpush("queue", JSON.stringify(novaMusica));

    return NextResponse.json({
        success: true,
        musica: novaMusica,
    });
}