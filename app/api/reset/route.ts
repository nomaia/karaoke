import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET() {

    await kv.del("queue");

    return NextResponse.json({
        ok: true,
        message: "Fila apagada"
    });

}