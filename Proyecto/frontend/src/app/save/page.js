"use client";
import { useState } from "react";

export default function SaveMessagePage() {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: "¡Mensaje guardado exitosamente!" });
        setContent("");
      } else {
        setStatus({ type: "error", message: data.error || "Error al guardar." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Error de red o servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-blue-50 py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-amber-100">
        <h1 className="text-3xl font-bold text-amber-600 mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2M15 3h-6a2 2 0 00-2 2v3a2 2 0 002 2h6a2 2 0 002-2V5a2 2 0 00-2-2z" /></svg>
          Guardar Mensaje
        </h1>
        <p className="text-gray-500 mb-6">Ingresa un mensaje y guárdalo en la base de datos PostgreSQL.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full border border-amber-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-700 min-h-[80px] resize-none"
            placeholder="Escribe tu mensaje aquí..."
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            maxLength={255}
            disabled={loading}
          />
          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-bold transition duration-300 shadow-md disabled:opacity-60"
            disabled={loading || !content.trim()}
          >
            {loading ? "Guardando..." : "Guardar mensaje"}
          </button>
        </form>
        {status && (
          <div className={`mt-4 text-center rounded-lg p-3 ${status.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {status.message}
          </div>
        )}
      </div>
    </main>
  );
}