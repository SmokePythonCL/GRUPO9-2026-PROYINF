"use client";

import { useEffect, useState } from "react";
import { getUserLoansHistory } from "@/lib/api";

export default function HistorialPrestamos() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getUserLoansHistory();
        setLoans(data);
      } catch (err) {
        console.error("Error fetching loans history:", err);
        setError("No se pudo cargar el historial de préstamos.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("es-CL");
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'activo':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider">Activo</span>;
      case 'pagado':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold uppercase tracking-wider">Pagado</span>;
      case 'rechazado':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold uppercase tracking-wider">Rechazado</span>;
      case 'atrasado':
        return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold uppercase tracking-wider">Atrasado</span>;
      case 'cancelado':
        return <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold uppercase tracking-wider">Cancelado</span>;
      default:
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wider">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center animate-pulse">
        <p className="text-gray-500 font-medium">Cargando historial de préstamos...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Historial de Préstamos</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-medium">
          {error}
        </div>
      )}

      {loans.length === 0 && !error ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aún no tienes préstamos</h3>
          <p className="text-gray-500 max-w-sm mx-auto">Cuando solicites un préstamo, aparecerá aquí todo su historial del último año.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">ID Préstamo</th>
                <th className="px-6 py-4">Fecha Solicitud</th>
                <th className="px-6 py-4">F. Aprobación</th>
                <th className="px-6 py-4">F. Inicio</th>
                <th className="px-6 py-4">F. Vencimiento</th>
                <th className="px-6 py-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loans.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{loan.loan_id_str}</td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(loan.application_date)}</td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(loan.approval_date)}</td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(loan.start_date)}</td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(loan.due_date)}</td>
                  <td className="px-6 py-4 text-center">{getStatusBadge(loan.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
