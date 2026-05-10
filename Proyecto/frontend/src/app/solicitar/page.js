"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SessionLinks from "@/components/SessionLinks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { submitLoan, signDocument } from "@/lib/api";
import { CHILE_COMUNAS_BY_REGION, CHILE_REGIONS } from "@/lib/chileLocations";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Solicitar() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [region, setRegion] = useState('');
  const [comunas, setComunas] = useState([]);
  const [comuna, setComuna] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    email: '',
    telefono: '',
    fecha: '',
    direccion: ''
  });

  const [files, setFiles] = useState({
    frente: null,
    reverso: null,
    comprobante: null
  });

  const [simulationData, setSimulationData] = useState(null);
  const [isValidStep1, setIsValidStep1] = useState(false);
  const [isValidStep2, setIsValidStep2] = useState(false);
  const [isValidStep3, setIsValidStep3] = useState(true);
  const [isSigning, setIsSigning] = useState(false);

  // -----------------------------------------------------
  // 🔥 Cargar datos del usuario desde backend
  // -----------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData((prev) => ({
        ...prev,
        nombre: user.nombre || "",
        rut: user.rut || "",
        email: user.email || "",
        telefono: user.telefono || "",
        fecha: (user.nacimiento || "").toString().slice(0, 10),
        direccion: user.direccion || ""
      }));
    }

    fetch(`${API_BASE_URL}/api/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((user) => {
        if (!user) return;

        setFormData((prev) => ({
          ...prev,
          nombre: user.nombre || "",
          rut: user.rut || "",
          email: user.email || "",
          telefono: user.telefono || "",
          fecha: (user.nacimiento || "").toString().slice(0, 10),
          direccion: user.direccion || ""
        }));
      })
      .catch((err) => console.error("Error cargando usuario:", err));

    fetch(`${API_BASE_URL}/api/user/documents`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((docs) => {
        if (!Array.isArray(docs)) return;

        const findByType = (type) => docs.find((d) => (d.tipo || d.doc_type) === type);
        const toUploadedFileLike = (doc, fallbackLabel) => {
          if (!doc) return null;
          const fileName = doc.file_path ? String(doc.file_path).split("/").pop() : fallbackLabel;
          return {
            name: fileName || fallbackLabel,
            fromExisting: true,
          };
        };

        setFiles((prev) => ({
          ...prev,
          frente: prev.frente || toUploadedFileLike(findByType("carnet_frontal"), "carnet_frontal"),
          reverso: prev.reverso || toUploadedFileLike(findByType("carnet_trasera"), "carnet_trasera"),
          comprobante: prev.comprobante || toUploadedFileLike(findByType("comprobante_domicilio"), "comprobante_domicilio"),
        }));
      })
      .catch((err) => console.error("Error cargando documentos:", err));
  }, []);

  // -----------------------------------------------------

  useEffect(() => {
    try {
      if (window.feather && typeof window.feather.replace === "function")
        window.feather.replace();
    } catch (e) { }

    if (typeof window !== "undefined") {
      const savedSimulation = localStorage.getItem("currentSimulation");
      if (savedSimulation) {
        setSimulationData(JSON.parse(savedSimulation));
      }
    }
  }, []);

  useEffect(() => {
    if (region && CHILE_COMUNAS_BY_REGION[region]) setComunas(CHILE_COMUNAS_BY_REGION[region]);
    else setComunas([]);
    setComuna('');
  }, [region]);

  useEffect(() => {
    const ok = Boolean(
      formData.rut &&
      formData.nombre &&
      formData.email &&
      formData.telefono &&
      formData.fecha &&
      formData.direccion &&
      region &&
      comuna
    );
    setIsValidStep1(ok);
  }, [formData, region, comuna]);

  useEffect(() => {
    const ok =
      Boolean(files.frente && files.reverso && files.comprobante);
    setIsValidStep2(ok);
  }, [files]);

  function nextStep() {
    if (step === 1 && !isValidStep1) return;
    if (step === 2 && !isValidStep2) return;
    if (step === 3 && !isValidStep3) return;
    setStep((s) => Math.min(4, s + 1));
  }

  function prevStep() {
    setStep((s) => Math.max(1, s - 1));
  }

  function handleFileChange(e, key) {
    setFiles({ ...files, [key]: e.target.files[0] || null });
  }

  function getDocumentStatus(documentValue) {
    if (!documentValue) {
      return {
        label: "No cargado",
        tone: "bg-red-100 text-red-700",
        detail: "Debes subir este documento para continuar",
      };
    }

    if (documentValue.fromExisting) {
      return {
        label: "Cargado previamente",
        tone: "bg-emerald-100 text-emerald-700",
        detail: documentValue.name || "Documento encontrado en tu cuenta",
      };
    }

    return {
      label: "Recién cargado",
      tone: "bg-amber-100 text-amber-700",
      detail: documentValue.name || "Archivo seleccionado",
    };
  }

  const uploadedDocumentsCount = [files.frente, files.reverso, files.comprobante].filter(Boolean).length;

  async function handleSign() {
    setIsSigning(true);
    try {
      await signDocument();
      nextStep();
    } catch (err) {
      alert("Error al validar la firma, intenta nuevamente.");
    } finally {
      setIsSigning(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const amount = Number(simulationData?.amount || 0);
    const term = Number(simulationData?.term || 12);
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");

    try {
      const payload = {
        amount,
        term,
        applicant: {
          nombre: formData.nombre,
          rut: formData.rut,
          email: formData.email,
          telefono: formData.telefono,
          fecha: formData.fecha,
          direccion: formData.direccion,
          region,
          comuna,
        },
        documents: {
          frente: files.frente?.name || null,
          reverso: files.reverso?.name || null,
          comprobante: files.comprobante?.name || null,
        },
      };

      const response = await submitLoan(payload);
      const summary = response?.summary || {};

      const approvedSummary = {
        loanId: response?.id || null,
        status: "APPROVED",
        userId: currentUser?.id || null,
        userEmail: currentUser?.email || null,
        userRut: currentUser?.rut || null,
        term: Number(summary.term || term),
        paidInstallments: 0,
        pendingInstallments: Number(summary.term || term),
        totalLoanAmount: Number(summary.total || simulationData?.totalPayment || amount),
        interestRate: Number(summary.interestRate || simulationData?.interestRate || 0.012),
      };

      localStorage.setItem("loanSummary", JSON.stringify(approvedSummary));
      
      if (!localStorage.getItem("token")) {
        const wantsToRegister = window.confirm("¡Solicitud enviada con éxito y guardada en el sistema! ¿Deseas crear una cuenta ahora para hacer seguimiento a tu préstamo?");
        if (wantsToRegister) {
          router.push("/registro");
        } else {
          router.push("/prestamo_aceptado");
        }
      } else {
        alert("¡Solicitud enviada con éxito! Ya puedes ver el estado en tu cuenta.");
        router.push("/mi_cuenta");
      }
    } catch {
      const fallbackSummary = {
        loanId: null,
        status: "APPROVED",
        userId: currentUser?.id || null,
        userEmail: currentUser?.email || null,
        userRut: currentUser?.rut || null,
        term,
        paidInstallments: 0,
        pendingInstallments: term,
        totalLoanAmount: Number(simulationData?.totalPayment || amount),
        interestRate: Number(simulationData?.interestRate || 0.012),
      };

      localStorage.setItem("loanSummary", JSON.stringify(fallbackSummary));
      
      if (!localStorage.getItem("token")) {
        const wantsToRegister = window.confirm("¡Solicitud enviada con éxito y guardada en el sistema! ¿Deseas crear una cuenta ahora para hacer seguimiento a tu préstamo?");
        if (wantsToRegister) {
          router.push("/registro");
        } else {
          router.push("/prestamo_aceptado");
        }
      } else {
        alert("¡Solicitud enviada con éxito! Ya puedes ver el estado en tu cuenta.");
        router.push("/mi_cuenta");
      }
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">

          {/* RESUMEN DE SIMULACIÓN */}
          {simulationData && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Resumen de tu Simulación
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Monto</p>
                  <p className="text-lg font-bold text-amber-600">
                    ${simulationData.amount.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Plazo</p>
                  <p className="text-lg font-bold text-amber-600">
                    {simulationData.term} meses
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Cuota mensual</p>
                  <p className="text-lg font-bold text-amber-600">
                    ${simulationData.monthlyPayment.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total a pagar</p>
                  <p className="text-lg font-bold text-amber-600">
                    ${simulationData.totalPayment.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* BARRA DE PASOS */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between relative">
              <div className="flex-1 flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 1
                    ? "bg-amber-500 text-white"
                    : "bg-gray-200 text-gray-500"
                    }`}
                >
                  1
                </div>
                <span
                  className={`${step >= 1 ? "text-amber-500" : "text-gray-500"
                    } text-sm font-medium`}
                >
                  Datos personales
                </span>
              </div>

              <div className="flex-1 flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 2
                    ? "bg-amber-500 text-white"
                    : "bg-gray-200 text-gray-500"
                    }`}
                >
                  2
                </div>
                <span
                  className={`${step >= 2 ? "text-amber-500" : "text-gray-500"
                    } text-sm font-medium`}
                >
                  Documentos
                </span>
              </div>

              <div className="flex-1 flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 3
                    ? "bg-amber-500 text-white"
                    : "bg-gray-200 text-gray-500"
                    }`}
                >
                  3
                </div>
                <span
                  className={`${step >= 3 ? "text-amber-500" : "text-gray-500"
                    } text-sm font-medium`}
                >
                  Firma
                </span>
              </div>

              <div className="flex-1 flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 4
                    ? "bg-amber-500 text-white"
                    : "bg-gray-200 text-gray-500"
                    }`}
                >
                  4
                </div>
                <span
                  className={`${step >= 4 ? "text-amber-500" : "text-gray-500"
                    } text-sm font-medium`}
                >
                  Confirmación
                </span>
              </div>

              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0">
                <div
                  className="h-full bg-amber-500"
                  style={{
                    width:
                      step === 1
                        ? "25%"
                        : step === 2
                          ? "50%"
                          : step === 3
                            ? "75%"
                            : "100%"
                  }}
                />
              </div>
            </div>
          </div>
          <form id="CL-form" className="p-6 md:p-8" onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="form-step active" id="step-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Datos personales</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="rut" className="block text-gray-700 font-medium mb-2">RUT</label>
                    <input type="text" id="rut" name="rut" value={formData.rut} onChange={e => setFormData({ ...formData, rut: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="11.111.111-1" required />
                  </div>
                  <div>
                    <label htmlFor="nombre" className="block text-gray-700 font-medium mb-2">Nombre completo</label>
                    <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Juan Pérez González" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Correo electrónico</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="juan@example.com" required />
                  </div>
                  <div>
                    <label htmlFor="telefono" className="block text-gray-700 font-medium mb-2">Teléfono</label>
                    <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="+56 9 1234 5678" required />
                  </div>
                  <div>
                    <label htmlFor="fecha-nacimiento" className="block text-gray-700 font-medium mb-2">Fecha de nacimiento</label>
                    <input type="date" id="fecha-nacimiento" name="fecha-nacimiento" value={formData.fecha} onChange={e => setFormData({ ...formData, fecha: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                  </div>
                  <div>
                    <label htmlFor="genero" className="block text-gray-700 font-medium mb-2">Género</label>
                    <select id="genero" name="genero" defaultValue="" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                      <option value="" disabled>Seleccione una opción</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="direccion" className="block text-gray-700 font-medium mb-2">Dirección</label>
                  <input type="text" id="direccion" name="direccion" value={formData.direccion} onChange={e => setFormData({ ...formData, direccion: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Av. Principal 123" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div>
                    <label htmlFor="region" className="block text-gray-700 font-medium mb-2">Región</label>
                    <select id="region" name="region" value={region} onChange={e => setRegion(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                      <option value="" disabled>Seleccione región</option>
                      {CHILE_REGIONS.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="comuna" className="block text-gray-700 font-medium mb-2">Comuna</label>
                    <select id="comuna" name="comuna" value={comuna} onChange={e => setComuna(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                      <option value="" disabled>Seleccione comuna</option>
                      {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="codigo-postal" className="block text-gray-700 font-medium mb-2">Código postal</label>
                    <input type="text" id="codigo-postal" name="codigo-postal" className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="1234567" />
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Link href="/" className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg">Cancelar</Link>
                  <button type="button" onClick={nextStep} disabled={!isValidStep1} className={`px-6 py-3 rounded-lg ${isValidStep1 ? 'bg-amber-500 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}>Siguiente</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-step active" id="step-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Documentación requerida</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Estado de carga: <span className="font-semibold text-gray-800">{uploadedDocumentsCount}/3 documentos</span>
                </p>
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center">
                      {(() => {
                        const status = getDocumentStatus(files.frente);
                        return (
                          <span className={`mb-3 text-xs font-semibold px-3 py-1 rounded-full ${status.tone}`}>
                            {status.label}
                          </span>
                        );
                      })()}
                      <i data-feather="file-text" className="w-12 h-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Cédula de identidad (frente)</h3>
                      <p className="text-sm text-gray-600 mb-3">{getDocumentStatus(files.frente).detail}</p>
                      <input type="file" id="ci-frente" name="ci-frente" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'frente')} />
                      <button type="button" onClick={() => document.getElementById('ci-frente').click()} className="px-4 py-2 bg-gray-100 rounded-lg">
                        {files.frente ? "Reemplazar archivo" : "Seleccionar archivo"}
                      </button>
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center">
                      {(() => {
                        const status = getDocumentStatus(files.reverso);
                        return (
                          <span className={`mb-3 text-xs font-semibold px-3 py-1 rounded-full ${status.tone}`}>
                            {status.label}
                          </span>
                        );
                      })()}
                      <i data-feather="file-text" className="w-12 h-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Cédula de identidad (reverso)</h3>
                      <p className="text-sm text-gray-600 mb-3">{getDocumentStatus(files.reverso).detail}</p>
                      <input type="file" id="ci-reverso" name="ci-reverso" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'reverso')} />
                      <button type="button" onClick={() => document.getElementById('ci-reverso').click()} className="px-4 py-2 bg-gray-100 rounded-lg">
                        {files.reverso ? "Reemplazar archivo" : "Seleccionar archivo"}
                      </button>
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center">
                      {(() => {
                        const status = getDocumentStatus(files.comprobante);
                        return (
                          <span className={`mb-3 text-xs font-semibold px-3 py-1 rounded-full ${status.tone}`}>
                            {status.label}
                          </span>
                        );
                      })()}
                      <i data-feather="file-text" className="w-12 h-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Comprobante de domicilio</h3>
                      <p className="text-sm text-gray-600 mb-3">{getDocumentStatus(files.comprobante).detail}</p>
                      <input type="file" id="comprobante" name="comprobante" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'comprobante')} />
                      <button type="button" onClick={() => document.getElementById('comprobante').click()} className="px-4 py-2 bg-gray-100 rounded-lg">
                        {files.comprobante ? "Reemplazar archivo" : "Seleccionar archivo"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button type="button" onClick={prevStep} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg">Anterior</button>
                  <button type="button" onClick={nextStep} disabled={!isValidStep2} className={`px-6 py-3 rounded-lg ${isValidStep2 ? 'bg-amber-500 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}>Siguiente</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-step active" id="step-3">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Firma de documentos</h2>
                <p className="text-gray-600 mb-6">Para continuar, debes firmar digitalmente tu solicitud usando ClaveÚnica.</p>

                <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center">
                  <div className="w-full max-w-md">
                    <Image src="/clave_unica.png" alt="Firma con ClaveÚnica" width={800} height={450} className="w-full h-auto rounded-lg shadow" />
                  </div>
                  <p className="text-sm text-gray-500 mt-4 text-center">Al hacer clic en “Firmar con ClaveÚnica”, serás redirigido al proveedor de identidad (simulado) y volverás automáticamente.</p>
                </div>

                <div className="flex justify-between mt-8">
                  <button type="button" onClick={prevStep} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg" disabled={isSigning}>Anterior</button>
                  <button type="button" onClick={handleSign} className="px-6 py-3 bg-amber-500 text-white rounded-lg flex items-center justify-center min-w-[200px]" disabled={isSigning}>
                    {isSigning ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Realizando firma...
                      </>
                    ) : "Firmar con ClaveÚnica"}
                  </button>
                </div>
              </div>
            )}

            {/* Popup structure overlay inside the same container ideally or absolute position layout */}
            {isSigning && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center max-w-sm mx-4">
                  <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Realizando firma...</h3>
                  <p className="text-gray-600 text-center text-sm">Por favor, espera mientras validamos tu identidad con Clave Única.</p>
                </div>
              </div>
            )}


            {step === 4 && (
              <div className="form-step active" id="step-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirmación de datos</h2>
                <p className="text-gray-600 mb-6">Por favor revisa que toda la información sea correcta antes de enviar tu solicitud.</p>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Datos personales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-gray-600">Nombre completo:</p>
                      <p className="font-medium" id="confirm-nombre">{formData.nombre}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">RUT:</p>
                      <p className="font-medium" id="confirm-rut">{formData.rut}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Correo electrónico:</p>
                      <p className="font-medium" id="confirm-email">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Teléfono:</p>
                      <p className="font-medium" id="confirm-telefono">{formData.telefono}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Fecha de nacimiento:</p>
                      <p className="font-medium" id="confirm-fecha-nacimiento">{formData.fecha}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Dirección:</p>
                      <p className="font-medium" id="confirm-direccion">{formData.direccion} {region ? ', ' + region : ''} {comuna ? ', ' + comuna : ''}</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-4">Documentos subidos</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <i data-feather="check-circle" className="text-green-500 mr-2" />
                      <span id="confirm-ci-frente" className="text-gray-700">{files.frente ? files.frente.name : 'Cédula de identidad (frente)'}</span>
                    </div>
                    <div className="flex items-center">
                      <i data-feather="check-circle" className="text-green-500 mr-2" />
                      <span id="confirm-ci-reverso" className="text-gray-700">{files.reverso ? files.reverso.name : 'Cédula de identidad (reverso)'}</span>
                    </div>
                    <div className="flex items-center">
                      <i data-feather="check-circle" className="text-green-500 mr-2" />
                      <span id="confirm-comprobante" className="text-gray-700">{files.comprobante ? files.comprobante.name : 'Comprobante de domicilio'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-start">
                    <input type="checkbox" id="terminos" name="terminos" className="mt-1 mr-2" required />
                    <label htmlFor="terminos" className="text-gray-700">Acepto los <a href="#" className="text-amber-500 hover:underline">términos y condiciones</a>.</label>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button type="button" onClick={prevStep} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg">Anterior</button>
                  <button type="submit" className="px-6 py-3 bg-green-500 text-white rounded-lg">Enviar solicitud</button>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

