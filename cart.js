function getCart() {
  return JSON.parse(localStorage.getItem("ph_cart")) || {};
}

function saveCart(cart) {
  localStorage.setItem("ph_cart", JSON.stringify(cart));
}

function getCartCount() {
  return Object.values(getCart()).reduce((a, b) => a + b, 0);
}

function getCartTotal() {
  let total = 0;
  const cart = getCart();
  for (const [id, qty] of Object.entries(cart)) {
    const p = PRODUCTS.find(x => x.id === id);
    if (p) total += p.price * qty;
  }
  return total;
}

function addToCart(id) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  const count = getCartCount();
  badge.textContent = count;
  badge.classList.toggle("hidden", count === 0);
}

const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

cartBtn.onclick = () => {
  cartOverlay.classList.remove("hidden");
  cartDrawer.classList.remove("translate-x-full");
  renderCart();
};

document.getElementById("closeCart").onclick = closeCart;
cartOverlay.onclick = closeCart;

function closeCart() {
  cartOverlay.classList.add("hidden");
  cartDrawer.classList.add("translate-x-full");
}

function renderCart() {
  const cart = getCart();
  const entries = Object.entries(cart);

  if (!entries.length) {
    cartItems.innerHTML = `<p class="text-slate-500 text-center">Cart is empty</p>`;
    cartTotal.textContent = "$0";
    return;
  }

  cartItems.innerHTML = entries.map(([id, qty]) => {
    const p = PRODUCTS.find(x => x.id === id);
    return `
      <div class="border rounded-xl p-4">
        <div class="flex justify-between">
          <div>
            <p class="font-semibold">${p.name}</p>
            <p class="text-sm">$${p.price} × ${qty}</p>
          </div>
          <p class="font-semibold">$${p.price * qty}</p>
        </div>
      </div>
    `;
  }).join("");

  cartTotal.textContent = `$${getCartTotal()}`;
}

document.getElementById("clearCart").onclick = () => {
  localStorage.removeItem("ph_cart");
  renderCart();
  updateCartBadge();
};

updateCartBadge();
