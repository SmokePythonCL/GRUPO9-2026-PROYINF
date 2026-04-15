"use client";

import Link from "next/link";
import SessionLinks from "@/components/SessionLinks";

export default function Header({ active = "" }) {
  return (
    <header className="bg-white bg-opacity-90 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-amber-500 p-2 rounded-lg">
            <i data-feather="zap" className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Prestamo<span className="text-amber-500">CL</span>
          </h1>
        </Link>

        <nav className="flex flex-wrap items-center space-x-4">
          <Link
            href="/"
            className={`${active === "home" ? "text-amber-500" : "text-gray-600 hover:text-amber-500"} font-medium`}
          >
            Inicio
          </Link>
          <Link
            href="/como_funciona"
            className={`${active === "como_funciona" ? "text-amber-500" : "text-gray-600 hover:text-amber-500"} font-medium`}
          >
            Cómo funciona
          </Link>
          <Link
            href="/beneficios"
            className={`${active === "beneficios" ? "text-amber-500" : "text-gray-600 hover:text-amber-500"} font-medium`}
          >
            Beneficios
          </Link>
          <Link
            href="/faq"
            className={`${active === "faq" ? "text-amber-500" : "text-gray-600 hover:text-amber-500"} font-medium`}
          >
            FAQ
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <SessionLinks />

          {/* 🔥 ESTE ES EL CAMBIO IMPORTANTE */}
          <Link
            href="/simular"
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition duration-300 shadow-md"
          >
            Solicitar préstamo
          </Link>
        </div>
      </div>
    </header>
  );
}
