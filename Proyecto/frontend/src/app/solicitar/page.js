"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const comunasPorRegion = {
  'arica': ['Arica', 'Camarones', 'Putre', 'General Lagos'],
  'tarapaca': ['Iquique', 'Alto Hospicio', 'Pozo Almonte'],
  'metropolitana': ['Santiago', 'Providencia', 'Las Condes']
};

export default function Solicitar() {
  const [step, setStep] = useState(1);
  const [region, setRegion] = useState('');
  const [comunas, setComunas] = useState([]);
  const [comuna, setComuna] = useState('');
  const [formData, setFormData] = useState({ nombre: '', rut: '', email: '', telefono: '', fecha: '', direccion: '' });
  const [files, setFiles] = useState({ frente: null, reverso: null, comprobante: null });
  const [simulationData, setSimulationData] = useState(null);

  // CARGAR DATOS DE SIMULACIÓN
  useEffect(() => {
    try { 
      if (window.feather && typeof window.feather.replace === 'function') 
        window.feather.replace(); 
    } catch (e) {}

    // Cargar datos de la simulación desde localStorage
    if (typeof window !== 'undefined') {
      const savedSimulation = localStorage.getItem('currentSimulation');
      if (savedSimulation) {
        setSimulationData(JSON.parse(savedSimulation));
        console.log('Datos de simulación cargados:', JSON.parse(savedSimulation));
      }
    }
  }, []);
  useEffect(() => {
    if (region && comunasPorRegion[region]) setComunas(comunasPorRegion[region]);
    else setComunas([]);
    setComuna('');
  }, [region]);

  function nextStep() {
    setStep((s) => Math.min(4, s + 1));
  }
  function prevStep() {
    setStep((s) => Math.max(1, s - 1));
  }

  function handleFileChange(e, key) {
    setFiles({ ...files, [key]: e.target.files[0] || null });
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert('¡Solicitud enviada con éxito! Nos pondremos en contacto contigo en breve.');
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-amber-500 p-2 rounded-lg"><i data-feather="zap" className="text-white" /></div>
            <h1 className="text-2xl font-bold text-gray-800">Prestamo<span className="text-amber-500">CL</span></h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="hidden md:block px-4 py-2 text-gray-600 hover:text-amber-500"><i data-feather="home" /></Link>
            <Link href="/como_funciona" className="hidden md:block px-4 py-2 text-gray-600 hover:text-amber-500"><i data-feather="help-circle" /></Link>
            <Link href="/beneficios" className="hidden md:block px-4 py-2 text-gray-600 hover:text-amber-500"><i data-feather="gift" /></Link>
            <Link href="/login" className="hidden md:block px-4 py-2 text-gray-600 hover:text-amber-500"><i data-feather="user" /></Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
     <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">


       {/* COMPONENTE NUEVO - RESUMEN DE SIMULACIÓN */}
        {simulationData && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen de tu Simulación</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Monto</p>
                <p className="text-lg font-bold text-amber-600">${simulationData.amount.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Plazo</p>
                <p className="text-lg font-bold text-amber-600">{simulationData.term} meses</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Cuota mensual</p>
                <p className="text-lg font-bold text-amber-600">${simulationData.monthlyPayment.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total a pagar</p>
                <p className="text-lg font-bold text-amber-600">${simulationData.totalPayment.toLocaleString()}</p>
              </div>
            </div>
          </div>
  )}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between relative">
              <div className="flex-1 flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step>=1? 'bg-amber-500 text-white':'bg-gray-200 text-gray-500'}`}>1</div>
                <span className={`${step>=1? 'text-amber-500':'text-gray-500'} text-sm font-medium`}>Datos personales</span>
              </div>
              <div className="flex-1 flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step>=2? 'bg-amber-500 text-white':'bg-gray-200 text-gray-500'}`}>2</div>
                <span className={`${step>=2? 'text-amber-500':'text-gray-500'} text-sm font-medium`}>Documentos</span>
              </div>
              <div className="flex-1 flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step>=3? 'bg-amber-500 text-white':'bg-gray-200 text-gray-500'}`}>3</div>
                <span className={`${step>=3? 'text-amber-500':'text-gray-500'} text-sm font-medium`}>Firma</span>
              </div>
              <div className="flex-1 flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step>=4? 'bg-amber-500 text-white':'bg-gray-200 text-gray-500'}`}>4</div>
                <span className={`${step>=4? 'text-amber-500':'text-gray-500'} text-sm font-medium`}>Confirmación</span>
              </div>
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0">
                <div className="h-full bg-amber-500" style={{width: step===1? '25%': step===2? '50%': step===3? '75%':'100%'}} />
              </div>
            </div>
          </div>

          <form id="CL-form" className="p-6 md:p-8" onSubmit={handleSubmit}>
            {step===1 && (
              <div className="form-step active" id="step-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Datos personales</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="rut" className="block text-gray-700 font-medium mb-2">RUT</label>
                    <input type="text" id="rut" name="rut" value={formData.rut} onChange={e=>setFormData({...formData, rut:e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="11.111.111-1" required />
                  </div>
                  <div>
                    <label htmlFor="nombre" className="block text-gray-700 font-medium mb-2">Nombre completo</label>
                    <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={e=>setFormData({...formData, nombre:e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Juan Pérez González" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Correo electrónico</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="juan@example.com" required />
                  </div>
                  <div>
                    <label htmlFor="telefono" className="block text-gray-700 font-medium mb-2">Teléfono</label>
                    <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={e=>setFormData({...formData, telefono:e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="+56 9 1234 5678" required />
                  </div>
                  <div>
                    <label htmlFor="fecha-nacimiento" className="block text-gray-700 font-medium mb-2">Fecha de nacimiento</label>
                    <input type="date" id="fecha-nacimiento" name="fecha-nacimiento" value={formData.fecha} onChange={e=>setFormData({...formData, fecha:e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                  </div>
                  <div>
                    <label htmlFor="genero" className="block text-gray-700 font-medium mb-2">Género</label>
                    <select id="genero" name="genero" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                      <option value="" disabled>Seleccione una opción</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="direccion" className="block text-gray-700 font-medium mb-2">Dirección</label>
                  <input type="text" id="direccion" name="direccion" value={formData.direccion} onChange={e=>setFormData({...formData, direccion:e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Av. Principal 123" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div>
                    <label htmlFor="region" className="block text-gray-700 font-medium mb-2">Región</label>
                    <select id="region" name="region" value={region} onChange={e=>setRegion(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                      <option value="" disabled>Seleccione región</option>
                      <option value="metropolitana">Metropolitana</option>
                      <option value="tarapaca">Tarapacá</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="comuna" className="block text-gray-700 font-medium mb-2">Comuna</label>
                    <select id="comuna" name="comuna" value={comuna} onChange={e=>setComuna(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
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
                  <button type="button" onClick={nextStep} className="px-6 py-3 bg-amber-500 text-white rounded-lg">Siguiente</button>
                </div>
              </div>
            )}

            {step===2 && (
              <div className="form-step active" id="step-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Documentación requerida</h2>
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center">
                      <i data-feather="file-text" className="w-12 h-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Cédula de identidad (frente)</h3>
                      <input type="file" id="ci-frente" name="ci-frente" className="hidden" accept="image/*,.pdf" onChange={(e)=>handleFileChange(e,'frente')} />
                      <button type="button" onClick={()=>document.getElementById('ci-frente').click()} className="px-4 py-2 bg-gray-100 rounded-lg">Seleccionar archivo</button>
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center">
                      <i data-feather="file-text" className="w-12 h-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Cédula de identidad (reverso)</h3>
                      <input type="file" id="ci-reverso" name="ci-reverso" className="hidden" accept="image/*,.pdf" onChange={(e)=>handleFileChange(e,'reverso')} />
                      <button type="button" onClick={()=>document.getElementById('ci-reverso').click()} className="px-4 py-2 bg-gray-100 rounded-lg">Seleccionar archivo</button>
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center">
                      <i data-feather="file-text" className="w-12 h-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Comprobante de domicilio</h3>
                      <input type="file" id="comprobante" name="comprobante" className="hidden" accept="image/*,.pdf" onChange={(e)=>handleFileChange(e,'comprobante')} />
                      <button type="button" onClick={()=>document.getElementById('comprobante').click()} className="px-4 py-2 bg-gray-100 rounded-lg">Seleccionar archivo</button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button type="button" onClick={prevStep} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg">Anterior</button>
                  <button type="button" onClick={nextStep} className="px-6 py-3 bg-amber-500 text-white rounded-lg">Siguiente</button>
                </div>
              </div>
            )}

            {step===3 && (
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
                  <button type="button" onClick={prevStep} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg">Anterior</button>
                  <button type="button" onClick={nextStep} className="px-6 py-3 bg-amber-500 text-white rounded-lg">Firmar con ClaveÚnica</button>
                </div>
              </div>
            )}

            {step===4 && (
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
    </div>
  );
}
