import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "queue.json");

export async function POST() {

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (data.queue.length === 0) {
        return NextResponse.json({
            error: "Fila vazia"
        });
    }

    const proxima = data.queue.shift();

    data.current = proxima;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json(data);
}