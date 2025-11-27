"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import SessionLinks from "@/components/SessionLinks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
      <Header active="faq" />

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
      <Footer />
    </div>
  );
}