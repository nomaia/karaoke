import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getYoutubeId(url: string) {
    try {
        const u = new URL(url);

        if (u.hostname.includes("youtu.be")) {
            return u.pathname.replace("/", "");
        }

        return u.searchParams.get("v");

    } catch {
        return null;
    }
}

export async function POST(req: Request) {

    const body = await req.json();
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
            { error: "Link inválido" },
            { status: 400 }
        );
    }

    const musica = {
        id: Date.now(),
        nome,
        link,
        youtubeId
    };

    await kv.rpush("queue", JSON.stringify(musica));

    return NextResponse.json({
        success: true
    });

}