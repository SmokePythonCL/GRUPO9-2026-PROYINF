"use client";

import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import feather from "feather-icons";
import { getUserDocuments } from "@/lib/api";

export default function MiCuentaPage() {
  const [docs, setDocs] = useState([]);
  const required = ["carnet_frontal", "carnet_trasera", "comprobante_domicilio"];

  useEffect(() => {
    feather.replace();

    const ctx = document.getElementById("paymentChart");
    if (ctx) {
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Oct", "Nov", "Dic", "Ene", "Feb", "Mar"],
          datasets: [
            {
              label: "Pagos realizados",
              data: [500000, 450000, 450000, 0, 0, 0],
            },
          ],
        },
      });
    }

    // Cargar documentos
    (async () => {
      try {
        const list = await getUserDocuments();
        setDocs(list || []);
      } catch (e) {
        // Ignorar error en UI, podría no estar autenticado
      }
    })();
  }, []);

  const present = new Set(docs.map(d => d.tipo));
  const pending = required.filter(r => !present.has(r));

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-5xl mx-auto px-4 py-8 grid gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Resumen de pagos</h3>
          <div style={{ height: "300px" }}>
            <canvas id="paymentChart"></canvas>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Documentos</h3>
          <p className="text-gray-600 mb-4">
            Gestiona tu carnet y comprobante de domicilio. {pending.length > 0 ? `Pendientes: ${pending.length}` : 'Todo al día.'}
          </p>
          <div className="flex gap-3">
            <a href="/registro/documentos" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded">Subir/gestionar documentos</a>
            <a href="/mi_cuenta/documentos" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">Ver mis documentos</a>
          </div>
        </div>
      </main>
    </div>
  );
}
