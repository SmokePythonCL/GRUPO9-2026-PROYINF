"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Beneficios() {
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
            <Link href="/" className="text-gray-600 hover:text-amber-500 font-medium">Inicio</Link>
            <Link href="/como_funciona" className="text-gray-600 hover:text-amber-500 font-medium">Cómo funciona</Link>
            <Link href="/beneficios" className="text-amber-500 font-medium">Beneficios</Link>
            <a href="#" className="text-gray-600 hover:text-amber-500 font-medium">FAQ</a>
            <Link href="/solicitar" className="text-gray-600 hover:text-amber-500 font-medium">Solicitar Préstamo</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="hidden md:block px-4 py-2 text-gray-600 hover:text-amber-500"><i data-feather="user" /></Link>
            <Link href="/solicitar" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition duration-300 shadow-md">Solicitar préstamo</Link>
            <button className="md:hidden"><i data-feather="menu" /></button>
          </div>
        </div>
      </header>

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
            <Link href="/solicitar" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold transition duration-300 shadow-lg"> <i data-feather="zap" className="inline mr-2" /> Solicitar préstamo</Link>
            <Link href="/login" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-bold transition duration-300"> <i data-feather="user" className="inline mr-2" /> Crear cuenta</Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-amber-500 p-2 rounded-lg">
                  <i data-feather="zap" className="text-white" />
                </div>
                <h3 className="text-xl font-bold">Prestamo<span className="text-amber-500">CL</span></h3>
              </div>
              <p className="text-gray-400 mb-4">La forma más rápida y sencilla de obtener dinero cuando lo necesites.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Enlaces útiles</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Inicio</Link></li>
                <li><Link href="/como_funciona" className="text-gray-400 hover:text-white">Cómo funciona</Link></li>
                <li><Link href="/beneficios" className="text-gray-400 hover:text-white">Beneficios</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Términos y condiciones</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contacto</h4>
              <ul className="space-y-2">
                <li className="flex items-center"><i data-feather="mail" className="text-gray-400 mr-2" /> hola@flashloan.cl</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 PrestamoCL. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
