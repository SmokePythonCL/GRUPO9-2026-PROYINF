"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api";
import SessionLinks from "@/components/SessionLinks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    // Si ya hay sesión, redirigimos a mi cuenta
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      router.replace('/mi_cuenta');
    }
  }, [router]);

  useEffect(() => {
    try { if (window.feather && typeof window.feather.replace === "function") window.feather.replace(); } catch (e) {}
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get('email');
    const password = form.get('password');

    try {
      const { token, user } = await login(email, password);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      router.push('/mi_cuenta');
    } catch (err) {
      alert('Credenciales inválidas');
    }
  }


  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

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
                <div className="text-center text-sm text-gray-600">¿No tienes cuenta? <Link href="/registro" className="text-amber-500 hover:text-amber-600 font-medium">Regístrate</Link></div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
