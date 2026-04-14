// ============================================
// MYSTORE — Luxury JS Engine
// ============================================

const API_BASE = "";

// ============================================
// PAGE TRANSITION SYSTEM
// ============================================
(function initPageTransitions() {
  // Create the overlay element
  const overlay = document.createElement("div");
  overlay.id = "page-transition";
  document.body.appendChild(overlay);

  // Animate page IN (content fades up after load)
  window.addEventListener("DOMContentLoaded", () => {
    overlay.classList.add("leaving");
    setTimeout(() => overlay.style.display = "none", 700);
  });

  // Intercept link clicks for smooth exit
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href");
    // Only for same-origin HTML pages, skip anchors and external
    if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel") || link.target === "_blank") return;
    // Skip admin links handled separately
    if (link.classList.contains("no-transition")) return;

    e.preventDefault();
    overlay.style.display = "block";
    overlay.classList.remove("leaving");
    // Animate IN
    requestAnimationFrame(() => {
      overlay.classList.add("entering");
      setTimeout(() => { window.location.href = href; }, 600);
    });
  });
})();

// ============================================
// SCROLL REVEAL (Intersection Observer)
// ============================================
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children").forEach(el => {
    observer.observe(el);
  });
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function toast(message, type = "info", duration = 3200) {
  const icons = { success: "✅", error: "❌", info: "ℹ️", cart: "🛒", warning: "⚠️" };
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type] || "ℹ️"}</span><span class="toast-text">${message}</span>`;
  container.appendChild(el);
  setTimeout(() => {
    el.style.transition = "opacity 0.4s, transform 0.4s";
    el.style.opacity = "0";
    el.style.transform = "translateX(80px) scale(0.85)";
    setTimeout(() => el.remove(), 400);
  }, duration);
}

// ============================================
// CART (localStorage)
// ============================================
const Cart = {
  get() { return JSON.parse(localStorage.getItem("cart") || "[]"); },
  save(cart) { localStorage.setItem("cart", JSON.stringify(cart)); this.updateCount(); },
  add(product, qty = 1) {
    const cart = this.get();
    const idx = cart.findIndex(i => i.id === product.id);
    if (idx >= 0) {
      cart[idx].qty = Math.min(cart[idx].qty + qty, product.stock >= 999 ? 999 : product.stock);
    } else {
      cart.push({ ...product, qty });
    }
    this.save(cart);
    toast(`"${product.name.slice(0, 28)}..." added! 🎉`, "cart");
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  updateQty(id, qty) {
    const cart = this.get();
    const idx = cart.findIndex(i => i.id === id);
    if (idx >= 0) qty <= 0 ? cart.splice(idx, 1) : (cart[idx].qty = qty);
    this.save(cart);
  },
  clear() { localStorage.removeItem("cart"); this.updateCount(); },
  total() { return this.get().reduce((s, i) => s + i.price * i.qty, 0); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  updateCount() {
    const c = document.getElementById("cart-count");
    const n = this.count();
    if (c) {
      c.textContent = n;
      c.style.display = n > 0 ? "flex" : "none";
      // Animate the count badge
      if (n > 0) { c.style.animation = "none"; requestAnimationFrame(() => c.style.animation = "bounce-in 0.4s cubic-bezier(0.34,1.56,0.64,1)"); }
    }
  },
};

// ============================================
// WISHLIST
// ============================================
const Wishlist = {
  get() { return JSON.parse(localStorage.getItem("wishlist") || "[]"); },
  toggle(id) {
    let w = this.get();
    const inList = w.includes(id);
    w = inList ? w.filter(i => i !== id) : [...w, id];
    localStorage.setItem("wishlist", JSON.stringify(w));
    return !inList;
  },
  has(id) { return this.get().includes(id); },
};

// ============================================
// API HELPERS
// ============================================
async function fetchProducts(params = {}) {
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`/api/products${q ? "?" + q : ""}`);
  return res.json();
}
async function fetchSettings() {
  const res = await fetch("/api/settings");
  return res.json();
}

// ============================================
// RENDER STARS
// ============================================
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return "★".repeat(full) + (half ? "⯨" : "") + "☆".repeat(empty);
}

// ============================================
// RENDER PRODUCT CARD
// ============================================
function renderProductCard(p, delay = 0) {
  const discount = p.originalPrice > p.price
    ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
  const typeLabels = { own: "Our Product", affiliate: "Affiliate", digital: "Digital" };
  const typeClass = { own: "type-own", affiliate: "type-affiliate", digital: "type-digital" };
  const inWishlist = Wishlist.has(p.id);

  let actionBtn = "";
  if (p.type === "affiliate") {
    if (p.affiliateMode === "B") {
      actionBtn = `<a href="/product-detail.html?id=${p.id}" class="btn-buy btn-buy-affiliate">VIEW DETAILS →</a>`;
    } else {
      actionBtn = `<a href="${p.affiliateUrl || "#"}" target="_blank" rel="noopener" class="btn-buy btn-buy-affiliate">BUY NOW 🔗</a>`;
    }
  } else if (p.type === "digital") {
    actionBtn = `<button class="btn-buy btn-buy-digital" onclick="addToCart('${p.id}')">DOWNLOAD 📥</button>`;
  } else {
    actionBtn = `<button class="btn-buy btn-buy-primary" onclick="addToCart('${p.id}')">ADD TO CART</button>`;
  }

  const badgeMap = { "50% OFF": "badge-sale", "NEW": "badge-new", "HOT": "badge-hot", "BESTSELLER": "badge-bestseller", "LIMITED": "badge-sale" };
  const badgeClass = badgeMap[p.badge] || "";
  const desc = p.description ? (p.description.length > 85 ? p.description.slice(0, 85) + "…" : p.description) : "";

  return `
    <div class="product-card reveal" style="transition-delay:${delay}s" data-id="${p.id}">
      <div class="product-img-wrap">
        <img src="${p.image || "https://via.placeholder.com/400x400?text=No+Image"}" alt="${p.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
        ${p.badge ? `<span class="product-badge ${badgeClass}">${p.badge}</span>` : ""}
        <span class="product-type-badge ${typeClass[p.type] || ""}">${typeLabels[p.type] || p.type}</span>
        <button class="product-wishlist ${inWishlist ? "active" : ""}" onclick="toggleWishlist('${p.id}',this)" title="Wishlist">
          ${inWishlist ? "❤️" : "🤍"}
        </button>
      </div>
      <div class="product-body">
        <div class="product-cat">${p.category}</div>
        <a href="/product-detail.html?id=${p.id}" class="product-name">${p.name}</a>
        <p class="product-desc">${desc}</p>
        <div class="product-rating">
          <span class="stars">${renderStars(p.rating || 4.5)}</span>
          <span class="rating-count">(${p.reviews || 0})</span>
        </div>
        <div class="product-price">
          <span class="price-current">₹${(p.price || 0).toLocaleString()}</span>
          ${p.originalPrice > p.price ? `<span class="price-original">₹${p.originalPrice.toLocaleString()}</span>` : ""}
          ${discount > 0 ? `<span class="price-discount">${discount}% off</span>` : ""}
        </div>
        <div class="product-actions">
          ${actionBtn}
          ${p.type !== "affiliate" ? `<button class="btn-cart-icon" onclick="addToCart('${p.id}')" title="Add to cart">🛒</button>` : ""}
        </div>
      </div>
    </div>`;
}

// ============================================
// ADD TO CART (by ID)
// ============================================
window._productsCache = {};
async function addToCart(productId) {
  let product = window._productsCache[productId];
  if (!product) {
    try {
      const res = await fetch(`/api/products/${productId}`);
      product = await res.json();
      window._productsCache[productId] = product;
    } catch { toast("Error adding to cart", "error"); return; }
  }
  Cart.add(product);
}

// ============================================
// WISHLIST TOGGLE
// ============================================
function toggleWishlist(id, btn) {
  const added = Wishlist.toggle(id);
  btn.innerHTML = added ? "❤️" : "🤍";
  btn.classList.toggle("active", added);
  // Heartbeat animation
  btn.style.transform = "scale(1.4)";
  setTimeout(() => btn.style.transform = "", 300);
  toast(added ? "Added to wishlist ❤️" : "Removed from wishlist", added ? "success" : "info");
}

// ============================================
// NAVBAR: Scroll shrink + hamburger + active link
// ============================================
function initNavbar() {
  // Scroll shrink effect
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
      const s = window.scrollY;
      navbar.classList.toggle("scrolled", s > 50);
      lastScroll = s;
    }, { passive: true });
  }

  // Hamburger menu
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      hamburger.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("open");
        hamburger.classList.remove("open");
      }
    });
  }

  // Smart active nav link based on URL
  document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const typeParam = params.get("type");

  if (path.includes("products") && typeParam === "digital") {
    document.querySelectorAll(".nav-link").forEach(l => { if (l.href && l.href.includes("type=digital")) l.classList.add("active"); });
  } else if (path.includes("products") && typeParam === "affiliate") {
    document.querySelectorAll(".nav-link").forEach(l => { if (l.href && l.href.includes("type=affiliate")) l.classList.add("active"); });
  } else if (path.includes("products")) {
    document.querySelectorAll(".nav-link").forEach(l => { if (l.getAttribute("href") === "/products.html") l.classList.add("active"); });
  } else if (path === "/" || path.endsWith("index.html")) {
    document.querySelectorAll(".nav-link").forEach(l => { if (l.getAttribute("href") === "/") l.classList.add("active"); });
  }

  Cart.updateCount();
}

// ============================================
// SEARCH — with Enter key
// ============================================
function initSearch() {
  document.querySelectorAll(".nav-search input, #search-input").forEach(input => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && input.value.trim()) {
        window.location.href = `/products.html?search=${encodeURIComponent(input.value.trim())}`;
      }
    });
  });
  document.querySelectorAll(".nav-search-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = btn.closest(".nav-search")?.querySelector("input");
      if (input?.value.trim()) window.location.href = `/products.html?search=${encodeURIComponent(input.value.trim())}`;
    });
  });
}

// ============================================
// APPLY STORE SETTINGS
// ============================================
async function applySettings() {
  try {
    const s = await fetchSettings();
    document.querySelectorAll(".store-name").forEach(el => el.textContent = s.storeName || "MyStore");
    document.querySelectorAll(".store-tagline").forEach(el => el.textContent = s.tagline || "");
  } catch {}
}

// ============================================
// CURSOR GLOW (luxury pointer effect)
// ============================================
function initCursorGlow() {
  // Only on non-touch devices
  if (window.matchMedia("(hover: none)").matches) return;
  const glow = document.createElement("div");
  glow.id = "cursor-glow";
  glow.style.cssText = `
    position:fixed; width:300px; height:300px; border-radius:50%;
    background:radial-gradient(circle, rgba(79,70,229,.06) 0%, transparent 70%);
    pointer-events:none; z-index:9998; transform:translate(-50%,-50%);
    transition:left .12s ease, top .12s ease; left:-200px; top:-200px;
  `;
  document.body.appendChild(glow);
  document.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  }, { passive: true });
}

// ============================================
// COUNTER ANIMATION (for hero stats)
// ============================================
function animateCounter(el, target, suffix = "", duration = 1500) {
  const start = 0;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = Math.floor(eased * target);
    el.textContent = value.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const val = el.dataset.count;
        const suffix = el.dataset.suffix || "";
        if (val) animateCounter(el, parseInt(val), suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach(el => observer.observe(el));
}

// ============================================
// RIPPLE EFFECT on buttons
// ============================================
function createRipple(e) {
  const btn = e.currentTarget;
  const ripple = document.createElement("span");
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.cssText = `
    position:absolute; width:${size}px; height:${size}px; border-radius:50%;
    background:rgba(255,255,255,.25); transform:scale(0); animation:ripple .6s ease-out;
    top:${e.clientY - rect.top - size/2}px; left:${e.clientX - rect.left - size/2}px;
    pointer-events:none;
  `;
  btn.style.position = "relative"; btn.style.overflow = "hidden";
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
}
// Add ripple CSS
const rippleCSS = document.createElement("style");
rippleCSS.textContent = `@keyframes ripple { to { transform:scale(2.5); opacity:0; } }`;
document.head.appendChild(rippleCSS);

function initRipples() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button, .btn-buy, .checkout-btn, .cart-btn");
    if (btn) createRipple(Object.assign(e, { currentTarget: btn }));
  });
}

// ============================================
// INIT ON LOAD
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initSearch();
  initScrollReveal();
  applySettings();
  initCursorGlow();
  initCounters();
  initRipples();
});

// ============================================
// BOTTOM NAV — Active state + cart count sync
// ============================================
function initBottomNav() {
  const nav = document.getElementById("bottom-nav");
  if (!nav) return;

  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const typeP = params.get("type");

  nav.querySelectorAll(".bottom-nav-item").forEach(item => {
    const page = item.dataset.page;
    let active = false;
    if (page === "home"     && (path === "/" || path.includes("index"))) active = true;
    if (page === "digital"  && path.includes("products") && typeP === "digital") active = true;
    if (page === "products" && path.includes("products") && !typeP) active = true;
    if (page === "cart"     && path.includes("cart")) active = true;
    if (active) item.classList.add("active");
  });

  // Sync cart badge in bottom nav
  function syncBnavCart() {
    const n = Cart.count();
    const badge = document.getElementById("bnav-cart-count");
    if (badge) { badge.textContent = n; badge.style.display = n > 0 ? "flex" : "none"; }
  }
  syncBnavCart();
  // Keep in sync with main cart updates
  const origSave = Cart.save.bind(Cart);
  Cart.save = function(cart) { origSave(cart); syncBnavCart(); };
}

// ============================================
// MOBILE SWIPE TO CLOSE nav menu
// ============================================
function initMobileSwipe() {
  const navLinks = document.querySelector(".nav-links");
  if (!navLinks) return;
  let startX = 0;
  navLinks.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive:true });
  navLinks.addEventListener("touchend", e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff < -60) { // swipe left closes menu
      navLinks.classList.remove("open");
      document.querySelector(".hamburger")?.classList.remove("open");
    }
  }, { passive:true });
}

document.addEventListener("DOMContentLoaded", () => {
  initBottomNav();
  initMobileSwipe();
});
