// Banco de dados fictício de Brainrots
const products = [
  {
    id: 1,
    name: "Skibidi Toilet Edição Dourada",
    category: "classicos",
    rarity: "Mítico",
    aura: 1500,
    price: 49.90,
    emoji: "🚽",
    desc: "Canta a música tema em loop infinito na sua cabeça durante provas."
  },
  {
    id: 2,
    name: "Curso Intensivo de Mewing",
    category: "sigma",
    rarity: "Lendário",
    aura: 3000,
    price: 79.90,
    emoji: "🤫",
    desc: "Inclui guia de postura mandibular e proibição oficial de falar por 48h."
  },
  {
    id: 3,
    name: "Grimace Shake Sabor Ohio",
    category: "ohio",
    rarity: "Amaldiçoado",
    aura: 2200,
    price: 35.00,
    emoji: "🥤",
    desc: "Bebida roxa misteriosa. Efeitos colaterais incluem teletransporte aleatório."
  },
  {
    id: 4,
    name: "Poção de Rizz Nível 100",
    category: "aura",
    rarity: "Épico",
    aura: 2500,
    price: 59.90,
    emoji: "😎",
    desc: "Aumenta automaticamente o carisma em qualquer conversa no intervalo."
  },
  {
    id: 5,
    name: "Estátua Moai Sigma 🗿",
    category: "sigma",
    rarity: "Supremo",
    aura: 5000,
    price: 120.00,
    emoji: "🗿",
    desc: "Reação impassível garantida diante de qualquer situação caótica."
  },
  {
    id: 6,
    name: "Passaporte VIP para Ohio",
    category: "ohio",
    rarity: "Raro",
    aura: 1800,
    price: 42.50,
    emoji: "🌪️",
    desc: "Acesso liberado às leis da física completamente quebradas."
  },
  {
    id: 7,
    name: "Trilha Sonora Fanum Tax",
    category: "classicos",
    rarity: "Comum",
    aura: 900,
    price: 19.90,
    emoji: "🍟",
    desc: "Permite cobrar 15% da batata frita de qualquer amigo sem avisar."
  },
  {
    id: 8,
    name: "Modo Nonchalant Absoluto",
    category: "aura",
    rarity: "Lendário",
    aura: 4200,
    price: 89.90,
    emoji: "🧊",
    desc: "Você nunca mais demonstra surpresa, mesmo se cair um meteoro na escola."
  }
];

let cart = [];
let currentCategory = "todos";
let searchQuery = "";

// Elementos do DOM
const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filter-btn");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const totalAuraEl = document.getElementById("totalAura");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalAuraBadge = document.getElementById("modalAuraBadge");

// Formatar moeda BRL
function formatPrice(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Renderizar produtos na tela
function renderProducts() {
  const filtered = products.filter(item => {
    const matchCategory = currentCategory === "todos" || item.category === currentCategory;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery) ||
      item.desc.toLowerCase().includes(searchQuery);
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    productsGrid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center;">Nenhum brainrot encontrado com esse nome 😢</p>`;
    return;
  }

  productsGrid.innerHTML = filtered.map(product => `
    <div class="product-card">
      <div>
        <div class="card-top">
          <span class="rarity-badge">${product.rarity}</span>
          <span class="aura-tag">+${product.aura} Aura</span>
        </div>
        <div class="product-emoji">${product.emoji}</div>
        <h3>${product.name}</h3>
        <p>${product.desc}</p>
      </div>
      <div class="card-footer">
        <span class="price">${formatPrice(product.price)}</span>
        <button class="add-btn" onclick="addToCart(${product.id})">+ Comprar</button>
      </div>
    </div>
  `).join("");
}

// Adicionar item ao carrinho
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  openCart();
}

// Alterar quantidade no carrinho
function changeQty(id, delta) {
  const index = cart.findIndex(item => item.id === id);
  if (index === -1) return;

  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  updateCartUI();
}

// Atualizar interface do carrinho
function updateCartUI() {
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalValue = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalAura = cart.reduce((acc, item) => acc + item.aura * item.qty, 0);

  cartCount.textContent = totalItems;
  cartTotal.textContent = formatPrice(totalValue);
  totalAuraEl.textContent = `+${totalAura.toLocaleString("pt-BR")} Aura`;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-msg">Seu inventário está vazio (-500 de Aura).</p>`;
    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="item-info">
        <h4>${item.emoji} ${item.name}</h4>
        <span>${formatPrice(item.price * item.qty)} • +${item.aura * item.qty} Aura</span>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    </div>
  `).join("");
}

// Abrir e fechar carrinho
function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
}

// Eventos
openCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.toLowerCase().trim();
  renderProducts();
});

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    renderProducts();
  });
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Adicione pelo menos um Brainrot ao carrinho antes de finalizar!");
    return;
  }

  const totalAura = cart.reduce((acc, item) => acc + item.aura * item.qty, 0);
  modalAuraBadge.textContent = `+${totalAura.toLocaleString("pt-BR")} DE AURA ADQUIRIDA`;

  cart = [];
  updateCartUI();
  closeCart();
  checkoutModal.classList.add("open");
});

closeModalBtn.addEventListener("click", () => {
  checkoutModal.classList.remove("open");
});

// Inicializar loja
renderProducts();