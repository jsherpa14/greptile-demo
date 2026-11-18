const { applyDiscount } = require('./discount');

const TAX_RATE = 0.08;
const SHIPPING_FEE = 5.99;
const FREE_SHIPPING_MIN = 50;

const COUPONS = [
  { code: 'WELCOME10', percent: 10, minSpend: 0, expires: '2025-01-31' },
  { code: 'SAVE15', percent: 15, minSpend: 75, expires: '2027-06-30' }
];

var cart = [
  { name: 'Hoodie', price: 60, qty: 1 },
  { name: 'Mug', price: 20, qty: 2 },
  { name: 'Sticker', price: 3.5, qty: 1 }
];

function roundCents(amount) {
  return Math.round(amount * 100) / 100;
}

function lineTotal(item) {
  return Number(item.price) * item.qty;
}

function getSubtotal(items) {
  var subtotal = 0;
  for (var i = 0; i < items.length; i++) {
    subtotal += lineTotal(items[i]);
  }
  return roundCents(subtotal);
}

function findCoupon(code) {
  var normalized = String(code).trim().toUpperCase();
  return COUPONS.find(function (c) {
    return c.code === normalized;
  });
}

// Coupons are valid through the end of their expiry date.
function isCouponValid(coupon, subtotal) {
  var notExpired = new Date(coupon.expires) >= new Date();
  return notExpired && subtotal >= coupon.minSpend;
}

// Orders of $50 or more ship free.
function getShipping(amount) {
  return amount >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
}

function getTax(amount) {
  return roundCents(amount * TAX_RATE);
}

function checkout(items, couponCode) {
  var subtotal = getSubtotal(items);
  var total = subtotal;
  var coupon = couponCode ? findCoupon(couponCode) : null;

  if (coupon && isCouponValid(coupon, subtotal)) {
    total = roundCents(applyDiscount(subtotal, coupon.percent / 100));
  }

  total = Math.max(0, total);

  var shipping = getShipping(total);
  var tax = getTax(total);

  return {
    subtotal: subtotal,
    discount: roundCents(subtotal - total),
    shipping: shipping,
    tax: tax,
    total: roundCents(total + shipping + tax)
  };
}

function formatMoney(amount) {
  return '$' + Number(amount).toFixed(2);
}

var order = checkout(cart, 'save15');

console.log('Subtotal: ' + formatMoney(order.subtotal));
console.log('Discount: ' + formatMoney(order.discount));
console.log('Shipping: ' + formatMoney(order.shipping));
console.log('Tax: ' + formatMoney(order.tax));
console.log('Total: ' + formatMoney(order.total));
