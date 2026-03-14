import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "queue.json");

function getYoutubeId(url: string) {

    try {

        const parsed = new URL(url);

        return parsed.searchParams.get("v");

    } catch {

        return null;

    }

}

async function getVideoTitle(youtubeId: string) {

    try {

        const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`);

        const data = await response.json();

        return data.title;

    } catch {

        return "Vídeo do YouTube";

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

    const titulo = await getVideoTitle(youtubeId);

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const novaMusica = {
        id: Date.now(),
        nome,
        titulo,
        link,
        youtubeId,
        status: "waiting"
    };

    data.queue.push(novaMusica);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({
        message: "Música adicionada à fila",
        musica: novaMusica
    });

}