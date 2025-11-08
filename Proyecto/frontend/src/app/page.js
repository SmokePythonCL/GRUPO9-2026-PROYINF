"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const vantaRef = useRef(null);
  const vantaInstance = useRef(null);
  const router = useRouter();

  const [amount, setAmount] = useState(5000000);
  const [term, setTerm] = useState(12);

  const rate = 0.012; // 1.2% mensual

  function formatCurrency(value) {
    return "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function calculateMonthly(amountVal, termVal) {
    const monthly = (amountVal * rate) / (1 - Math.pow(1 + rate, -termVal));
    const total = monthly * termVal;
    return {
      monthly: Math.round(monthly),
      total: Math.round(total),
      rateText: (rate * 100).toFixed(1) + "% mensual",
    };
  }

  const saveSimulationAndContinue = () => {
    const { monthly, total } = calculateMonthly(amount, term);
    
    const simulationData = {
      amount,
      term,
      monthlyPayment: monthly,
      totalPayment: total,
      interestRate: rate,
      timestamp: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('currentSimulation', JSON.stringify(simulationData));
      router.push('/solicitar');
    }
  };

  const showComparison = () => {
    const { monthly } = calculateMonthly(amount, term);
    
    const competitors = [
      { name: 'PrestamoCL', monthlyPayment: monthly },
      { name: 'Banco Competidor A', monthlyPayment: Math.round(monthly * 1.1) },
      { name: 'Fintech Competidor B', monthlyPayment: Math.round(monthly * 1.05) },
      { name: 'Banco Competidor C', monthlyPayment: Math.round(monthly * 1.15) }
    ];

    const comparisonMessage = `Comparación de cuotas mensuales:\n\n${
      competitors.map(comp => `${comp.name}: ${formatCurrency(comp.monthlyPayment)}/mes`).join('\n')
    }\n\n* Simulación para ${formatCurrency(amount)} a ${term} meses`;

    alert(comparisonMessage);
  };

  const { monthly, total, rateText } = calculateMonthly(amount, term);

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
        if (!mounted) return;
        try {
          if (window.feather && typeof window.feather.replace === "function") {
            window.feather.replace();
          }
        } catch (e) {}

        try {
          if (window.VANTA && window.VANTA.WAVES && vantaRef.current) {
            if (vantaInstance.current && vantaInstance.current.destroy) {
              vantaInstance.current.destroy();
            }
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
        } catch (e) {}
      })
      .catch(() => {});

    return () => {
      mounted = false;
      if (vantaInstance.current && vantaInstance.current.destroy) {
        try {
          vantaInstance.current.destroy();
        } catch (e) {}
        vantaInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    try {
      if (window.feather && typeof window.feather.replace === "function") {
        window.feather.replace();
      }
    } catch (e) {}
  });

  return (
    <div className="bg-gray-50 min-h-screen">
    <div className="vanta-fallback" />
      <header className="bg-white bg-opacity-90 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-amber-500 p-2 rounded-lg">
              <i data-feather="zap" className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Prestamo<span className="text-amber-500">CL</span>
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-amber-500 font-medium">Inicio</Link>
            <Link href="/como_funciona" className="text-gray-600 hover:text-amber-500 font-medium">Cómo funciona</Link>
            <Link href="/beneficios" className="text-gray-600 hover:text-amber-500 font-medium">Beneficios</Link>
            <Link href="/faq" className="text-gray-600 hover:text-amber-500 font-medium">FAQ</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="hidden md:block px-4 py-2 text-gray-600 hover:text-amber-500">
              <i data-feather="user" />
            </Link>
            <Link href="/solicitar" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition duration-300 shadow-md">
              Solicitar préstamo
            </Link>
            <button className="md:hidden">
              <i data-feather="menu" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
              Dinero rápido <span className="text-amber-500">en 5 minutos</span> sin papeleos
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Solicita desde $1.000.000 hasta $20.000.000 directamente en tu cuenta, completamente online y con la mejor tasa del mercado.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/solicitar">
                <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-bold transition duration-300 shadow-lg flex items-center justify-center">
                  <i data-feather="zap" className="mr-2" /> Solicitar ahora
                </button>
              </Link>
              <button className="border-2 border-gray-300 hover:border-amber-500 text-gray-700 hover:text-amber-500 px-8 py-4 rounded-lg font-bold transition duration-300 flex items-center justify-center">
                <i data-feather="play" className="mr-2" /> Ver video
              </button>
            </div>
            <div className="mt-8 flex items-center space-x-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-300"></div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-400"></div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-500"></div>
              </div>
              <div>
                <p className="text-sm text-gray-600"><span className="font-bold">+5.000</span> clientes felices</p>
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
          <div className="md:w-1/2">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Simulador de préstamo</h2>
              <div className="mb-6">
                <label htmlFor="amount" className="block text-gray-700 mb-2">Monto que necesitas</label>
                <div className="flex items-center mb-2">
                  <span className="text-gray-500 mr-2">$</span>
                  <input
                    type="range"
                    id="amount"
                    min={1000000}
                    max={20000000}
                    step={100000}
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value, 10))}
                    className="w-full input-range"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>$1.000.000</span>
                  <span>$20.000.000</span>
                </div>
                <div className="mt-4">
                  <input type="text" id="amount-display" value={formatCurrency(amount)} readOnly className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-xl font-bold text-amber-500" />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="term" className="block text-gray-700 mb-2">Plazo del préstamo</label>
                <div className="flex items-center mb-2">
                  <input
                    type="range"
                    id="term"
                    min={3}
                    max={48}
                    step={1}
                    value={term}
                    onChange={(e) => setTerm(parseInt(e.target.value, 10))}
                    className="w-full input-range"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>3 meses</span>
                  <span>48 meses</span>
                </div>
                <div className="mt-4">
                  <input type="text" id="term-display" value={`${term} meses`} readOnly className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-xl font-bold text-amber-500" />
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Cuota mensual:</span>
                  <span className="font-bold text-gray-800" id="monthly-payment">{formatCurrency(monthly)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tasa de interés:</span>
                  <span className="font-bold text-gray-800" id="interest-rate">{rateText}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total a pagar:</span>
                  <span className="font-bold text-gray-800" id="total-payment">{formatCurrency(total)}</span>
                </div>
              </div>
              
              <button 
                onClick={saveSimulationAndContinue}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-bold transition duration-300 shadow-md"
              >
                Solicitar este préstamo
              </button>

              <div className="mt-4 text-center">
                <button 
                  onClick={showComparison}
                  className="text-amber-500 hover:text-amber-600 text-sm font-medium flex items-center justify-center mx-auto"
                >
                  <i data-feather="bar-chart-2" className="w-4 h-4 mr-1"></i>
                  Comparar con otros simuladores
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-2 text-center">* Montos preaprobados según tu perfil crediticio</p>
            </div>
          </div>
        </div>
      </main>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">¿Por qué elegir PrestamoCL?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">La forma más rápida y sencilla de obtener dinero cuando lo necesites, sin complicaciones.</p>
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

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-amber-500 p-2 rounded-lg">
                  <i data-feather="zap" className="text-white" />
                </div>
                <h3 className="text-xl font-bold">Prestamo<span className="text-amber-500">CL</span></h3>
              </div>
              <p className="text-gray-400 mb-4">La forma más rápida y sencilla de obtener dinero cuando lo necesites.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white"><i data-feather="facebook" /></a>
                <a href="#" className="text-gray-400 hover:text-white"><i data-feather="twitter" /></a>
                <a href="#" className="text-gray-400 hover:text-white"><i data-feather="instagram" /></a>
                <a href="#" className="text-gray-400 hover:text-white"><i data-feather="linkedin" /></a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Enlaces útiles</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white">Inicio</Link></li>
                <li><Link href="/como_funciona" className="hover:text-white">Cómo funciona</Link></li>
                <li><Link href="/beneficios" className="hover:text-white">Beneficios</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Términos y condiciones</a></li>
                <li><a href="#" className="hover:text-white">Política de privacidad</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center"><i data-feather="mail" className="mr-2" /> hola@PrestamoCL.cl</li>
                <li className="flex items-center"><i data-feather="phone" className="mr-2" /> Telefono</li>
                <li className="flex items-center"><i data-feather="map-pin" className="mr-2" /> Dirección</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2023 PrestamoCL. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}