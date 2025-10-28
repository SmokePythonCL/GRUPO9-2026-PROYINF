"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ComoFunciona() {
  useEffect(() => {
    try {
      if (window.feather && typeof window.feather.replace === "function") window.feather.replace();
    } catch (e) {}
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white bg-opacity-90 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-amber-500 p-2 rounded-lg">
              <i data-feather="zap" className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Flash<span className="text-amber-500">Loan</span></h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-amber-500 font-medium">Inicio</Link>
            <Link href="/como_funciona" className="text-amber-500 font-medium">Cómo funciona</Link>
            <Link href="/beneficios" className="text-gray-600 hover:text-amber-500 font-medium">Beneficios</Link>
            <a href="#" className="text-gray-600 hover:text-amber-500 font-medium">FAQ</a>
            <Link href="/solicitar" className="text-gray-600 hover:text-amber-500 font-medium">Solicitar Préstamo</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="hidden md:block px-4 py-2 text-gray-600 hover:text-amber-500">
              <i data-feather="user" />
            </Link>
            <Link href="/solicitar" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition duration-300 shadow-md">Solicitar préstamo</Link>
            <button className="md:hidden"><i data-feather="menu" /></button>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-r from-amber-500 to-amber-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">¿Cómo funciona FlashLoan?</h1>
          <p className="text-xl max-w-3xl mx-auto">Obtén dinero rápido en solo 3 sencillos pasos, completamente online y sin papeleos.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl step-card shadow-sm">
              <div className="bg-amber-500 w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">1</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Simula tu préstamo</h3>
              <p className="text-gray-600 mb-6">Usa nuestro simulador interactivo para elegir el monto y plazo que mejor se adapte a tus necesidades.</p>
              <div className="flex justify-center">
                <Image src="http://static.photos/technology/640x360/101" alt="Simulación" width={640} height={360} className="rounded-lg w-full h-48 object-cover" unoptimized />
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl step-card shadow-sm">
              <div className="bg-amber-500 w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">2</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Completa tu solicitud</h3>
              <p className="text-gray-600 mb-6">Sube foto de tu cédula y nuestro sistema rellenará automáticamente tus datos. Firma digitalmente.</p>
              <div className="flex justify-center">
                <Image src="http://static.photos/technology/640x360/102" alt="Formulario" width={640} height={360} className="rounded-lg w-full h-48 object-cover" unoptimized />
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl step-card shadow-sm">
              <div className="bg-amber-500 w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">3</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Recibe tu dinero</h3>
              <p className="text-gray-600 mb-6">En solo 5 minutos tendrás el dinero depositado en tu cuenta bancaria, sin esperas ni trámites.</p>
              <div className="flex justify-center">
                <Image src="http://static.photos/finance/640x360/103" alt="Dinero" width={640} height={360} className="rounded-lg w-full h-48 object-cover" unoptimized />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Nuestra tecnología</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Lo que hace único a FlashLoan</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <i data-feather="zap" className="text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">OCR Avanzado</h3>
              <p className="text-gray-600">Extraemos automáticamente los datos de tu cédula para ahorrarte tiempo y errores.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <i data-feather="shield" className="text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Encriptación AES-256</h3>
              <p className="text-gray-600">Tus datos están protegidos con los más altos estándares de seguridad.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <i data-feather="clock" className="text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Aprobación en 5 minutos</h3>
              <p className="text-gray-600">Nuestro algoritmo de scoring crediticio trabaja en tiempo real.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto bg-amber-50 rounded-xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">¿Listo para solicitar tu préstamo?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Comienza ahora y recibe tu dinero en solo 5 minutos.</p>
            <Link href="/solicitar" className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-bold transition duration-300 shadow-lg">
              <i data-feather="zap" className="inline mr-2" /> Solicitar ahora
            </Link>
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
                <h3 className="text-xl font-bold">Flash<span className="text-amber-500">Loan</span></h3>
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
            <p>© 2023 FlashLoan. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
