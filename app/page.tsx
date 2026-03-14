"use client";

import { useState } from "react";

export default function Home() {

    const [nome, setNome] = useState("");
    const [link, setLink] = useState("");
    const [mensagem, setMensagem] = useState("");

    async function adicionarMusica(e: React.FormEvent) {
        e.preventDefault();

        const resposta = await fetch("/api/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: nome,
                link: link
            })
        });

        const data = await resposta.json();

        if (resposta.ok) {
            setMensagem("🎶 Música adicionada à fila!");
            setNome("");
            setLink("");
        } else {
            setMensagem(data.error || "Erro ao adicionar música.");
        }
    }

    return (
        <main style={{ padding: 40, maxWidth: 600 }}>

            <h1>🎤 Karaoke Queue</h1>
            <p>Entre na fila para cantar!</p>

            <form onSubmit={adicionarMusica}>

                <div style={{ marginTop: 20 }}>
                    <input
                        placeholder="Seu nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        style={{ width: "100%", padding: 10 }}
                    />
                </div>

                <div style={{ marginTop: 10 }}>
                    <input
                        placeholder="Link do YouTube (karaoke)"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        style={{ width: "100%", padding: 10 }}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        marginTop: 15,
                        padding: 12,
                        fontSize: 16,
                        cursor: "pointer"
                    }}
                >
                    Entrar na fila 🎶
                </button>

            </form>

            {mensagem && (
                <p style={{ marginTop: 20 }}>{mensagem}</p>
            )}

        </main>
    );
}