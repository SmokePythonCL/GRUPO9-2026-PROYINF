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
    name: 'Demo User',
    email: 'demo@flashloan.cl'
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
  const user = users[email] || { id: 'u_anon', name: 'Invitado', email };
  const token = 'mock-token-' + Math.random().toString(36).slice(2);
  return res.json({ token, user });
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

// User (mock)
app.get('/api/user', (req, res) => {
  res.json(users['demo@flashloan.cl']);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Mock API running on http://localhost:${PORT}`));
