function detectCardBrand(cardNumber) {
  if (/^4/.test(cardNumber)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(cardNumber)) return 'mastercard';
  if (/^3[47]/.test(cardNumber)) return 'amex';
  if (/^6(?:011|5)/.test(cardNumber)) return 'discover';
  return 'unknown';
}

function isLuhnValid(cardNumber) {
  let sum = 0;
  let shouldDouble = false;

  for (let i = cardNumber.length - 1; i >= 0; i -= 1) {
    let digit = Number(cardNumber[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

module.exports = {
    detectCardBrand,
    isLuhnValid
};