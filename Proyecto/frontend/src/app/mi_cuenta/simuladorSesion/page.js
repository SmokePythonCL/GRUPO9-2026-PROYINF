"use client";

import LoanSimulator from "@/components/simulador";

export default function SimuladorSesionPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Simula tu préstamo antes de solicitarlo
        </h2>

        <LoanSimulator redirectTo="/solicitar" />
      </main>
    </div>
  );
}
