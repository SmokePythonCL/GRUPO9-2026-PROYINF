"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import feather from "feather-icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getUser } from "@/lib/api"; //

export default function MiCuentaLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Intentamos obtener los datos frescos del backend
        const data = await getUser();
        
        // Construimos el nombre completo para mostrarlo correctamente
        const fullName = `${data.nombre} ${data.apellido_paterno} ${data.apellido_materno}`.trim();
        
        const userData = {
          ...data,
          display_name: fullName || data.nombre || data.name || "Usuario",
          foto: data.foto || "https://cdn-icons-png.flaticon.com/512/847/847969.png"
        };

        setUser(userData);
        // Actualizamos el localStorage para que otros componentes tengan lo mismo
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
        console.error("Error cargando perfil:", err);
        // Si el token falló o no hay sesión, limpiar estado local y redirigir.
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } catch {}
        setUser(null);
        router.replace("/login");
      } finally {
        setLoading(false);
        setTimeout(() => {
          if (window.feather) window.feather.replace();
        }, 100);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <p className="text-amber-600 font-bold animate-pulse">Cargando perfil...</p>
    </div>
  );

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header user={user} />
      <div className="container mx-auto px-4 py-8 flex gap-8">
        <aside className="w-64 bg-white rounded-lg shadow-sm p-6 h-fit">
          <div className="flex items-center mb-8 min-w-0">
            <img src={user.foto} className="w-12 h-12 rounded-full mr-4" alt="Avatar" />
            <div className="min-w-0">
              {/* Mostramos el nombre completo procesado */}
              <h3 className="font-bold text-gray-800 text-sm break-words">{user.display_name}</h3>
            </div>
          </div>

          <nav className="space-y-2">
            <Link href="/mi_cuenta" className={`block px-4 py-2 rounded-lg font-medium ${pathname === "/mi_cuenta" ? "bg-amber-50 text-amber-600" : "text-gray-600 hover:bg-amber-50"}`}>
              <i data-feather="home" className="inline mr-2 w-4 h-4"></i> Resumen
            </Link>
            <Link href="/mi_cuenta/historial_prestamos" className={`block px-4 py-2 rounded-lg font-medium ${pathname.includes("/historial_prestamos") ? "bg-amber-50 text-amber-600" : "text-gray-600 hover:bg-amber-50"}`}>
              <i data-feather="list" className="inline mr-2 w-4 h-4"></i> Historial de Préstamos
            </Link>
            <Link href="/mi_cuenta/ajustes" className={`block px-4 py-2 rounded-lg font-medium ${pathname.includes("/ajustes") ? "bg-amber-50 text-amber-600" : "text-gray-600 hover:bg-amber-50"}`}>
              <i data-feather="settings" className="inline mr-2 w-4 h-4"></i> Configuración
            </Link>
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}