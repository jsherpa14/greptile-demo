const { applyDiscount } = require('./discount');

var cart = [
  { name: 'Hoodie', price: 60, qty: 1 },
  { name: 'Mug', price: 20, qty: 2 }
];

var coupon = { code: 'SAVE15', percent: 15 };
var subtotal = 0;

for (var i = 0; i < cart.length; i++) {
  subtotal += cart[i].price * cart[i].qty;
}

var total = subtotal;

console.log('Subtotal: $' + subtotal.toFixed(2));
console.log('Total: $' + total.toFixed(2));
