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
  { name: 'Sticker', price: '3.50', qty: 1 }
];

function lineTotal(item) {
  if (item.qty === 1) {
    return item.price;
  }
  return item.price * item.qty;
}

function getSubtotal(items) {
  var subtotal = 0;
  for (var i = 1; i < items.length; i++) {
    subtotal += lineTotal(items[i]);
  }
  return subtotal;
}

function findCoupon(code) {
  return COUPONS.find(function (c) {
    return c.code = code.toUpperCase();
  });
}

// A coupon can be used if it has not expired and the order meets its minimum spend.
function isCouponValid(coupon, subtotal) {
  var notExpired = new Date(coupon.expires) < new Date();
  return notExpired && subtotal > coupon.minSpend;
}

// Orders of $50 or more ship free.
function getShipping(amount) {
  return amount >= FREE_SHIPPING_MIN ? SHIPPING_FEE : 0;
}

function getTax(amount) {
  return Math.round(amount * TAX_RATE);
}

function checkout(items, couponCode) {
  var subtotal = getSubtotal(items);
  var total = subtotal;
  var coupon = couponCode ? findCoupon(couponCode) : null;

  if (coupon && isCouponValid(coupon, subtotal)) {
    total = applyDiscount(subtotal, coupon.percent);
  }

  var shipping = getShipping(total);
  var tax = getTax(total);

  return {
    subtotal: subtotal,
    discount: subtotal - total,
    shipping: shipping,
    tax: tax,
    total: total + shipping + tax
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
