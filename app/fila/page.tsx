"use client";

import { useEffect, useState } from "react";

type Musica = {
    id: number;
    nome: string;
    link: string;
    youtubeId: string;
};

export default function Fila() {

    const [fila, setFila] = useState<Musica[]>([]);

    async function carregarFila() {

        const res = await fetch("/api/queue", {
            cache: "no-store"
        });

        const data = await res.json();

        setFila(data.queue);

    }

    useEffect(() => {

        carregarFila();

        const interval = setInterval(carregarFila, 2000);

        return () => clearInterval(interval);

    }, []);

    async function remover(id: number) {

        await fetch("/api/remove", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
        });

        carregarFila();

    }

    return (
        <main style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>

            <h1>🎶 Fila do Karaoke</h1>

            {fila.length === 0 && <p>Ninguém na fila ainda.</p>}

            {fila.map((musica, index) => (

                <div
                    key={musica.id}
                    style={{
                        display: "flex",
                        gap: 20,
                        padding: 20,
                        marginBottom: 20,
                        border: "1px solid #ddd",
                        borderRadius: 10
                    }}
                >

                    <img
                        src={`https://img.youtube.com/vi/${musica.youtubeId}/hqdefault.jpg`}
                        width={160}
                    />

                    <div>

                        <h2>
                            {index + 1}. {musica.nome}
                        </h2>

                        <a
                            href={musica.link}
                            target="_blank"
                        >
                            ▶ Abrir no YouTube
                        </a>

                        <br />

                        <button
                            onClick={() => remover(musica.id)}
                        >
                            ❌ Remover
                        </button>

                    </div>

                </div>

            ))}

        </main>
    );
}