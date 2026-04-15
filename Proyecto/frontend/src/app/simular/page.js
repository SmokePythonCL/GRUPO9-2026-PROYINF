"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoanSimulator from "@/components/simulador";

export default function SimularPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Simula tu préstamo antes de solicitarlo
        </h2>

        <LoanSimulator redirectTo="/solicitar" />
      </main>

      <Footer />
    </div>
  );
}
