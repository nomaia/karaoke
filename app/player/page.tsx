"use client";

import { useEffect, useState } from "react";

type Musica = {
    id: number;
    nome: string;
    link: string;
    youtubeId: string;
    status: string;
};

export default function Player() {

    const [fila, setFila] = useState<Musica[]>([]);

    async function carregarFila() {

        const res = await fetch("/api/queue", {
            cache: "no-store"
        });

        const data = await res.json();
        setFila(data.queue);

    }

    async function iniciarProxima() {

        if (fila.length === 0) return;

        const musica = fila[0];

        // abre youtube
        window.open(musica.link, "_blank");

        // remove da fila
        await fetch("/api/next", {
            method: "POST"
        });

        carregarFila();

    }

    useEffect(() => {

        carregarFila();

        const intervalo = setInterval(() => {
            carregarFila();
        }, 3000);

        return () => clearInterval(intervalo);

    }, []);

    const proxima = fila[0];
    const restante = fila.slice(1);

    return (
        <main style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>

            <h1>🎤 Painel do Karaoke</h1>

            {!proxima && <p>Ninguém na fila.</p>}

            {proxima && (
                <div style={{
                    border: "2px solid #ddd",
                    padding: 20,
                    borderRadius: 12,
                    marginTop: 20
                }}>

                    <h2>Próximo a cantar</h2>

                    <div style={{
                        display: "flex",
                        gap: 20,
                        alignItems: "center"
                    }}>

                        <img
                            src={`https://img.youtube.com/vi/${proxima.youtubeId}/hqdefault.jpg`}
                            style={{ width: 200, borderRadius: 10 }}
                        />

                        <div>
                            <h3 style={{ margin: 0 }}>{proxima.nome}</h3>

                            <button
                                onClick={iniciarProxima}
                                style={{
                                    marginTop: 10,
                                    padding: 14,
                                    fontSize: 18,
                                    cursor: "pointer"
                                }}
                            >
                                ▶ Iniciar música
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {restante.length > 0 && (
                <div style={{ marginTop: 40 }}>

                    <h2>Fila</h2>

                    {restante.map((musica, index) => (

                        <div
                            key={musica.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                marginBottom: 12,
                                padding: 12,
                                border: "1px solid #eee",
                                borderRadius: 10
                            }}
                        >

                            <img
                                src={`https://img.youtube.com/vi/${musica.youtubeId}/default.jpg`}
                                style={{ width: 80 }}
                            />

                            <span>{index + 2}. {musica.nome}</span>

                        </div>

                    ))}

                </div>
            )}

        </main>
    );
}