"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoanSimulator({ redirectTo = "/solicitar" }) {
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
      timestamp: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("currentSimulation", JSON.stringify(simulationData));
    }

    router.push(redirectTo);
  };

  const showComparison = () => {
    const { monthly } = calculateMonthly(amount, term);

    const competitors = [
      { name: "PrestamoCL", monthlyPayment: monthly },
      { name: "Banco Competidor A", monthlyPayment: Math.round(monthly * 1.1) },
      { name: "Fintech Competidor B", monthlyPayment: Math.round(monthly * 1.05) },
      { name: "Banco Competidor C", monthlyPayment: Math.round(monthly * 1.15) },
    ];

    const comparisonMessage = `Comparación de cuotas mensuales:\n\n${
      competitors.map((comp) => `${comp.name}: ${formatCurrency(comp.monthlyPayment)}/mes`).join("\n")
    }\n\n* Simulación para ${formatCurrency(amount)} a ${term} meses`;

    alert(comparisonMessage);
  };

  const { monthly, total, rateText } = calculateMonthly(amount, term);

  return (
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
          <input
            type="text"
            id="amount-display"
            value={formatCurrency(amount)}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-xl font-bold text-amber-500"
          />
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
          <input
            type="text"
            id="term-display"
            value={`${term} meses`}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-xl font-bold text-amber-500"
          />
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
        className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-bold transition duration-300 shadow-md mb-3"
      >
        Solicitar este préstamo
      </button>

      <div className="mt-0 text-center">
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
  );
}
