// discountRate is a fraction between 0 and 1.
// For example, a 15% discount uses 0.15.
function applyDiscount(amount, discountRate) {
  return amount - amount * discountRate;
}

module.exports = { applyDiscount };
