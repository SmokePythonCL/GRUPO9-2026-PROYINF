const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory stores for demo
let loans = {};
let users = {
  'demo@flashloan.cl': {
    id: 'u_1',
    nombre: 'Demo',
    apellido_paterno: 'User',
    apellido_materno: '',
    nacimiento: '1998-01-01',
    rut: '11111111-1',
    email: 'demo@flashloan.cl',
    telefono: '',
    direccion: '',
    paymentMethod: null
  }
};

// Utility: simple amortization calculation (same as frontend)
function simulateLoan(amount, term, rate = 0.012) {
  amount = Number(amount) || 0;
  term = Number(term) || 1;
  const monthly = (amount * rate) / (1 - Math.pow(1 + rate, -term));
  const total = monthly * term;
  return {
    amount,
    term,
    rate,
    monthly: Math.round(monthly),
    total: Math.round(total),
  };
}

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Auth (mock)
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body || {};
  const user = users[email] || {
    id: 'u_anon',
    nombre: 'Invitado',
    apellido_paterno: '',
    apellido_materno: '',
    nacimiento: '2000-01-01',
    rut: '00000000-0',
    email,
    telefono: '',
    direccion: '',
    paymentMethod: null
  };
  const token = 'mock-token-' + Math.random().toString(36).slice(2);
  return res.json({ token, user });
});

app.post('/api/auth/register', (req, res) => {
  const {
    nombre,
    apellido_paterno,
    apellido_materno,
    nacimiento,
    rut,
    email,
    password,
    telefono,
    direccion,
  } = req.body || {};

  if (!nombre || !apellido_paterno || !apellido_materno || !nacimiento || !rut || !email || !password || !telefono || !direccion) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  if (users[email]) {
    return res.status(409).json({ error: 'Email ya registrado' });
  }

  const user = {
    id: 'u_' + Math.random().toString(36).slice(2, 8),
    nombre,
    apellido_paterno,
    apellido_materno,
    nacimiento,
    rut,
    email,
    telefono,
    direccion,
    paymentMethod: null,
  };

  users[email] = user;
  const token = 'mock-token-' + Math.random().toString(36).slice(2);
  return res.status(201).json({ user, token });
});

// Loans: simulate
app.post('/api/loans/simulate', (req, res) => {
  const { amount, term } = req.body || {};
  const result = simulateLoan(amount, term);
  res.json(result);
});

// Loans: submit application
app.post('/api/loans/submit', (req, res) => {
  const id = 'loan_' + Math.random().toString(36).slice(2, 10);
  const { applicant = {}, documents = {}, amount, term } = req.body || {};
  const sim = simulateLoan(amount, term);
  const now = new Date();
  const eta = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes later
  const record = {
    id,
    createdAt: now.toISOString(),
    status: 'APPROVED',
    approvedAmount: sim.amount,
    interestRate: sim.rate,
    term: sim.term,
    monthly: sim.monthly,
    total: sim.total,
    eta: eta.toISOString(),
    applicant,
    documents,
  };
  loans[id] = record;
  res.status(201).json({ id, status: record.status, eta: record.eta, summary: record });
});

// Loans: status
app.get('/api/loans/:id/status', (req, res) => {
  const { id } = req.params;
  const record = loans[id];
  if (!record) return res.status(404).json({ error: 'Not found' });
  res.json({ id, status: record.status, eta: record.eta, monthly: record.monthly, total: record.total });
});

// Loans: sign with clave unica
app.post('/api/loans/sign', (req, res) => {
  setTimeout(() => {
    res.json({ success: true, message: 'Firma realizada correctamente' });
  }, 2000); // 2 seconds delay
});

// User: credit history
app.get('/api/user/credit-history', (req, res) => {
  const score = Math.floor(Math.random() * (900 - 300 + 1)) + 300;
  let risk = 'ALTO';
  let recommendedAmount = 1000000;
  
  if (score >= 700) {
    risk = 'BAJO';
    recommendedAmount = 7000000;
  } else if (score >= 500) {
    risk = 'MEDIO';
    recommendedAmount = 3500000;
  }
  
  res.json({
    score,
    risk,
    recommendedAmount,
    debts: Math.floor(Math.random() * 1000000),
    reportDate: new Date().toISOString()
  });
});

// User (mock)
app.get('/api/user', (req, res) => {
  res.json(users['demo@flashloan.cl']);
});

app.put('/api/user/update', (req, res) => {
  const current = users['demo@flashloan.cl'];
  const next = { ...current, ...(req.body || {}) };
  users['demo@flashloan.cl'] = next;
  res.json(next);
});

app.put('/api/user/payment-method', (req, res) => {
  const { cardNumber, expiry } = req.body || {};
  const digits = String(cardNumber || '').replace(/\D/g, '');
  if (digits.length < 12) return res.status(400).json({ error: 'Número de tarjeta inválido.' });
  if (!/^\d{2}\/\d{2}$/.test(String(expiry || ''))) return res.status(400).json({ error: 'Fecha inválida.' });

  const paymentMethod = {
    last4: digits.slice(-4),
    expiry,
    brand: /^4/.test(digits) ? 'visa' : 'unknown'
  };

  users['demo@flashloan.cl'] = {
    ...users['demo@flashloan.cl'],
    paymentMethod
  };

  res.json({ ok: true, paymentMethod });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Mock API running on http://localhost:${PORT}`));
