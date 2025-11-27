"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { uploadDocuments } from "@/lib/api";
import SessionLinks from "@/components/SessionLinks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Documentos() {
  const router = useRouter();
  const [preview, setPreview] = useState({});

  useEffect(() => {
    try { if (window.feather && typeof window.feather.replace === "function") window.feather.replace(); } catch (e) {}
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData();
    const f1 = e.currentTarget.carnet_frontal.files[0];
    const f2 = e.currentTarget.carnet_trasera.files[0];
    const f3 = e.currentTarget.comprobante_domicilio.files[0];
    if (f1) form.append('carnet_frontal', f1);
    if (f2) form.append('carnet_trasera', f2);
    if (f3) form.append('comprobante_domicilio', f3);
    try {
      await uploadDocuments(form);
      router.push('/mi_cuenta');
    } catch (err) {
      alert('Error al subir documentos');
    }
  }

  function onFileChange(name, file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(p => ({ ...p, [name]: url }));
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <main className="min-h-screen flex items-center justify-center py-12">
        <div className="w-full max-w-2xl mx-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-amber-500 py-4 px-6 text-center">
              <h2 className="text-2xl font-bold text-white">Subir documentos</h2>
            </div>
            <div className="p-8">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Carnet frontal</label>
                    <input type="file" name="carnet_frontal" accept="image/*" className="w-full" onChange={(e)=>onFileChange('carnet_frontal', e.target.files[0])} />
                    {preview.carnet_frontal && <img src={preview.carnet_frontal} alt="frontal" className="mt-2 rounded" />}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Carnet trasera</label>
                    <input type="file" name="carnet_trasera" accept="image/*" className="w-full" onChange={(e)=>onFileChange('carnet_trasera', e.target.files[0])} />
                    {preview.carnet_trasera && <img src={preview.carnet_trasera} alt="trasera" className="mt-2 rounded" />}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Comprobante de domicilio</label>
                    <input type="file" name="comprobante_domicilio" accept="image/*,.pdf" className="w-full" onChange={(e)=>onFileChange('comprobante_domicilio', e.target.files[0])} />
                    {preview.comprobante_domicilio && <span className="text-sm text-gray-600">Archivo seleccionado</span>}
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-bold transition duration-300 shadow-md">Finalizar</button>
                  <button type="button" onClick={()=>router.push('/mi_cuenta')} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-bold transition duration-300 shadow-md">Saltar por ahora</button>
                </div>
                <p className="mt-3 text-sm text-gray-600 text-center">Podrás subir estos documentos más tarde desde <Link href="/mi_cuenta" className="text-amber-600 hover:underline">Mi Cuenta</Link>.</p>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
