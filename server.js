// ============================================
// SERVER.JS — E-Commerce Backend
// ============================================
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

// ---- ADMIN PASSWORD (Change this!) ----
const ADMIN_PASSWORD = "admin@123";

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ============================================
// FILE UPLOAD SETUP (for product images)
// ============================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "_"));
  },
});
const upload = multer({ storage });

// ============================================
// HELPERS — Read/Write JSON data
// ============================================
const DATA_FILE = path.join(__dirname, "data", "products.json");
const ORDERS_FILE = path.join(__dirname, "data", "orders.json");
const SETTINGS_FILE = path.join(__dirname, "data", "settings.json");

function readJSON(file, defaultVal = []) {
  try {
    if (!fs.existsSync(file)) return defaultVal;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return defaultVal;
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ============================================
// ===  API ROUTES  ===
// ============================================

// --- AUTH: Admin Login ---
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: "admin-token-" + Date.now() });
  } else {
    res.status(401).json({ success: false, message: "Wrong password!" });
  }
});

// --- PRODUCTS: Get All ---
app.get("/api/products", (req, res) => {
  let products = readJSON(DATA_FILE);
  const { category, type, search, featured } = req.query;

  if (category && category !== "all")
    products = products.filter((p) => p.category === category);
  if (type && type !== "all")
    products = products.filter((p) => p.type === type);
  if (featured) products = products.filter((p) => p.featured === true);
  if (search)
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    );

  res.json(products);
});

// --- PRODUCTS: Get Single ---
app.get("/api/products/:id", (req, res) => {
  const products = readJSON(DATA_FILE);
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// --- PRODUCTS: Add New (Admin) ---
app.post("/api/products", upload.single("image"), (req, res) => {
  const products = readJSON(DATA_FILE);
  const {
    name, description, price, originalPrice, category, type,
    affiliateUrl, digitalFileUrl, featured, badge, stock,
  } = req.body;

  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price: parseFloat(price) || 0,
    originalPrice: parseFloat(originalPrice) || 0,
    category,
    type, // "own" | "affiliate" | "digital"
    affiliateUrl: affiliateUrl || "",
    digitalFileUrl: digitalFileUrl || "",
    featured: featured === "true",
    badge: badge || "",
    stock: parseInt(stock) || 99,
    image: req.file ? "/uploads/" + req.file.filename : "/img/placeholder.png",
    rating: 4.5,
    reviews: 0,
    createdAt: new Date().toISOString(),
  };

  products.unshift(newProduct);
  writeJSON(DATA_FILE, products);
  res.json({ success: true, product: newProduct });
});

// --- PRODUCTS: Update (Admin) ---
app.put("/api/products/:id", upload.single("image"), (req, res) => {
  let products = readJSON(DATA_FILE);
  const idx = products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Not found" });

  const updated = { ...products[idx], ...req.body };
  if (req.file) updated.image = "/uploads/" + req.file.filename;
  updated.price = parseFloat(updated.price) || 0;
  updated.originalPrice = parseFloat(updated.originalPrice) || 0;
  updated.featured = updated.featured === "true" || updated.featured === true;
  products[idx] = updated;
  writeJSON(DATA_FILE, products);
  res.json({ success: true, product: updated });
});

// --- PRODUCTS: Delete (Admin) ---
app.delete("/api/products/:id", (req, res) => {
  let products = readJSON(DATA_FILE);
  products = products.filter((p) => p.id !== req.params.id);
  writeJSON(DATA_FILE, products);
  res.json({ success: true });
});

// --- ORDERS: Create ---
app.post("/api/orders", (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  const order = {
    id: "ORD-" + Date.now(),
    ...req.body,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  orders.unshift(order);
  writeJSON(ORDERS_FILE, orders);
  res.json({ success: true, orderId: order.id });
});

// --- ORDERS: Get All (Admin) ---
app.get("/api/orders", (req, res) => {
  res.json(readJSON(ORDERS_FILE));
});

// --- ORDERS: Update Status ---
app.put("/api/orders/:id", (req, res) => {
  let orders = readJSON(ORDERS_FILE);
  const idx = orders.findIndex((o) => o.id === req.params.id);
  if (idx !== -1) orders[idx] = { ...orders[idx], ...req.body };
  writeJSON(ORDERS_FILE, orders);
  res.json({ success: true });
});

// --- SETTINGS: Get ---
app.get("/api/settings", (req, res) => {
  res.json(
    readJSON(SETTINGS_FILE, {
      storeName: "MyStore",
      tagline: "Best Products, Best Prices",
      currency: "₹",
      razorpayKey: "",
      whatsapp: "",
      email: "",
    })
  );
});

// --- SETTINGS: Save (Admin) ---
app.post("/api/settings", (req, res) => {
  writeJSON(SETTINGS_FILE, req.body);
  res.json({ success: true });
});

// --- STATS (Admin Dashboard) ---
app.get("/api/stats", (req, res) => {
  const products = readJSON(DATA_FILE);
  const orders = readJSON(ORDERS_FILE);
  const revenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + (o.total || 0), 0);
  res.json({
    totalProducts: products.length,
    totalOrders: orders.length,
    revenue,
    ownProducts: products.filter((p) => p.type === "own").length,
    affiliateProducts: products.filter((p) => p.type === "affiliate").length,
    digitalProducts: products.filter((p) => p.type === "digital").length,
  });
});

// ============================================
// CATCH-ALL: Serve Frontend
// ============================================
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log("\n🚀 Store is running!");
  console.log(`👉 Open in browser: http://localhost:${PORT}`);
  console.log(`🔐 Admin panel: http://localhost:${PORT}/admin.html`);
  console.log(`🔑 Admin password: ${ADMIN_PASSWORD}\n`);
});
