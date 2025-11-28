"use client";

import { useEffect, useState } from "react";

export default function CambiarTarjetaPage() {
  const [user, setUser] = useState(null);
  const [numero, setNumero] = useState("");
  const [fecha, setFecha] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);

      // Si el usuario tiene tarjeta guardada, mostramos máscara y últimos 4
      if (u.paymentMethod?.last4) {
        setNumero(`**** **** **** ${u.paymentMethod.last4}`);
        setFecha(u.paymentMethod.expiry || "");
      }
    }
  }, []);

  const validateNumberInput = (raw) => {
    // dejar solo dígitos y limitar a 19 (espacios incluidos no se guardan)
    return raw.replace(/\D/g, "").slice(0, 19);
  };

  const handleNumeroChange = (e) => {
    const raw = validateNumberInput(e.target.value);
    // formatear en bloques de 4 para el input
    const formatted = raw.replace(/(\d{4})/g, "$1 ").trim();
    setNumero(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validaciones mínimas
    const digits = numero.replace(/\D/g, "");
    if (digits.length < 12) return alert("Ingresa un número de tarjeta válido.");
    if (!fecha || !/^\d{2}\/\d{2}$/.test(fecha)) return alert("Fecha debe estar en formato MM/AA.");
    if (cvv.length < 3) return alert("CVV inválido.");

    setLoading(true);

    try {
      // Ajusta la URL al endpoint real de tu backend (o usa NEXT_PUBLIC_API_URL)
      const res = await fetch("/api/usuario/tarjeta", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardNumber: digits,
          expiry: fecha,
          cvv,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error actualizando la tarjeta.");
        setLoading(false);
        return;
      }

      // Ejemplo: backend devuelve { ok: true, paymentMethod: { last4: '1234', expiry: 'MM/AA', brand: 'visa' } }
      const paymentMethod = data.paymentMethod || {
        last4: digits.slice(-4),
        expiry: fecha,
      };

      // Actualizar localStorage.user para que el layout y demás páginas muestren el cambio
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        u.paymentMethod = paymentMethod;
        localStorage.setItem("user", JSON.stringify(u));
        setUser(u);
      }

      // Mostrar máscara con últimos 4
      setNumero(`**** **** **** ${paymentMethod.last4}`);
      setCvv("");
      alert("Tarjeta actualizada correctamente.");
    } catch (err) {
      console.error(err);
      alert("Error de conexión al actualizar la tarjeta.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-6 text-center">Cargando...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Actualizar tarjeta de crédito</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="font-medium">Número de tarjeta</label>
          <input
            type="text"
            inputMode="numeric"
            className="w-full border p-2 rounded"
            value={numero}
            onChange={handleNumeroChange}
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="font-medium">Fecha expiración (MM/AA)</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={fecha}
              onChange={(e) => {
                // formateo automático MM/AA
                let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                setFecha(v);
              }}
              placeholder="MM/AA"
              required
            />
          </div>

          <div className="flex-1">
            <label className="font-medium">CVV</label>
            <input
              type="password"
              inputMode="numeric"
              className="w-full border p-2 rounded"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="123"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-lg flex justify-center items-center"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>

      {/* Muestra info de la tarjeta guardada */}
      {user.paymentMethod && (
        <div className="mt-6 text-sm text-gray-600">
          <div>Tarjeta guardada: <strong>**** **** **** {user.paymentMethod.last4}</strong></div>
          {user.paymentMethod.brand && <div>Marca: {user.paymentMethod.brand}</div>}
          {user.paymentMethod.expiry && <div>Expira: {user.paymentMethod.expiry}</div>}
        </div>
      )}
    </div>
  );
}
