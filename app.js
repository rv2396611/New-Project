const PRODUCTS = [
  {
    id: "ph-elec-001",
    name: "Logitech MX Master 3S Wireless Mouse",
    category: "Electronics",
    price: 99,
    rating: 4.8,
    reviews: 2143,
    stock: 24,
    badge: "Bestseller",
    description: "Advanced ergonomic mouse with ultra-fast scrolling and silent clicks."
  },
  {
    id: "ph-elec-002",
    name: "Keychron K8 Pro Mechanical Keyboard",
    category: "Electronics",
    price: 179,
    rating: 4.7,
    reviews: 987,
    stock: 12,
    badge: "Pro Choice",
    description: "Hot-swappable mechanical keyboard with RGB and aluminum frame."
  },
  {
    id: "ph-elec-003",
    name: "Sony WH-1000XM5 Noise Cancelling Headphones",
    category: "Electronics",
    price: 349,
    rating: 4.9,
    reviews: 5321,
    stock: 8,
    badge: "Top Rated",
    description: "Industry-leading noise cancellation with premium sound quality."
  },
  {
    id: "ph-life-001",
    name: "Bellroy Classic Backpack 20L",
    category: "Lifestyle",
    price: 129,
    rating: 4.6,
    reviews: 764,
    stock: 18,
    badge: "New",
    description: "Slim everyday backpack with sustainable materials and smart storage."
  },
  {
    id: "ph-home-001",
    name: "Philips Smart LED Desk Lamp",
    category: "Home",
    price: 59,
    rating: 4.4,
    reviews: 432,
    stock: 30,
    badge: "Value",
    description: "Eye-care desk lamp with adjustable brightness and color temperature."
  },
  {
    id: "ph-life-002",
    name: "Hydro Flask Stainless Steel Water Bottle (1L)",
    category: "Lifestyle",
    price: 45,
    rating: 4.7,
    reviews: 1890,
    stock: 50,
    badge: "Eco",
    description: "Double-wall insulated bottle keeps drinks cold for 24 hours."
  }
];


function productCard(p) {
  return `
    <div class="bg-white border rounded-2xl shadow-sm hover:shadow-lg transition duration-200">
      <div class="p-6 flex flex-col h-full">

        <!-- Badge -->
        <div class="flex justify-between items-start mb-3">
          <span class="text-xs text-slate-500">${p.category}</span>
          <span class="text-xs font-medium bg-slate-100 px-3 py-1 rounded-full">
            ${p.badge}
          </span>
        </div>

        <!-- Product Name -->
        <h3 class="font-semibold text-lg leading-snug mb-2">
          ${p.name}
        </h3>

        <!-- Description -->
        <p class="text-sm text-slate-600 mb-4 line-clamp-2">
          ${p.description}
        </p>

        <!-- Rating -->
        <div class="flex items-center gap-2 text-sm text-slate-600 mb-4">
          <span>⭐ ${p.rating}</span>
          <span>(${p.reviews.toLocaleString()} reviews)</span>
        </div>

        <!-- Spacer -->
        <div class="flex-grow"></div>

        <!-- Price + Stock -->
        <div class="flex items-center justify-between mb-4">
          <span class="text-xl font-bold">$${p.price}</span>
          <span class="text-xs text-slate-500">
            ${p.stock > 10 ? "In stock" : "Limited stock"}
          </span>
        </div>

        <!-- CTA -->
        <button
          data-add="${p.id}"
          class="w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
          Add to Cart
        </button>
      </div>
    </div>
  `;
}

const productGrid = document.getElementById("productGrid");

function renderProducts() {
  productGrid.innerHTML = PRODUCTS.map(productCard).join("");
}

renderProducts();

// delegate to cart.js
productGrid.addEventListener("click", e => {
  const btn = e.target.closest("[data-add]");
  if (btn) addToCart(btn.dataset.add);
});