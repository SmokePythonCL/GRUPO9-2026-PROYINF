import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const client = axios.create({
  baseURL: BASE_URL,
});

client.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function simulateLoan(amount, term) {
  if (!BASE_URL) throw new Error('No API configured');
  const { data } = await client.post('/api/loans', { amount, term, dryRun: true });
  return data;
}

export async function submitLoan(payload) {
  if (!BASE_URL) throw new Error('No API configured');
  const { data } = await client.post('/api/loans', payload);
  return data;
}

export async function login(email, password) {
  if (!BASE_URL) throw new Error('No API configured');
  const { data } = await client.post('/api/auth/login', { email, password });
  return data;
}

export async function register(payload) {
  if (!BASE_URL) throw new Error('No API configured');
  const { data } = await client.post('/api/auth/register', payload);
  return data;
}

export async function getUser() {
  if (!BASE_URL) throw new Error('No API configured');
  const { data } = await client.get('/api/user');
  return data;
}

export async function uploadDocuments(formData) {
  if (!BASE_URL) throw new Error('No API configured');
  const { data } = await client.post('/api/me/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

export async function getUserDocuments() {
  if (!BASE_URL) throw new Error('No API configured');
  const { data } = await client.get('/api/me/documents');
  return data;
}

export async function getLoanStatus(id) {
  if (!BASE_URL) throw new Error('No API configured');
  const { data } = await client.get(`/api/loans/${id}`);
  return data;
}

export async function updateUserProfile(payload) {
  if (!BASE_URL) throw new Error('No API configured');
  const { data } = await client.patch('/api/user', payload);
  return data;
}

export async function updateUserPaymentMethod(payload) {
  if (!BASE_URL) throw new Error('No API configured');
  const { data } = await client.put('/api/user/payment-method', payload);
  return data;
}

export async function signDocument() {
  if (!BASE_URL) throw new Error('No API configured');
  const { data } = await client.post('/api/loans/sign');
  return data;
}

export async function getUserCreditHistory() {
  if (!BASE_URL) throw new Error('No API configured');
  const { data } = await client.get('/api/user/credit-history');
  return data;
}

export async function getUserLoansHistory() {
  if (!BASE_URL) throw new Error('No API configured');
  const { data } = await client.get('/api/loans');
  return data;
}
