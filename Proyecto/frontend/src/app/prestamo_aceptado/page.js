"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function PrestamoAceptado() {
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    try { if (window.feather && typeof window.feather.replace === "function") window.feather.replace(); } catch (e) {}

    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + 30);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    setDueDate(due.toLocaleDateString('es-ES', options));
  }, []);

  function handleBankSubmit(e) {
    e.preventDefault();
    alert('¡Datos recibidos correctamente! El dinero será transferido en los próximos 10 minutos.');
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-amber-500 p-2 rounded-lg">
              <i data-feather="zap" className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Flash<span className="text-amber-500">Loan</span></h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8 text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i data-feather="check" className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Préstamo Aprobado!</h2>
              <p className="text-lg text-gray-600 mb-6">Tu solicitud ha sido aprobada. Completa los datos para recibir el dinero.</p>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 text-left">
                <div className="flex">
                  <i data-feather="info" className="text-green-500 mr-2" />
                  <div>
                    <p className="font-medium text-green-800">Monto aprobado: <span className="font-bold" id="approved-amount">$5.000.000</span></p>
                    <p className="text-sm text-green-600">Tasa de interés: 1.2% mensual | Plazo: 12 meses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 pb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Detalles de la primera cuota</h3>
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Monto:</p>
                  <p className="font-bold text-gray-800">$450.000</p>
                </div>
                <div>
                  <p className="text-gray-600">Fecha de vencimiento:</p>
                  <p className="font-bold text-gray-800" id="due-date">{dueDate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Número de cuota:</p>
                  <p className="font-bold text-gray-800">1/12</p>
                </div>
                <div>
                  <p className="text-gray-600">Estado:</p>
                  <p className="font-bold text-green-500">Pendiente</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-4">Datos de transferencia</h3>
            <p className="text-gray-600 mb-6">Por favor ingresa los datos de la cuenta bancaria donde recibirás el dinero.</p>

            <form id="bank-account-form" onSubmit={handleBankSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="bank-name" className="block text-gray-700 font-medium mb-2">Banco</label>
                  <select id="bank-name" name="bank-name" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                    <option value="" disabled selected>Seleccione banco</option>
                    <option value="bci">BCI</option>
                    <option value="santander">Santander</option>
                    <option value="chile">Banco de Chile</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="account-type" className="block text-gray-700 font-medium mb-2">Tipo de cuenta</label>
                  <select id="account-type" name="account-type" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                    <option value="" disabled selected>Seleccione tipo</option>
                    <option value="cuenta-vista">Cuenta Vista</option>
                    <option value="cuenta-corriente">Cuenta Corriente</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="account-number" className="block text-gray-700 font-medium mb-2">Número de cuenta</label>
                  <input type="text" id="account-number" name="account-number" className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Ej: 12345678" required />
                </div>
                <div>
                  <label htmlFor="account-rut" className="block text-gray-700 font-medium mb-2">RUT del titular</label>
                  <input type="text" id="account-rut" name="account-rut" className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Ej: 11.111.111-1" required />
                </div>
              </div>

              <div className="mt-8">
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-lg font-bold transition duration-300 shadow-md flex items-center justify-center">
                  <i data-feather="dollar-sign" className="mr-2" /> Confirmar y recibir dinero
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
