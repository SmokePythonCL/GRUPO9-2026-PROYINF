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

module.exports = {
    simulateLoan    
};