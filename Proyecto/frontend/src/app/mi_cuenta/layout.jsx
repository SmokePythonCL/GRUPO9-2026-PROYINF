"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import feather from "feather-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MiCuentaLayout({ children }) {
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    feather.replace();

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return <p>Cargando...</p>;

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HEADER */}
      <Header user={user} />

      <div className="container mx-auto px-4 py-8 flex gap-8">

        {/* SIDEBAR */}
        <aside className="w-64 bg-white rounded-lg shadow-sm p-6 h-fit">
          <div className="flex items-center mb-8">
            <img
              src={user.foto || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h3 className="font-bold text-gray-800">{user.nombre}</h3>
            </div>
          </div>

          <nav className="space-y-2">

            <Link
              href="/mi_cuenta"
              className={`block px-4 py-2 rounded-lg font-medium ${
                pathname === "/mi_cuenta"
                  ? "bg-amber-50 text-amber-600"
                  : "text-gray-600 hover:bg-amber-50 hover:text-amber-600"
              }`}
            >
              <i data-feather="home" className="inline mr-2 w-4 h-4"></i>
              Resumen
            </Link>

            <Link
              href="/mi_cuenta/ajustesTarjeta"
              className={`block px-4 py-2 rounded-lg font-medium ${
                pathname.includes("/ajustesTarjeta")
                  ? "bg-amber-50 text-amber-600"
                  : "text-gray-600 hover:bg-amber-50 hover:text-amber-600"
              }`}
            >
              <i data-feather="credit-card" className="inline mr-2 w-4 h-4"></i>
              Métodos de pago
            </Link>

            <Link
              href="/mi_cuenta/ajustes"
              className={`block px-4 py-2 rounded-lg font-medium ${
                pathname.includes("/ajustes")
                  ? "bg-amber-50 text-amber-600"
                  : "text-gray-600 hover:bg-amber-50 hover:text-amber-600"
              }`}
            >
              <i data-feather="settings" className="inline mr-2 w-4 h-4"></i>
              Configuración
            </Link>

          </nav>
        </aside>

        {/* MAIN CONTENT (CAMBIA) */}
        <main className="flex-1">{children}</main>

      </div>
    </div>
  );
}
