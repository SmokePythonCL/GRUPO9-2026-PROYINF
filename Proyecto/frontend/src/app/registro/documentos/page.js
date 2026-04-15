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
  const [files, setFiles] = useState({
    carnet_frontal: null,
    carnet_trasera: null,
    comprobante_domicilio: null
  });

  function getDocumentStatus(documentValue) {
    if (!documentValue) {
      return {
        label: "No cargado",
        tone: "bg-red-100 text-red-700",
        detail: "Debes subir este documento para continuar",
      };
    }
    return {
      label: "Recién cargado",
      tone: "bg-amber-100 text-amber-700",
      detail: documentValue.name || "Archivo seleccionado",
    };
  }

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
    setFiles(prev => ({ ...prev, [name]: file || null }));
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
                <div className="space-y-6">
                  {/* Carnet Frontal */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center">
                      {(() => {
                        const status = getDocumentStatus(files.carnet_frontal);
                        return (
                          <span className={`mb-3 text-xs font-semibold px-3 py-1 rounded-full ${status.tone}`}>
                            {status.label}
                          </span>
                        );
                      })()}
                      <i data-feather="file-text" className="w-12 h-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Cédula de identidad (frente)</h3>
                      <p className="text-sm text-gray-600 mb-3">{getDocumentStatus(files.carnet_frontal).detail}</p>
                      <input type="file" id="carnet_frontal" name="carnet_frontal" className="hidden" accept="image/*,.pdf" onChange={(e)=>onFileChange('carnet_frontal', e.target.files[0])} />
                      <button type="button" onClick={()=>document.getElementById('carnet_frontal').click()} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg mb-4">
                        {files.carnet_frontal ? "Reemplazar archivo" : "Seleccionar archivo"}
                      </button>
                      {preview.carnet_frontal && <img src={preview.carnet_frontal} alt="frontal" className="max-h-32 rounded object-contain" />}
                    </div>
                  </div>

                  {/* Carnet Trasera */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center">
                      {(() => {
                        const status = getDocumentStatus(files.carnet_trasera);
                        return (
                          <span className={`mb-3 text-xs font-semibold px-3 py-1 rounded-full ${status.tone}`}>
                            {status.label}
                          </span>
                        );
                      })()}
                      <i data-feather="file-text" className="w-12 h-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Cédula de identidad (reverso)</h3>
                      <p className="text-sm text-gray-600 mb-3">{getDocumentStatus(files.carnet_trasera).detail}</p>
                      <input type="file" id="carnet_trasera" name="carnet_trasera" className="hidden" accept="image/*,.pdf" onChange={(e)=>onFileChange('carnet_trasera', e.target.files[0])} />
                      <button type="button" onClick={()=>document.getElementById('carnet_trasera').click()} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg mb-4">
                        {files.carnet_trasera ? "Reemplazar archivo" : "Seleccionar archivo"}
                      </button>
                      {preview.carnet_trasera && <img src={preview.carnet_trasera} alt="trasera" className="max-h-32 rounded object-contain" />}
                    </div>
                  </div>

                  {/* Comprobante Domicilio */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center">
                      {(() => {
                        const status = getDocumentStatus(files.comprobante_domicilio);
                        return (
                          <span className={`mb-3 text-xs font-semibold px-3 py-1 rounded-full ${status.tone}`}>
                            {status.label}
                          </span>
                        );
                      })()}
                      <i data-feather="file-text" className="w-12 h-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Comprobante de domicilio</h3>
                      <p className="text-sm text-gray-600 mb-3">{getDocumentStatus(files.comprobante_domicilio).detail}</p>
                      <input type="file" id="comprobante_domicilio" name="comprobante_domicilio" className="hidden" accept="image/*,.pdf" onChange={(e)=>onFileChange('comprobante_domicilio', e.target.files[0])} />
                      <button type="button" onClick={()=>document.getElementById('comprobante_domicilio').click()} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg">
                        {files.comprobante_domicilio ? "Reemplazar archivo" : "Seleccionar archivo"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4">
                  <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-lg font-bold transition duration-300 shadow-md">Finalizar y enviar documentos</button>
                  <button type="button" onClick={()=>router.push('/mi_cuenta')} className="w-full text-gray-500 hover:text-gray-700 font-medium transition duration-300">Saltar por ahora y subir más tarde</button>
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
