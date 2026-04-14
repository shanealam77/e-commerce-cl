# 🛍️ MyStore — Complete Setup Guide v2.0
### Ultra Luxury E-Commerce Website
---

## 📁 FILE STRUCTURE (Kya file kahan hai)

```
my-store/
├── server.js              ← Backend server (dimag)
├── package.json           ← Dependencies list
├── INSTRUCTIONS.md        ← Yeh guide
│
├── data/
│   ├── products.json      ← Saare products yahan save hote hain
│   ├── orders.json        ← Customer orders
│   └── settings.json      ← Store name, WhatsApp, etc.
│
├── public/
│   ├── index.html         ← 🏠 Homepage
│   ├── products.html      ← 🛍️ All Products page
│   ├── product-detail.html← 📦 Single product page
│   ├── cart.html          ← 🛒 Cart + Checkout page
│   ├── admin.html         ← 🔐 Admin Dashboard
│   │
│   ├── css/
│   │   └── style.css      ← Complete luxury design
│   └── js/
│       └── main.js        ← Animation engine + all JS
│
└── uploads/               ← Product images yahan upload hongi
```

---

## 🚀 STEP 1 — Node.js Install Karo

1. **https://nodejs.org** par jao
2. Green button **"LTS"** download karo
3. Download file run karo → Next > Next > Install
4. Install hone ke baad **Computer Restart karo**

✅ **Check karo:**
- Windows key + R → `cmd` type → Enter
- Type: `node --version`
- Agar `v18.x.x` ya usse bada dikhaye → Done! ✅

---

## 🚀 STEP 2 — Project Setup Karo

1. Download ki hui ZIP file ko **Extract/Unzip** karo
2. Ek folder milega: `my-store`
3. Us folder ko kahin rakh do (jaise `C:\my-store`)

---

## 🚀 STEP 3 — Dependencies Install Karo

1. `C:\my-store` folder **Windows Explorer** mein kholo
2. Address bar (upar wali) mein click karo
3. `cmd` type karo aur **Enter** dabao
   *(Yeh same folder mein Command Prompt khulega)*
4. Yeh command type karo aur Enter dabao:

```
npm install
```

5. Thoda ruko (1-2 minutes, packages download hoge)
6. Jab `added XXX packages` dikhaye → Done! ✅

---

## 🚀 STEP 4 — Server Start Karo

Usi Command Prompt mein:

```
node server.js
```

Yeh dikhega:
```
🚀 Store is running!
👉 Open: http://localhost:3000
🔐 Admin: http://localhost:3000/admin.html
🔑 Password: admin@123
```

**⚠️ IMPORTANT: Jab tak website use karo, Command Prompt band mat karo!**

---

## 🚀 STEP 5 — Website Dekho

Browser (Chrome/Edge) mein:
- **Store:** `http://localhost:3000`
- **Admin:** `http://localhost:3000/admin.html`
- **Password:** `admin@123`

---

## 🎨 WEBSITE KI KHASIYATEIN (Features)

### ✨ Luxury Animations
- **Page Transitions:** Ek page se doosre par smooth dark slide effect
- **Scroll Reveal:** Cards neeche se upar aate hain
- **Shine Effect:** Product cards par hover karo — shimmer effect
- **Floating Cards:** Hero section mein cards float karte hain
- **Counter Animation:** Numbers count up hote hain
- **Cursor Glow:** Mouse ke saath purple glow chalta hai
- **Ripple Effect:** Buttons par click karo — wave effect
- **Navbar Shrink:** Scroll karo — navbar chhota ho jaata hai
- **Toast Progress Bar:** Notification mein progress bar

### 🛍️ Teen Product Types
| Type | Kya hai | Button |
|------|---------|--------|
| 🏪 Own Product | Aapka apna product | ADD TO CART |
| 🔗 Affiliate (Mode A) | Seedha Amazon/Flipkart | BUY NOW 🔗 |
| 🔗 Affiliate (Mode B) | Aapki site par luxury page | SHOP BEST PRICE |
| 📥 Digital | eBook, PDF, Course | DOWNLOAD NOW |

### 🎛️ Affiliate Mode A vs Mode B
- **Mode A** — Customer click kare → seedha Amazon/Flipkart
- **Mode B** — Aapki site par poora product page dikhega (luxury brand feel), buy button click kare tab redirect

### 🛒 Cart Features
- Quantity change karna
- Remove item
- Coupon codes: `SAVE10`, `WELCOME20`, `DEAL50`
- WhatsApp se order karna
- Checkout form (naam, address, phone)
- Order ID milta hai

---

## 🔐 ADMIN PANEL GUIDE

### Login
- URL: `http://localhost:3000/admin.html`
- Password: `admin@123`

### Product Add Karna
1. Admin → **Products** → **+ Add Product**
2. Fill karo:
   - **Name:** Product ka naam
   - **Description:** Detail mein batao (zaroor bharo!)
   - **Selling Price:** Jo customer ko dikhao
   - **Original Price:** Jo crossed out dikhega (discount ke liye)
   - **Type:** Own / Affiliate / Digital
   - **Category:** Select karo
   - **Affiliate URL:** Amazon/Flipkart link (affiliate ke liye)
   - **Affiliate Mode:** A (direct) ya B (on-site luxury)
   - **Digital URL:** Google Drive download link
   - **Stock:** Kitna hai (Digital ke liye 999)
   - **Badge:** NEW / HOT / BESTSELLER / 50% OFF
   - **Image URL:** Unsplash se copy karo ya file upload karo
   - **Featured:** Yes = Homepage par dikhega

### Product Image Kahan se Lein?
1. **https://unsplash.com** par jao
2. Koi bhi product image search karo
3. Image par right-click → "Copy image address"
4. Woh URL admin form mein paste karo ✅

### Orders Manage Karna
- Admin → **Orders**
- Status change kar sakte ho: Pending → Processing → Shipped → Completed

### Settings Change Karna
- Admin → **Settings**
- Store name, tagline, WhatsApp number, email change karo
- Razorpay key add karo (online payment ke liye)

---

## 💳 ONLINE PAYMENT SETUP (Razorpay)

1. **https://razorpay.com** par account banao
2. Login → Settings → API Keys → Generate Key
3. **Key ID** copy karo (rzp_live_XXXXXXXX ya rzp_test_XXXXXXXX)
4. Admin Panel → Settings → Razorpay Key mein paste karo → Save

**Test ke liye card:**
- Number: `4111 1111 1111 1111`
- Expiry: `12/26`
- CVV: `123`
- OTP: `1234`

---

## 📱 WHATSAPP ORDER SETUP

Cart page par "Order via WhatsApp" button hai.

Settings mein dalo:
```
919876543210
```
(91 = India code, phir aapka 10-digit number, bina 0 ke)

---

## 🌐 WEBSITE LIVE KARNA (Internet Par)

### Option A — Railway.app (FREE, Sabse Aasan)

1. **https://github.com** par free account banao
2. **New Repository** banao → naam: `my-store`
3. Saari files upload karo us repository mein
4. **https://railway.app** par jao → GitHub se sign in karo
5. **New Project** → **Deploy from GitHub Repo**
6. Apna `my-store` repo select karo
7. Automatically deploy hoga
8. URL milega jaise: `my-store.up.railway.app` ✅

### Option B — Render.com (FREE)

1. **https://render.com** par account banao
2. **New Web Service** → GitHub se connect karo
3. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. **Deploy** → URL milega

### Option C — Hostinger VPS (Paid ₹299/month)
Best performance India mein

---

## 🔧 COMMON FIXES

**❌ "node is not recognized"**
→ Node.js install nahi hua. Dobara install karo, computer restart karo.

**❌ "Cannot find module 'express'"**
→ `npm install` dobara run karo us folder mein.

**❌ Website browser mein nahi khul rahi**
→ Check karo CMD band toh nahi? `node server.js` dobara run karo.
→ URL: `http://localhost:3000` (https nahi, http)

**❌ Products nahi dikh rahe**
→ Server must be running. CMD mein `node server.js` run karo.

**❌ Description nahi dikh rahi product card mein**
→ Product ka description Admin mein fill karo (blank mat chodo).

**❌ Admin login nahi ho raha**
→ Password: `admin@123` (exactly, lowercase)

**❌ Image nahi aa rahi**
→ Unsplash URL use karo, ya file upload karo admin form mein.

---

## 🎨 COLORS CHANGE KARNA

`public/css/style.css` mein sabse upar:

```css
:root {
  --primary: #4F46E5;    /* Purple — main color */
  --secondary: #06B6D4;  /* Cyan — accent */
  --accent: #F59E0B;     /* Amber — buttons, badges */
  --success: #10B981;    /* Green — digital product */
  --danger: #EF4444;     /* Red — sale badge */
}
```

Koi bhi color website se copy karo: **https://coolors.co**

---

## 🔑 ADMIN PASSWORD CHANGE KARNA

`server.js` file kholo, line 8:

```javascript
const ADMIN_PASSWORD = "admin@123"; // ← Yahan apna password likhna
```

Baad mein: `Ctrl+C` se server band karo, dobara `node server.js` chalaao.

---

## 🛑 SERVER BAND KARNA

Command Prompt mein: **Ctrl + C**

---

## 💡 PRO TIPS

| Tip | Kaise |
|-----|-------|
| PC restart ke baad | CMD mein `node server.js` dobara run karo |
| Data backup | `data/` folder copy karo kahi safe jagah |
| Bohot saare products | Admin se add karo, sab JSON mein save hote hain |
| Free images | **unsplash.com** — right click → copy image address |
| Coupon codes | SAVE10, WELCOME20, DEAL50 already set hain |
| Featured products | Admin mein "Featured: Yes" karo → Homepage par aayenge |

---

## 📞 KUCH AUR HELP CHAHIYE?

Agar koi problem aaye, seedha AI se poochho! Ye batao:
1. Kya problem aa rahi hai
2. Command Prompt mein kya error dikh raha hai
3. Kaun si file mein change kiya tha

**Made with ❤️ in India — Best of Luck! 🚀**
