"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SessionLinks from "@/components/SessionLinks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoanSimulator from "@/components/simulador";

export default function Home() {
  const vantaRef = useRef(null);
  const vantaInstance = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Failed to load " + src));
        document.head.appendChild(s);
      });

    let mounted = true;

    Promise.all([
      loadScript("https://unpkg.com/feather-icons"),
      loadScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js"),
    ])
      .then(() => {
        try {
          if (window.feather) window.feather.replace();
        } catch {}

        try {
          if (window.VANTA && window.VANTA.WAVES && vantaRef.current) {
            if (vantaInstance.current?.destroy) vantaInstance.current.destroy();

            vantaInstance.current = window.VANTA.WAVES({
              el: vantaRef.current,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.0,
              minWidth: 200.0,
              scale: 1.0,
              scaleMobile: 1.0,
              color: 0xf59e0b,
              shininess: 35.0,
              waveHeight: 15.0,
              waveSpeed: 0.5,
              zoom: 0.75,
            });
          }
        } catch {}
      })
      .catch(() => {});

    return () => {
      mounted = false;
      if (vantaInstance.current?.destroy) {
        try {
          vantaInstance.current.destroy();
        } catch {}
        vantaInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    try {
      if (window.feather) window.feather.replace();
    } catch {}
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div ref={vantaRef} className="vanta-fallback" />
      <Header active="home" />

      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          {/* COLUMNA IZQUIERDA */}
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
              Dinero rápido <span className="text-amber-500">en 5 minutos</span> sin papeleos
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Solicita desde $1.000.000 hasta $20.000.000 directamente en tu cuenta, completamente online y con la mejor tasa del mercado.
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/simular">
                <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-bold transition duration-300 shadow-lg flex items-center justify-center">
                  <i data-feather="zap" className="mr-2" /> Solicitar ahora
                </button>
              </Link>

              <button className="border-2 border-gray-300 hover:border-amber-500 text-gray-700 hover:text-amber-500 px-8 py-4 rounded-lg font-bold transition duration-300 flex items-center justify-center">
                <i data-feather="play" className="mr-2" /> Ver video
              </button>
            </div>

            <div className="mt-8 flex items-center space-x-4">
              <div className="flex -space-x-3">
                <div className="relative w-12 h-12 rounded-full border-2 border-white bg-gray-300 overflow-hidden shadow-sm">
                  <Image src="/images/avatars/avatar1.png" alt="Cliente satisfecho" fill className="object-cover" />
                </div>
                <div className="relative w-12 h-12 rounded-full border-2 border-white bg-gray-400 overflow-hidden shadow-sm">
                  <Image src="/images/avatars/avatar2.png" alt="Cliente satisfecho" fill className="object-cover" />
                </div>
                <div className="relative w-12 h-12 rounded-full border-2 border-white bg-gray-500 overflow-hidden shadow-sm">
                  <Image src="/images/avatars/avatar3.png" alt="Cliente satisfecho" fill className="object-cover" />
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">+5.000</span> clientes felices
                </p>
                <div className="flex">
                  <i data-feather="star" className="text-amber-500 w-4 h-4" />
                  <i data-feather="star" className="text-amber-500 w-4 h-4" />
                  <i data-feather="star" className="text-amber-500 w-4 h-4" />
                  <i data-feather="star" className="text-amber-500 w-4 h-4" />
                  <i data-feather="star" className="text-amber-500 w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA — SIMULADOR */}
          <div className="md:w-1/2">
            <LoanSimulator redirectTo="/solicitar" />
          </div>
        </div>
      </main>

      {/* SECCIÓN POR QUÉ ELEGIR */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">¿Por qué elegir PrestamoCL?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              La forma más rápida y sencilla de obtener dinero cuando lo necesites, sin complicaciones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl card-hover transition duration-300">
              <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <i data-feather="clock" className="text-amber-500 w-6 h-6"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">5 minutos</h3>
              <p className="text-gray-600">Desde la solicitud hasta el dinero en tu cuenta en solo 5 minutos.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl card-hover transition duration-300">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <i data-feather="smartphone" className="text-blue-500 w-6 h-6"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">100% digital</h3>
              <p className="text-gray-600">Todo el proceso desde tu celular, sin papeleos ni trámites presenciales.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl card-hover transition duration-300">
              <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <i data-feather="dollar-sign" className="text-amber-500 w-6 h-6"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Mejor tasa</h3>
              <p className="text-gray-600">Compara y verifica que tenemos las mejores tasas del mercado.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl card-hover transition duration-300">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <i data-feather="shield" className="text-blue-500 w-6 h-6"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Seguro</h3>
              <p className="text-gray-600">Tus datos protegidos con tecnología de encriptación avanzada.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
