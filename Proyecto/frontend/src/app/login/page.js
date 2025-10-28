"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    try { if (window.feather && typeof window.feather.replace === "function") window.feather.replace(); } catch (e) {}
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: replace by real auth
    router.push('/mi_cuenta');
  }

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
            <Link href="/como_funciona" className="text-gray-600 hover:text-amber-500 font-medium">Cómo funciona</Link>
            <Link href="/beneficios" className="text-gray-600 hover:text-amber-500 font-medium">Beneficios</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/solicitar" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition duration-300 shadow-md">Solicitar préstamo</Link>
          </div>
        </div>
      </header>

      <main className="min-h-screen flex items-center justify-center py-12">
        <div className="w-full max-w-md mx-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-amber-500 py-4 px-6 text-center">
              <h2 className="text-2xl font-bold text-white">Iniciar sesión</h2>
            </div>
            <div className="p-8">
              <form id="login-form" onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Correo electrónico</label>
                  <input type="email" id="email" name="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="tu@email.com" required />
                </div>
                <div className="mb-6">
                  <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Contraseña</label>
                  <input type="password" id="password" name="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="••••••••" required />
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <input type="checkbox" id="remember" name="remember" className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded" />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Recordarme</label>
                  </div>
                  <a href="#" className="text-sm text-amber-500 hover:text-amber-600">¿Olvidaste tu contraseña?</a>
                </div>
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-bold transition duration-300 shadow-md mb-4">Ingresar</button>
                <div className="text-center text-sm text-gray-600">¿No tienes cuenta? <a href="#" className="text-amber-500 hover:text-amber-600 font-medium">Regístrate</a></div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-400">© 2023 FlashLoan. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
