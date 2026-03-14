import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "queue.json");

export async function POST(request: Request) {

    const body = await request.json();
    const { id } = body;

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    data.queue = data.queue.filter((musica: any) => musica.id !== id);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({
        message: "Música removida da fila"
    });

}