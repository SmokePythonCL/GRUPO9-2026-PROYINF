"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SessionLinks from "@/components/SessionLinks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Beneficios() {
  useEffect(() => {
    const loadScript = (src) => new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = () => reject(new Error("Failed to load " + src));
      document.head.appendChild(s);
    });

    (async () => {
      try {
        if (!window.feather) await loadScript("https://unpkg.com/feather-icons");
        if (window.feather && typeof window.feather.replace === "function") window.feather.replace();
      } catch (e) {}
    })();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header active="beneficios" />

      <section className="bg-gradient-to-r from-amber-500 to-amber-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Beneficios PrestamoCL</h1>
          <p className="text-xl max-w-3xl mx-auto">Ventajas exclusivas para nuestros clientes</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Por qué elegir PrestamoCL</h2>
              <p className="text-gray-600 mb-6">En PrestamoCL nos preocupamos por ofrecerte la mejor experiencia financiera, con beneficios pensados para ti.</p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <i data-feather="check" className="text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">Las tasas más competitivas del mercado</span>
                </li>
                <li className="flex items-start">
                  <i data-feather="check" className="text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">Proceso 100% digital sin papeleos</span>
                </li>
                <li className="flex items-start">
                  <i data-feather="check" className="text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">Atención personalizada 24/7</span>
                </li>
              </ul>
            </div>
            <div className="flex justify-center">
              <Image src="http://static.photos/finance/640x360/201" alt="Beneficios" width={640} height={360} className="rounded-lg w-full max-w-md h-auto object-cover shadow-lg" unoptimized />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl benefit-card shadow-sm">
              <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-white mb-4">
                <i data-feather="dollar-sign" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Tasas preferenciales</h3>
              <p className="text-gray-600 mb-4">Accede a tasas de interés más bajas que en la banca tradicional.</p>
              <div className="text-sm text-blue-500 font-medium">Desde 0.9% mensual</div>
            </div>
            {/* other benefit cards omitted for brevity */}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">¿Qué esperas para unirte?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Comienza ahora y disfruta de todos estos beneficios.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/login" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-bold transition duration-300"> <i data-feather="user" className="inline mr-2" /> Crear cuenta</Link>
          </div>
            <div className="flex justify-center">
              <Link href="/solicitar" className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-bold transition duration-300 shadow-lg"> 
                <i data-feather="zap" className="inline mr-2" /> Solicitar préstamo
              </Link>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
