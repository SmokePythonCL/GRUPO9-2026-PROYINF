"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function MiCuenta() {
  useEffect(() => {
    try { if (window.feather && typeof window.feather.replace === "function") window.feather.replace(); } catch (e) {}
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white bg-opacity-90 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-amber-500 p-2 rounded-lg">
              <i data-feather="zap" className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Prestamo<span className="text-amber-500">CL</span></h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-amber-500 font-medium">Inicio</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Mi cuenta</h2>
          <p className="text-gray-600">Bienvenido. Aquí encontrarás el resumen de tus préstamos y pagos.</p>
          <div className="mt-6">
            <Link href="/" className="text-amber-500">Volver al inicio</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
