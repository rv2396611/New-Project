const Menu = [
  {
    id: "food-001",
    name: "Masala Dosa",
    category: "Breakfast",
    price: 120,
    rating: 4.8,
    reviews: 2143,
    stock: 24,
    badge: "Chef's pick",
    tags: ["Chef favorite", "South Indian"],
    description: "Crispy rice and lentil crepe with spiced potato filling and sambhar."
  },
  {
    id: "food-002",
    name: "Crispy Vada",
    category: "Breakfast",
    price: 80,
    rating: 4.7,
    reviews: 987,
    stock: 30,
    badge: "Popular",
    tags: ["Vegan friendly", "Snack"],
    description: "Golden fried lentil donuts served with sambar and chutney."
  },
  {
    id: "food-003",
    name: "Butter Poori",
    category: "Breakfast",
    price: 100,
    rating: 4.9,
    reviews: 5321,
    stock: 25,
    badge: "Bestseller",
    tags: ["Comfort", "Crowd favorite"],
    description: "Fluffy deep-fried bread with ghee, served with potato curry."
  },
  {
    id: "food-004",
    name: "Hyderabadi Biryani",
    category: "Lunch",
    price: 250,
    rating: 4.8,
    reviews: 1564,
    stock: 15,
    badge: "Signature",
    tags: ["Chef favorite", "Spiced"],
    description: "Fragrant basmati rice cooked with tender meat and aromatic spices."
  },
  {
    id: "food-005",
    name: "Chicken Tikka Masala",
    category: "Lunch",
    price: 320,
    rating: 4.6,
    reviews: 764,
    stock: 18,
    badge: "Popular",
    tags: ["Creamy", "North Indian"],
    description: "Succulent chicken pieces in creamy tomato-based sauce with rice."
  },
  {
    id: "food-006",
    name: "Paneer Butter Curry",
    category: "Lunch",
    price: 280,
    rating: 4.7,
    reviews: 1890,
    stock: 20,
    badge: "Vegetarian",
    tags: ["Paneer", "Mild"],
    description: "Soft paneer cubes in rich buttery tomato sauce with naan bread."
  },
  {
    id: "food-007",
    name: "Samosas (4 pcs)",
    category: "Snacks",
    price: 60,
    rating: 4.5,
    reviews: 543,
    stock: 40,
    badge: "Value",
    tags: ["Street food", "Crispy"],
    description: "Crispy fried pastry with spiced potato and pea filling."
  },
  {
    id: "food-008",
    name: "Spring Rolls",
    category: "Snacks",
    price: 90,
    rating: 4.6,
    reviews: 432,
    stock: 35,
    badge: "New",
    tags: ["Fusion", "Light"],
    description: "Fresh rice paper rolls filled with vegetables and served with dipping sauce."
  },
  {
    id: "food-009",
    name: "Mango Lassi",
    category: "Beverages",
    price: 70,
    rating: 4.8,
    reviews: 876,
    stock: 50,
    badge: "Refreshing",
    tags: ["Chilled", "Sweet"],
    description: "Creamy yogurt drink blended with fresh mangoes and a hint of cardamom."
  },
  {
    id: "food-010",
    name: "Gulab Jamun",
    category: "Desserts",
    price: 85,
    rating: 4.9,
    reviews: 1234,
    stock: 20,
    badge: "Favorite",
    tags: ["Classic", "Sweet"],
    description: "Soft milk solid dumplings soaked in warm sugar syrup with rose essence."
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

        <!-- Tags -->
        ${p.tags ? `<div class="flex flex-wrap gap-2 mb-4">
          ${p.tags.map(t => `<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">${t}</span>`).join('')}
        </div>` : ''}

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
  productGrid.innerHTML = Menu.map(productCard).join("");
}

renderProducts();

// delegate to cart.js
productGrid.addEventListener("click", e => {
  const btn = e.target.closest("[data-add]");
  if (btn) addToCart(btn.dataset.add);
});