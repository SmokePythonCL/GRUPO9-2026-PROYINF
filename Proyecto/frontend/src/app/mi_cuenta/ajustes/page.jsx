"use client";

import { useState, useEffect } from "react";

export default function ConfiguracionPage() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setNombre(u.nombre || "");
      setCorreo(u.email || "");
      setTelefono(u.telefono || "");
    }
  }, []);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = {
        nombre,
        email: correo,
        telefono
      };

      const res = await fetch("http://localhost:4000/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const updated = await res.json();

      if (updated.error) {
        alert(updated.error);
        return;
      }

      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(updated));

      alert("Datos actualizados correctamente.");

    } catch (err) {
      console.error(err);
      alert("Error actualizando los datos.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Configuración de cuenta</h2>

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

        <button className="w-full bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-lg">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
