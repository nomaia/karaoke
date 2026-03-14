import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";

export async function GET() {
    try {

        await kv.del("queue");

        return NextResponse.json({
            success: true,
            message: "Fila apagada com sucesso."
        });

    } catch (error) {

        console.error("Erro ao resetar fila:", error);

        return NextResponse.json(
            { error: "Erro ao limpar fila." },
            { status: 500 }
        );
    }
}