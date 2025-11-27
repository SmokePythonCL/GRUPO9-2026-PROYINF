"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MiCuenta() {
  const router = useRouter();

  useEffect(() => {
    try { if (window.feather && typeof window.feather.replace === "function") window.feather.replace(); } catch (e) {}
    // Protección de ruta: requiere token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/login');
    }
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Mi cuenta</h2>
          <p className="text-gray-600">Bienvenido. Aquí encontrarás el resumen de tus préstamos y pagos.</p>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">Documentos pendientes</h3>
            <p className="text-gray-600 mb-4">Para acelerar futuras solicitudes de préstamo, sube tus documentos una sola vez.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link href="/registro/documentos" className="w-full text-center bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-bold transition duration-300 shadow-md">Subir documentos</Link>
              <Link href="/registro/documentos" className="w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-bold transition duration-300 shadow-md">Actualizar documentos</Link>
            </div>
            <p className="mt-2 text-sm text-gray-600">Aceptados: carnet (frontal/trasera) y comprobante de domicilio (imagen o PDF).</p>
          </div>

          <div className="mt-6">
            <Link href="/" className="text-amber-500">Volver al inicio</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
