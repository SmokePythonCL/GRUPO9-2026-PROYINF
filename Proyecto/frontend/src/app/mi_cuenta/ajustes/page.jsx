"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { updateUserProfile } from "@/lib/api";

export default function ConfiguracionPage() {
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [nacimiento, setNacimiento] = useState("");
  const [rut, setRut] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setNombre(u.nombre || "");
      setApellidoPaterno(u.apellido_paterno || "");
      setApellidoMaterno(u.apellido_materno || "");
      setNacimiento((u.nacimiento || "").toString().slice(0, 10));
      setRut(u.rut || "");
      setCorreo(u.email || "");
      setTelefono(u.telefono || "");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const body = {
        nombre,
        apellido_paterno: apellidoPaterno,
        apellido_materno: apellidoMaterno,
        nacimiento,
        email: correo,
        telefono
      };

      const updated = await updateUserProfile(body);

      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(updated));

      alert("Datos actualizados correctamente.");

    } catch (err) {
      alert(err?.response?.data?.error || "Error actualizando los datos.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Configuración de cuenta</h2>
      <p className="text-gray-600 mb-6">Actualiza tu correo, teléfono y datos personales para evitar problemas al solicitar tu préstamo.</p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="font-medium">Nombre</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Apellido paterno</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={apellidoPaterno}
              onChange={(e) => setApellidoPaterno(e.target.value)}
            />
          </div>

          <div>
            <label className="font-medium">Apellido materno</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={apellidoMaterno}
              onChange={(e) => setApellidoMaterno(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="font-medium">Fecha de nacimiento</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={nacimiento}
            onChange={(e) => setNacimiento(e.target.value)}
          />
        </div>

        <div>
          <label className="font-medium">RUT (no editable)</label>
          <input
            type="text"
            className="w-full border p-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
            value={rut}
            disabled
            readOnly
          />
        </div>

        <div>
          <label className="font-medium">Correo electrónico</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        <div>
          <label className="font-medium">Teléfono</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        <button className="w-full bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-lg disabled:opacity-70" disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>

      <div className="mt-8 p-4 rounded-lg bg-gray-50 border border-gray-200">
        <h3 className="font-semibold text-gray-800">Método de pago</h3>
        <p className="text-sm text-gray-600 mt-1 mb-3">Si cambiaste tu tarjeta, actualízala aquí para mantener tus pagos automáticos al día.</p>
        <Link
          href="/mi_cuenta/ajustesTarjeta"
          className="inline-flex items-center bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg"
        >
          Cambiar tarjeta inscrita
        </Link>
      </div>
    </div>
  );
}
