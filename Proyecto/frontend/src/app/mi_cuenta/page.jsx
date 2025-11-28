"use client";

import { useEffect } from "react";
import Chart from "chart.js/auto";
import feather from "feather-icons";

export default function MiCuentaPage() {

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
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Resumen de pagos</h3>

      <div style={{ height: "300px" }}>
        <canvas id="paymentChart"></canvas>
      </div>
    </div>
  );
}
