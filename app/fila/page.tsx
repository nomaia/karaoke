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
    const [loading, setLoading] = useState(true);

    async function carregarFila() {
        try {
            const res = await fetch("/api/queue?t=" + Date.now(), {
                cache: "no-store",
            });

            if (!res.ok) {
                console.error("Erro ao buscar fila");
                return;
            }

            const data = await res.json();

            if (data?.queue) {
                setFila(data.queue);
            }
        } catch (error) {
            console.error("Erro ao carregar fila:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarFila();

        const interval = setInterval(() => {
            carregarFila();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    async function remover(id: number) {
        try {
            await fetch("/api/remove", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            carregarFila();
        } catch (error) {
            console.error("Erro ao remover música:", error);
        }
    }

    return (
        <main style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
            <h1>🎶 Fila do Karaoke</h1>
            <p>Acompanhe a ordem das próximas músicas.</p>

            {loading && <p>Carregando fila...</p>}

            {!loading && fila.length === 0 && <p>Ninguém na fila ainda.</p>}

            <div style={{ marginTop: 30 }}>
                {fila.map((musica, index) => (
                    <div
                        key={musica.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            padding: 16,
                            marginBottom: 16,
                            border: "1px solid #ddd",
                            borderRadius: 12,
                        }}
                    >
                        <img
                            src={`https://img.youtube.com/vi/${musica.youtubeId}/hqdefault.jpg`}
                            alt={`Thumbnail da música ${musica.nome}`}
                            style={{
                                width: 160,
                                borderRadius: 10,
                            }}
                        />

                        <div style={{ flex: 1 }}>
                            <h2 style={{ margin: 0, fontSize: 22 }}>
                                {index + 1}. {musica.nome}
                            </h2>

                            <div style={{ marginTop: 10 }}>
                                <a
                                    href={musica.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: "inline-block",
                                        padding: "10px 14px",
                                        backgroundColor: "#cc0000",
                                        color: "#fff",
                                        textDecoration: "none",
                                        borderRadius: 8,
                                        marginRight: 10,
                                    }}
                                >
                                    ▶ Abrir no YouTube
                                </a>

                                <button
                                    onClick={() => remover(musica.id)}
                                    style={{
                                        padding: "10px 14px",
                                        backgroundColor: "#444",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: 8,
                                        cursor: "pointer",
                                    }}
                                >
                                    ❌ Remover
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}