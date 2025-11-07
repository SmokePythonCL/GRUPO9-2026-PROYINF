import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const client = axios.create({
  baseURL: BASE_URL,
});

export async function simulateLoan(amount, term) {
  if (!BASE_URL) throw new Error('No API configured');
  const { data } = await client.post('/api/loans/simulate', { amount, term });
  return data;
}

export async function submitLoan(payload) {
  if (!BASE_URL) throw new Error('No API configured');
  const { data } = await client.post('/api/loans/submit', payload);
  return data;
}

export async function login(email, password) {
  if (!BASE_URL) throw new Error('No API configured');
  const { data } = await client.post('/api/auth/login', { email, password });
  return data;
}

export async function getUser() {
  if (!BASE_URL) throw new Error('No API configured');
  const { data } = await client.get('/api/user');
  return data;
}

export async function getLoanStatus(id) {
  if (!BASE_URL) throw new Error('No API configured');
  const { data } = await client.get(`/api/loans/${id}/status`);
  return data;
}
