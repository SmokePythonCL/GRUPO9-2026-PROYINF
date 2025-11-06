"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function FAQ() {
  const [openItems, setOpenItems] = useState({});

  useEffect(() => {
    // Cargar Feather Icons
    const loadFeather = () => {
      if (window.feather && typeof window.feather.replace === "function") {
        window.feather.replace();
      }
    };

    // Cargar script de Feather Icons si no está disponible
    if (typeof window !== 'undefined' && !window.feather) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/feather-icons';
      script.onload = loadFeather;
      document.head.appendChild(script);
    } else {
      loadFeather();
    }
  }, []);

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqItems = [
    {
      id: "pregunta1",
      question: "¿Cuáles son los costos de simular tu préstamo?",
      answer: "¡Simular tu préstamo tiene un costo cero! Nosotros ponemos a disposición nuestra tecnología para que tú puedas ver gratuitamente los costos relacionados a tu préstamo y decidas si nuestro servicio es de tu agrado."
    },
    {
      id: "pregunta2",
      question: "¿Abrir una cuenta nueva es muy complicado?",
      answer: "Para nada. Tú puedes crear una cuenta con cualquier correo que tengas y tu contraseña. De la misma manera, cuando ya tienes tu cuenta y se aprueba tu préstamo, el enviar tus datos biométricos y bancarios funciona con una tecnología de análisis de imagen, por lo que sin necesidad de ningún formulario, nos envías una foto clara de los documentos requeridos y en unos segundos serán reconocidos para finalmente realizar el préstamo."
    },
    {
      id: "pregunta3",
      question: "¿Cuáles son los requisitos para pedir un préstamo?",
      answer: `Luego de haber creado una cuenta, y teniendo aprobado un préstamo, es necesario que nos envíes una imagen de tu:
1. Cédula de identidad
2. Comprobante de domicilio
Todos estos son los mismos documentos que se solicitarían en una solicitud de préstamo presencial con cualquier banco.`
    },
    {
      id: "pregunta4",
      question: "¿Qué pasa si mi préstamo se cancela por un error?",
      answer: "Si por algún error de la página tu préstamo se cancela antes de ser efectuado, se te hará llegar una notificación por el medio que nos hallas indicado para que así tengas constancia de eso, y el préstamo podrá pedirse nuevamente sin ningún problema apenas te llegue la notificación: ningún tipo de préstamo será vinculado a tu cuenta si es que tuvo un error. Además, ese error en el préstamo anterior no impide la realización de préstamos posteriores."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
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
            <Link href="/" className="text-gray-600 hover:text-amber-500 font-medium">Inicio</Link>
            <Link href="/como_funciona" className="text-gray-600 hover:text-amber-500 font-medium">Cómo funciona</Link>
            <Link href="/beneficios" className="text-gray-600 hover:text-amber-500 font-medium">Beneficios</Link>
            <Link href="/faq" className="text-amber-500 font-medium">FAQ</Link>
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

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Preguntas Frecuentes</h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="text-xl font-bold text-gray-800 pr-4">{item.question}</span>
                  <span className={`text-amber-500 text-xl font-bold transition-transform duration-300 ${
                    openItems[item.id] ? 'rotate-45' : ''
                  }`}>
                    +
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${
                  openItems[item.id] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 whitespace-pre-line">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">¿Qué esperas para solicitar tu préstamo?</h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Dinero rápido, seguro y con la mejor tasa del mercado. Todo desde tu celular.
          </p>
          <Link href="/solicitar">
            <button className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold transition duration-300 shadow-lg flex items-center justify-center mx-auto">
              <i data-feather="zap" className="mr-2" /> Solicitar ahora
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
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
              <p className="text-gray-400 mb-4">
                La forma más rápida y sencilla de obtener dinero cuando lo necesites.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <i data-feather="facebook" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <i data-feather="twitter" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <i data-feather="instagram" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <i data-feather="linkedin" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Enlaces útiles</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Inicio</Link></li>
                <li><Link href="/como_funciona" className="text-gray-400 hover:text-white">Cómo funciona</Link></li>
                <li><Link href="/beneficios" className="text-gray-400 hover:text-white">Beneficios</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Términos y condiciones</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Política de privacidad</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Información legal</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Defensa del consumidor</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contacto</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <i data-feather="mail" className="text-gray-400 mr-2" />
                  <span className="text-gray-400">hola@PrestamoCL.cl</span>
                </li>
                <li className="flex items-center">
                  <i data-feather="phone" className="text-gray-400 mr-2" />
                  <span className="text-gray-400">Telefono</span>
                </li>
                <li className="flex items-center">
                  <i data-feather="map-pin" className="text-gray-400 mr-2" />
                  <span className="text-gray-400">Dirección</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 PrestamoCL. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}