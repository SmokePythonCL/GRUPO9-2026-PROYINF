"use client";

import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import feather from "feather-icons";
import { getUser, getUserDocuments, getUserCreditHistory, getUserLoansHistory } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MiCuentaPage() {
  const [docs, setDocs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loanSummary, setLoanSummary] = useState(null);
  const [creditHistory, setCreditHistory] = useState(null);
  const [realLoans, setRealLoans] = useState([]);
  const paymentChartRef = useRef(null);
  const required = ["carnet_frontal", "carnet_trasera", "comprobante_domicilio"];
  const router = useRouter();

  const handleAcceptProposal = (amount, term, rate) => {
    const monthly = (amount * rate) / (1 - Math.pow(1 + rate, -term));
    const total = monthly * term;
    const simulation = {
      amount,
      term,
      monthlyPayment: Math.round(monthly),
      totalPayment: Math.round(total),
      interestRate: rate
    };
    localStorage.setItem('currentSimulation', JSON.stringify(simulation));
    router.push('/solicitar');
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const formatBirthDate = (rawDate) => {
    if (!rawDate) return "No disponible";

    const dateText = String(rawDate).slice(0, 10);
    const [year, month, day] = dateText.split("-").map(Number);

    if (!year || !month || !day) return "No disponible";

    return new Date(year, month - 1, day).toLocaleDateString("es-CL");
  };

  const buildRecommendedLoan = (userProfile, userDocs, userPaymentMethod) => {
    const rate = 0.012;
    const term = 12;

    // Score de confianza simple basado en datos ya disponibles del usuario.
    let score = 0;

    if (userProfile?.telefono) score += 1;
    if (userProfile?.direccion) score += 1;
    if (userProfile?.nacimiento) score += 1;
    if (Array.isArray(userDocs) && userDocs.length >= 3) score += 2;
    if (userPaymentMethod?.last4) score += 2;

    let amount = 2000000;
    if (score >= 3) amount = 3500000;
    if (score >= 5) amount = 5000000;
    if (score >= 7) amount = 7000000;

    // Ajuste por edad (sin bajar de 1M ni subir de 20M).
    if (userProfile?.nacimiento) {
      const birthYear = Number(String(userProfile.nacimiento).slice(0, 4));
      const currentYear = new Date().getFullYear();
      const age = birthYear ? currentYear - birthYear : null;

      if (age !== null && age < 23) amount -= 500000;
      if (age !== null && age >= 30 && age < 45) amount += 500000;
      if (age !== null && age >= 45) amount += 1000000;
    }

    amount = Math.min(20000000, Math.max(1000000, amount));

    const monthly = Math.round((amount * rate) / (1 - Math.pow(1 + rate, -term)));
    const total = monthly * term;

    return {
      amount,
      term,
      rate,
      monthly,
      total,
    };
  };

  useEffect(() => {
    feather.replace();

    const stored = localStorage.getItem("user");
    let currentUser = null;
    if (stored) {
      const u = JSON.parse(stored);
      currentUser = u;
      setProfile(u);
      setPaymentMethod(u.paymentMethod || null);
    }

    const storedLoanSummary = localStorage.getItem("loanSummary");

    if (storedLoanSummary) {
      const parsed = JSON.parse(storedLoanSummary);
      const belongsToCurrentUser =
        currentUser &&
        ((parsed.userId && parsed.userId === currentUser.id) ||
          (parsed.userEmail && parsed.userEmail === currentUser.email) ||
          (parsed.userRut && parsed.userRut === currentUser.rut));

      if (belongsToCurrentUser) {
        setLoanSummary(parsed);
      } else {
        setLoanSummary(null);
      }
    }

    (async () => {
      try {
        const freshUser = await getUser();
        setProfile(freshUser);
        setPaymentMethod(freshUser?.paymentMethod || null);
        localStorage.setItem("user", JSON.stringify(freshUser));

        const rawLoan = localStorage.getItem("loanSummary");
        if (rawLoan) {
          const parsed = JSON.parse(rawLoan);
          const belongsToFreshUser =
            (parsed.userId && parsed.userId === freshUser.id) ||
            (parsed.userEmail && parsed.userEmail === freshUser.email) ||
            (parsed.userRut && parsed.userRut === freshUser.rut);

          if (belongsToFreshUser) {
            setLoanSummary(parsed);
          } else {
            setLoanSummary(null);
          }
        }
        
        // Fetch credit history if no active loan is shown
        if (!rawLoan || !loanSummary) {
          try {
            const ch = await getUserCreditHistory();
            setCreditHistory(ch);
          } catch (e) {}  
        }

      } catch {
        // Si falla perfil, mantenemos la info del localStorage
        if (!loanSummary) {
          try {
            const ch = await getUserCreditHistory();
            setCreditHistory(ch);
          } catch (e) {}
        }
      }

      try {
        const loansList = await getUserLoansHistory();
        setRealLoans(loansList || []);

        if (!loansList || loansList.length === 0) {
          localStorage.removeItem("loanSummary");
          setLoanSummary(null);
        }
      } catch (e) {}
    })();

    const ctx = document.getElementById("paymentChart");
    if (ctx) {
      const paid = Number(loanSummary?.paidInstallments || 0);
      const pendingInstallments = Number(loanSummary?.pendingInstallments || 0);

      if (paymentChartRef.current) {
        paymentChartRef.current.destroy();
      }

      paymentChartRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Pagadas", "Pendientes"],
          datasets: [
            {
              label: "Cantidad de cuotas",
              data: [paid, pendingInstallments],
            },
          ],
        },
      });
    }

    // Cargar documentos
    (async () => {
      try {
        const list = await getUserDocuments();
        setDocs(list || []);
      } catch (e) {
        // Ignorar error en UI, podría no estar autenticado
      }
    })();
    return () => {
      if (paymentChartRef.current) {
        paymentChartRef.current.destroy();
        paymentChartRef.current = null;
      }
    };
  }, [loanSummary?.paidInstallments, loanSummary?.pendingInstallments, realLoans.length]);

  const present = new Set(docs.map(d => d.tipo));
  const pending = required.filter(r => !present.has(r));
  
  useEffect(() => {
    feather.replace();
  }, [realLoans, docs]);

  const nombreCompleto = [profile?.nombre, profile?.apellido_paterno, profile?.apellido_materno]
    .filter(Boolean)
    .join(" ");
  const recommendedLoan = buildRecommendedLoan(profile, docs, paymentMethod);

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-5xl mx-auto px-4 py-8 grid gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Mi información</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <p><span className="font-semibold text-gray-700">Nombre:</span> <span className="text-gray-600">{nombreCompleto || "No disponible"}</span></p>
                <p><span className="font-semibold text-gray-700">RUT:</span> <span className="text-gray-600">{profile?.rut || "No disponible"}</span></p>
                <p><span className="font-semibold text-gray-700">Correo:</span> <span className="text-gray-600">{profile?.email || "No disponible"}</span></p>
                <p><span className="font-semibold text-gray-700">Teléfono:</span> <span className="text-gray-600">{profile?.telefono || "No disponible"}</span></p>
                <p><span className="font-semibold text-gray-700">Nacimiento:</span> <span className="text-gray-600">{formatBirthDate(profile?.nacimiento)}</span></p>
              </div>
            </div>
            <div className="md:pt-1">
              <Link href="/mi_cuenta/ajustes" className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg">
                Editar información (excepto RUT)
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Seguimiento de tu Solicitud</h3>
          {realLoans.length > 0 ? (
            <div className="space-y-4">
              {realLoans.slice(0, 3).map((loan, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-semibold text-gray-700">Préstamo ID: {loan.loan_id_str}</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      loan.status === 'activo' || loan.status === 'pagado' ? 'bg-green-100 text-green-700' :
                      loan.status === 'rechazado' || loan.status === 'cancelado' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {loan.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Timeline */}
                  <div className="flex items-center text-sm mb-4 mt-2">
                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mb-1">
                        <i data-feather="check" className="w-4 h-4"></i>
                      </div>
                      <span className="text-xs font-semibold text-gray-600 text-center">Solicitud<br/>enviada</span>
                    </div>
                    <div className={`h-1 flex-1 ${loan.status !== 'en revisión' && loan.application_date ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    
                    <div className="flex-1 flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                        loan.status === 'en revisión' ? 'bg-blue-500 text-white' : 
                        (loan.status === 'activo' || loan.status === 'rechazado' || loan.status === 'pagado' || loan.status === 'cancelado' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500')
                      }`}>
                        <i data-feather={loan.status === 'en revisión' ? 'clock' : 'check'} className="w-4 h-4"></i>
                      </div>
                      <span className="text-xs font-semibold text-gray-600 text-center">En<br/>revisión</span>
                    </div>
                    <div className={`h-1 flex-1 ${(loan.status === 'activo' || loan.status === 'pagado' || loan.status === 'cancelado' || loan.status === 'rechazado') ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    
                    <div className="flex-1 flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                        (loan.status === 'activo' || loan.status === 'pagado') ? 'bg-green-500 text-white' :
                        (loan.status === 'rechazado' || loan.status === 'cancelado') ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        <i data-feather={
                          (loan.status === 'activo' || loan.status === 'pagado') ? 'check' :
                          (loan.status === 'rechazado' || loan.status === 'cancelado') ? 'x' : 'circle'
                        } className="w-4 h-4"></i>
                      </div>
                      <span className="text-xs font-semibold text-gray-600 text-center">
                        {(loan.status === 'rechazado' || loan.status === 'cancelado') ? 'Rechazado' : 'Aprobado'}
                      </span>
                    </div>
                  </div>

                  {loan.status === 'rechazado' && loan.comments && (
                    <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded-lg">
                      <p className="text-sm text-red-800 font-semibold mb-1">Motivo del rechazo:</p>
                      <p className="text-sm text-red-700 mb-3">{loan.comments}</p>
                      <a href="mailto:agente@banco.cl" className="inline-block bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                        Contactar a mi agente
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-semibold text-amber-700">No tienes solicitudes en seguimiento</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Resumen del préstamo</h3>
          {loanSummary ? (
            <div>
              <div className="mb-4 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                Estado de solicitud: {loanSummary.status || "APPROVED"}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Cuotas pagadas</p>
                  <p className="text-2xl font-bold text-gray-800">{loanSummary.paidInstallments}</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Cuotas pendientes</p>
                  <p className="text-2xl font-bold text-gray-800">{loanSummary.pendingInstallments}</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Monto total del préstamo</p>
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(loanSummary.totalLoanAmount)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Tasa de interés</p>
                  <p className="text-2xl font-bold text-gray-800">{(Number(loanSummary.interestRate || 0) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-semibold text-amber-700 mb-2">No tienes solicitudes activas</p>
              
              {creditHistory && (
                <div className="mb-6 mt-4 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <h5 className="font-bold text-gray-800 mb-3 flex items-center">
                    <i data-feather="file-text" className="w-5 h-5 mr-2 text-indigo-500"></i>
                    Evaluación de Historial Crediticio Automatizada
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider">Score Crediticio</p>
                      <p className="font-bold text-xl text-indigo-700">{creditHistory.score}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider">Nivel de Riesgo</p>
                      <p className={`font-bold text-lg ${creditHistory.risk === 'BAJO' ? 'text-green-600' : creditHistory.risk === 'MEDIO' ? 'text-amber-500' : 'text-red-500'}`}>{creditHistory.risk}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider">Deuda Registrada</p>
                      <p className="font-semibold text-gray-800">{formatCurrency(creditHistory.debts)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider">Monto Máx. Aprobado</p>
                      <p className="font-bold text-lg text-green-600">{formatCurrency(creditHistory.recommendedAmount)}</p>
                    </div>
                  </div>
                </div>
              )}

              <h4 className="text-lg font-bold text-gray-800 mb-4">Préstamo recomendado para ti</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="rounded-lg border border-amber-200 bg-white p-3">
                  <p className="text-xs text-gray-500">Monto sugerido</p>
                  <p className="text-lg font-bold text-gray-800">{formatCurrency(creditHistory?.recommendedAmount || recommendedLoan.amount)}</p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-white p-3">
                  <p className="text-xs text-gray-500">Plazo</p>
                  <p className="text-lg font-bold text-gray-800">{recommendedLoan.term} meses</p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-white p-3">
                  <p className="text-xs text-gray-500">Cuota estimada</p>
                  <p className="text-lg font-bold text-gray-800">{formatCurrency((creditHistory?.recommendedAmount || recommendedLoan.amount) * recommendedLoan.rate / (1 - Math.pow(1 + recommendedLoan.rate, -recommendedLoan.term)))}</p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-white p-3">
                  <p className="text-xs text-gray-500">Tasa mensual</p>
                  <p className="text-lg font-bold text-gray-800">{(recommendedLoan.rate * 100).toFixed(1)}%</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="text-sm text-gray-600">Total estimado a pagar: <span className="font-semibold text-gray-800">{formatCurrency(((creditHistory?.recommendedAmount || recommendedLoan.amount) * recommendedLoan.rate / (1 - Math.pow(1 + recommendedLoan.rate, -recommendedLoan.term))) * recommendedLoan.term)}</span></p>
                <div className="flex space-x-3">
                  <Link href="/simular" className="inline-block border-2 border-amber-500 text-amber-600 hover:bg-amber-50 px-4 py-2 rounded-lg font-medium transition">
                    Simular otro
                  </Link>
                  <button onClick={() => handleAcceptProposal(creditHistory?.recommendedAmount || recommendedLoan.amount, recommendedLoan.term, recommendedLoan.rate)} className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition cursor-pointer">
                    Aceptar propuesta
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Resumen de pagos</h3>
          <div style={{ height: "300px" }}>
            <canvas id="paymentChart"></canvas>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Documentos</h3>
          <p className="text-gray-600 mb-4">
            Gestiona tu carnet y comprobante de domicilio. {pending.length > 0 ? `Pendientes: ${pending.length}` : 'Todo al día.'}
          </p>
          <div className="flex gap-3">
            <a href="/registro/documentos" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded">Subir/gestionar documentos</a>
            <a href="/mi_cuenta/documentos" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">Ver mis documentos</a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Tarjeta para pagos automáticos</h3>
          <p className="text-gray-600 mb-4">
            {paymentMethod?.last4
              ? `Tarjeta registrada: **** **** **** ${paymentMethod.last4}${paymentMethod?.expiry ? ` (expira ${paymentMethod.expiry})` : ""}`
              : "No tienes una tarjeta registrada todavía."}
          </p>
          <Link href="/mi_cuenta/ajustesTarjeta" className="inline-block bg-gray-900 hover:bg-black text-white px-4 py-2 rounded">
            Cambiar tarjeta
          </Link>
        </div>
      </main>
    </div>
  );
}
