"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/lib/api";
import SessionLinks from "@/components/SessionLinks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Registro() {
  const router = useRouter();

  useEffect(() => {
    try { if (window.feather && typeof window.feather.replace === "function") window.feather.replace(); } catch (e) {}
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      nombre: form.get('nombre'),
      apellido_paterno: form.get('apellido_paterno'),
      apellido_materno: form.get('apellido_materno'),
      nacimiento: form.get('nacimiento'),
      rut: form.get('rut'),
      password: form.get('password'),
      email: form.get('email'),
    };
    try {
      const { token } = await register(payload);
      localStorage.setItem('token', token);
      router.push('/registro/documentos');
    } catch (err) {
      alert(err?.response?.data?.error || 'Error al registrar');
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <main className="min-h-screen flex items-center justify-center py-12">
        <div className="w-full max-w-md mx-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-amber-500 py-4 px-6 text-center">
              <h2 className="text-2xl font-bold text-white">Registro</h2>
            </div>
            <div className="p-8">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Nombre</label>
                  <input name="nombre" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Apellido paterno</label>
                    <input name="apellido_paterno" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Apellido materno</label>
                    <input name="apellido_materno" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Fecha de nacimiento</label>
                  <input type="date" name="nacimiento" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">RUT</label>
                  <input name="rut" className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="12345678-9" required />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Correo</label>
                  <input type="email" name="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Contraseña</label>
                  <input type="password" name="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-bold transition duration-300 shadow-md">Continuar</button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
