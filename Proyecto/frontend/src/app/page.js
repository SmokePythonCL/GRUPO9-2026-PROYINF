
"use client";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  // Estados para el simulador de préstamo
  const [amount, setAmount] = useState(1000000);
  const [term, setTerm] = useState(12);
  const [monthly, setMonthly] = useState(0);
  const [total, setTotal] = useState(0);
  const rate = 0.012; // 1.2% mensual
  const vantaRef = useRef(null);

  useEffect(() => {
    // Cargar Feather Icons
    if (window.feather) window.feather.replace();
    // Cargar Vanta.js Waves
    if (window.VANTA && vantaRef.current && !vantaRef.current._vanta) {
      window.VANTA.WAVES({
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
  }, []);

  useEffect(() => {
    // Calcular préstamo
    const monthlyPayment = (amount * rate) / (1 - Math.pow(1 + rate, -term));
    setMonthly(Math.round(monthlyPayment));
    setTotal(Math.round(monthlyPayment * term));
  }, [amount, term]);

  function formatCurrency(value) {
    return "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Fondo animado Vanta.js */}
      <div ref={vantaRef} id="vanta-bg" className="fixed inset-0 -z-10" />

      {/* Header */}
      <header className="bg-white bg-opacity-90 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-amber-500 p-2 rounded-lg">
              <i data-feather="zap" className="text-white"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Test</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-amber-500 font-medium">Inicio</a>
            <a href="#" className="text-gray-600 hover:text-amber-500 font-medium">Cómo funciona</a>
            <a href="#" className="text-gray-600 hover:text-amber-500 font-medium">Beneficios</a>
            <a href="#" className="text-gray-600 hover:text-amber-500 font-medium">FAQ</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="hidden md:block px-4 py-2 text-gray-600 hover:text-amber-500">
              <i data-feather="user"></i>
            </button>
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition duration-300 shadow-md">
              Solicitar préstamo
            </button>
            <button className="md:hidden">
              <i data-feather="menu"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
              Dinero rápido <span className="text-amber-500">en 5 minutos</span> sin papeleos
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Solicita desde $1.000.000 hasta $20.000.000 directamente en tu cuenta, completamente online y con la mejor tasa del mercado.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-bold transition duration-300 shadow-lg flex items-center justify-center">
                <i data-feather="zap" className="mr-2"></i> Solicitar ahora
              </button>
              <button className="border-2 border-gray-300 hover:border-amber-500 text-gray-700 hover:text-amber-500 px-8 py-4 rounded-lg font-bold transition duration-300 flex items-center justify-center">
                <i data-feather="play" className="mr-2"></i> Ver video
              </button>
            </div>
            <div className="mt-8 flex items-center space-x-4">
              <div className="flex -space-x-2">
                <img src="http://static.photos/people/200x200/1" className="w-10 h-10 rounded-full border-2 border-white" />
                <img src="http://static.photos/people/200x200/2" className="w-10 h-10 rounded-full border-2 border-white" />
                <img src="http://static.photos/people/200x200/3" className="w-10 h-10 rounded-full border-2 border-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600"><span className="font-bold">+5.000</span> clientes felices</p>
                <div className="flex">
                  {/* ...estrellas y rating... */}
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
                  <input
                    id="amount"
                    type="range"
                    min={1000000}
                    max={20000000}
                    step={100000}
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="input-range w-full"
                  />
                  <input
                    id="amount-display"
                    type="text"
                    readOnly
                    value={formatCurrency(amount)}
                    className="ml-4 w-32 text-right bg-gray-100 rounded px-2 py-1 font-bold"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>$1.000.000</span>
                  <span>$20.000.000</span>
                </div>
                <div className="mt-4">
                  {/* ...puedes agregar ayuda o info aquí... */}
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="term" className="block text-gray-700 mb-2">Plazo del préstamo</label>
                <div className="flex items-center mb-2">
                  <input
                    id="term"
                    type="range"
                    min={6}
                    max={48}
                    step={1}
                    value={term}
                    onChange={e => setTerm(Number(e.target.value))}
                    className="input-range w-full"
                  />
                  <input
                    id="term-display"
                    type="text"
                    readOnly
                    value={term + " meses"}
                    className="ml-4 w-24 text-right bg-gray-100 rounded px-2 py-1 font-bold"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>6 meses</span>
                  <span>48 meses</span>
                </div>
                <div className="mt-4">
                  {/* ...puedes agregar ayuda o info aquí... */}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Pago mensual</span>
                  <span className="font-bold text-amber-500" id="monthly-payment">{formatCurrency(monthly)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tasa de interés</span>
                  <span className="font-bold" id="interest-rate">{(rate * 100).toFixed(1)}% mensual</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total a pagar</span>
                  <span className="font-bold" id="total-payment">{formatCurrency(total)}</span>
                </div>
              </div>
              <button className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-bold transition duration-300 shadow-md">
                Solicitar este préstamo
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">* Montos preaprobados según tu perfil crediticio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">¿Por qué elegir FlashLoan?</h2>
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

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Así de fácil es obtener tu préstamo</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">En solo 3 sencillos pasos tendrás el dinero que necesitas.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute -left-4 top-0 h-full flex items-center justify-center md:hidden">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
              </div>
              <div className="bg-white p-6 rounded-xl h-full">
                <div className="hidden md:flex w-12 h-12 bg-amber-500 rounded-full items-center justify-center text-white font-bold mb-4">1</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Simula tu préstamo</h3>
                <p className="text-gray-600 mb-4">Usa nuestro simulador para ver cuánto pagarás mensualmente según el monto y plazo que elijas.</p>
                <div className="flex justify-center">
                  {/* ...icono... */}
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-4 top-0 h-full flex items-center justify-center md:hidden">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
              </div>
              <div className="bg-white p-6 rounded-xl h-full">
                <div className="hidden md:flex w-12 h-12 bg-amber-500 rounded-full items-center justify-center text-white font-bold mb-4">2</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Completa tu solicitud</h3>
                <p className="text-gray-600 mb-4">Sácale foto a tu cédula y nuestro sistema rellenará automáticamente tus datos. Firma digitalmente.</p>
                <div className="flex justify-center">
                  {/* ...icono... */}
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-4 top-0 h-full flex items-center justify-center md:hidden">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
              </div>
              <div className="bg-white p-6 rounded-xl h-full">
                <div className="hidden md:flex w-12 h-12 bg-amber-500 rounded-full items-center justify-center text-white font-bold mb-4">3</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Recibe tu dinero</h3>
                <p className="text-gray-600 mb-4">En solo 5 minutos tendrás el dinero depositado en tu cuenta, sin esperas ni trámites.</p>
                <div className="flex justify-center">
                  {/* ...icono... */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Más de 5.000 clientes han confiado en nosotros para sus necesidades financieras.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <i key={i} data-feather="star" className="text-amber-500 w-5 h-5"></i>
                ))}
              </div>
              <p className="text-gray-600 mb-4">"Increíble lo rápido que fue el proceso. Necesitaba dinero urgente un domingo en la tarde y en menos de 5 minutos ya lo tenía en mi cuenta."</p>
              <div className="flex items-center">
                <img src="http://static.photos/people/200x200/4" className="w-10 h-10 rounded-full mr-3" />
                <div>
                  {/* ...nombre y detalles... */}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <i key={i} data-feather="star" className="text-amber-500 w-5 h-5"></i>
                ))}
              </div>
              <p className="text-gray-600 mb-4">"Me encantó no tener que llenar formularios. Con solo sacarle foto a mi cédula ya tenía todos mis datos cargados. ¡Recomendado 100%!"</p>
              <div className="flex items-center">
                {/* ...nombre y detalles... */}
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <i key={i} data-feather="star" className="text-amber-500 w-5 h-5"></i>
                ))}
              </div>
              <p className="text-gray-600 mb-4">"Comparé con otras instituciones y FlashLoan tenía la mejor tasa. Además, el proceso fue tan sencillo que hasta mi mamá de 70 años pudo hacerlo."</p>
              <div className="flex items-center">
                {/* ...nombre y detalles... */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">¿Qué esperas para solicitar tu préstamo?</h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">Dinero rápido, seguro y con la mejor tasa del mercado. Todo desde tu celular.</p>
          <button className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold transition duration-300 shadow-lg flex items-center justify-center mx-auto">
            <i data-feather="zap" className="mr-2"></i> Solicitar ahora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                {/* ...logo... */}
              </div>
              <p className="text-gray-400 mb-4">La forma más rápida y sencilla de obtener dinero cuando lo necesites.</p>
              <div className="flex space-x-4">
                {/* ...redes sociales... */}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Enlaces útiles</h4>
              <ul className="space-y-2">
                {/* ...enlaces... */}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                {/* ...legal... */}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contacto</h4>
              <ul className="space-y-2">
                {/* ...contacto... */}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2023 Test. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}