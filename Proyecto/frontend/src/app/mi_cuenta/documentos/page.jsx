"use client";

import { useEffect, useState } from "react";
import { getUserDocuments } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function DocumentosPage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const list = await getUserDocuments();
        setDocs(Array.isArray(list) ? list : []);
      } catch (e) {
        setError("No se pudieron cargar tus documentos. ¿Estás autenticado?");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Mis documentos</h1>

        {loading && <p className="text-gray-600">Cargando…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          docs.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm divide-y">
              {docs.map((d) => {
                const href = d.file_path || "";
                const url = href.startsWith("http") ? href : `${BASE_URL}${href}`;
                return (
                  <div key={d.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800 capitalize">{(d.doc_type || d.tipo || "documento").replace(/_/g, " ")}</p>
                      {d.created_at && (
                        <p className="text-sm text-gray-500">Subido: {new Date(d.created_at).toLocaleString()}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded bg-amber-500 text-white hover:bg-amber-600"
                      >
                        Ver
                      </a>
                      <a
                        href={url}
                        download
                        className="px-3 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                      >
                        Descargar
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-700">No tienes documentos subidos aún.</p>
              <a href="/registro/documentos" className="inline-block mt-3 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded">Subir documentos</a>
            </div>
          )
        )}

        <div className="mt-6">
          <a href="/mi_cuenta" className="text-amber-600 hover:underline">Volver a Mi Cuenta</a>
        </div>
      </main>
    </div>
  );
}
