import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PRODUCTS = [
  { id: 1, name: "Whey Protein", price: 2500, category: "Protein", tag: "Best Seller", desc: "Premium isolate blend, 25g protein per serve", emoji: "🥛" },
  { id: 2, name: "Mass Gainer", price: 2200, category: "Protein", tag: "Bulk", desc: "High-calorie formula for serious size gains", emoji: "💪" },
  { id: 3, name: "Creatine Monohydrate", price: 1200, category: "Supplement", tag: "Pure", desc: "Micronized for max absorption & strength", emoji: "⚡" },
  { id: 4, name: "Protein Bar", price: 150, category: "Snack", tag: "Tasty", desc: "20g protein, low sugar, real chocolate coating", emoji: "🍫" },
  { id: 5, name: "Pre Workout", price: 1800, category: "Supplement", tag: "Energy", desc: "Explosive energy & laser-sharp focus blend", emoji: "🔥" },
  { id: 6, name: "BCAA 2:1:1", price: 1600, category: "Supplement", tag: "Recovery", desc: "Essential amino acids for muscle recovery", emoji: "🧪" },
  { id: 7, name: "Fish Oil Omega-3", price: 900, category: "Health", tag: "Heart", desc: "Ultra-pure EPA & DHA for joint & heart health", emoji: "🐟" },
  { id: 8, name: "Multivitamin", price: 800, category: "Health", tag: "Daily", desc: "Complete A–Z vitamin & mineral complex", emoji: "💊" },
  { id: 9, name: "Peanut Butter", price: 350, category: "Food", tag: "Natural", desc: "No added sugar, high protein, 100% peanuts", emoji: "🥜" },
];

const CATEGORIES = ["All", "Protein", "Supplement", "Snack", "Health", "Food"];

// Soft pastel tag colors — light theme friendly
const tagStyles = {
  "Best Seller": { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
  "Bulk":        { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" },
  "Pure":        { bg: "#dcfce7", color: "#166534", dot: "#22c55e" },
  "Tasty":       { bg: "#fce7f3", color: "#9d174d", dot: "#ec4899" },
  "Energy":      { bg: "#ffedd5", color: "#9a3412", dot: "#f97316" },
  "Recovery":    { bg: "#ede9fe", color: "#4c1d95", dot: "#8b5cf6" },
  "Heart":       { bg: "#cffafe", color: "#164e63", dot: "#06b6d4" },
  "Daily":       { bg: "#f0fdf4", color: "#14532d", dot: "#16a34a" },
  "Natural":     { bg: "#fefce8", color: "#713f12", dot: "#eab308" },
};

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

export default function Products() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState({ name: "", phone: "", address: "" });

  const width = useWindowWidth();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const filtered = PRODUCTS.filter((p) => {
    const s = p.name.toLowerCase().includes(search.toLowerCase());
    const c = activeCategory === "All" || p.category === activeCategory;
    return s && c;
  });

  const addToCart = (product) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.id === product.id);
      if (ex) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`${product.name} added`);
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) =>
      prev.find((i) => i.id === product.id)
        ? prev.filter((i) => i.id !== product.id)
        : [...prev, product]
    );
  };

  const updateQty = (id, change) => {
    setCart((prev) =>
      prev.map((i) => i.id === id ? { ...i, qty: i.qty + change } : i).filter((i) => i.qty > 0)
    );
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const whatsappLink = () => {
    let msg = `Hello! I'd like to place an order:\n\n👤 Name: ${user.name}\n📞 Phone: ${user.phone}\n📍 Address: ${user.address}\n\n🛒 Order:\n`;
    cart.forEach((i, idx) => { msg += `${idx + 1}. ${i.name} × ${i.qty} — ₹${(i.price * i.qty).toLocaleString()}\n`; });
    msg += `\n💰 Total: ₹${total.toLocaleString()}\n\nThank you!`;
    return `https://api.whatsapp.com/send?phone=919634916677&text=${encodeURIComponent(msg)}`;
  };

  const cols = isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(3,1fr)";
  const drawerW = isMobile ? "100vw" : "400px";

  // ── design tokens ──
  const C = {
    bg:      "#fafaf8",       // warm off-white
    surface: "#ffffff",       // pure white cards
    surfaceHover: "#f5f5f2",
    border:  "#e8e8e3",
    borderHover: "#d0d0c8",
    accent:  "#16a34a",       // rich green
    accentLight: "#dcfce7",
    accentText:  "#14532d",
    text:    "#1a1a18",
    textSub: "#6b7266",
    textMuted: "#9ca39a",
    navBg:   "rgba(250,250,248,0.92)",
  };

  const inputStyle = {
    width: "100%", background: "#fafaf8",
    border: `1.5px solid ${C.border}`,
    borderRadius: 10, color: C.text,
    fontSize: 14, padding: "10px 12px 10px 36px",
    outline: "none", fontFamily: "inherit",
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #f0f0ec; }
        ::-webkit-scrollbar-thumb { background: #c8c8c0; border-radius: 3px; }
        input::placeholder, textarea::placeholder { color: #aaa9a2; }
        button { font-family: inherit; cursor: pointer; }
        a { font-family: inherit; }
        .cat-scroll { scrollbar-width: none; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .card-hover { transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s; }
        .card-hover:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.08); transform: translateY(-3px); border-color: #c8c8c0 !important; }
        .btn-green { transition: background 0.2s, transform 0.1s; }
        .btn-green:hover { background: #15803d !important; }
        .btn-green:active { transform: scale(0.97); }
        .input-focus:focus { border-color: #16a34a !important; box-shadow: 0 0 0 3px rgba(22,163,74,0.08); }
      `}</style>

      {/* ── TOAST ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            style={{
              position: "fixed", top: isMobile ? 14 : 22, left: "50%", transform: "translateX(-50%)",
              background: C.surface, color: C.text, padding: "10px 20px",
              borderRadius: 40, fontSize: 13, fontWeight: 500, zIndex: 9999,
              whiteSpace: "nowrap", border: `1.5px solid ${C.border}`,
              boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
              display: "flex", alignItems: "center", gap: 8
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent, display: "inline-block", flexShrink: 0 }} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── NAVBAR ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: C.navBg, backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "0 16px" : "0 32px", display: "flex", alignItems: "center", height: isMobile ? 58 : 80, gap: 16 }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ width: isMobile ? 32 : 36, height: isMobile ? 32 : 36, background: C.accentLight, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 17 : 19, border: `1.5px solid #bbf7d0` }}>
              💪
            </div>
            <div>
              <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: isMobile ? 17 : 20, fontWeight: 400, color: C.text, letterSpacing: "-0.3px", lineHeight: 1.1 }}>GymStore</div>
              {!isMobile && <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 2, textTransform: "uppercase", marginTop: 1 }}>Fuel Your Gains</div>}
            </div>
          </div>

          {/* Search — tablet/desktop */}
          {!isMobile && (
            <div style={{ flex: 1, maxWidth: 340, position: "relative" }}>
              <svg style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca39a" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="input-focus"
                style={{ ...inputStyle, padding: "9px 14px 9px 32px", fontSize: 13, borderRadius: 12 }}
              />
            </div>
          )}

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            {/* Wishlist */}
            <button style={{ background: "none", border: `1.5px solid ${C.border}`, color: C.textSub, padding: isMobile ? "6px 10px" : "7px 14px", borderRadius: 10, fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={wishlist.length > 0 ? "#f43f5e" : "none"} stroke={wishlist.length > 0 ? "#f43f5e" : "#9ca39a"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {!isMobile && <span style={{ fontSize: 13 }}>{wishlist.length}</span>}
              {isMobile && wishlist.length > 0 && <span style={{ fontSize: 12, fontWeight: 600 }}>{wishlist.length}</span>}
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{ background: C.accent, border: "none", color: "#fff", padding: isMobile ? "8px 14px" : "8px 20px", borderRadius: 10, fontSize: isMobile ? 13 : 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 7, boxShadow: "0 2px 12px rgba(22,163,74,0.25)" }}
              className="btn-green"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {!isMobile && "Cart"}
              {cartCount > 0 && <span style={{ background: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 700, padding: "1px 7px", borderRadius: 20 }}>{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {isMobile && (
          <div style={{ padding: "0 16px 12px", borderTop: `1px solid ${C.border}` }}>
            <div style={{ position: "relative", marginTop: 10 }}>
              <svg style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca39a" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="input-focus"
                style={{ ...inputStyle, padding: "9px 12px 9px 32px", borderRadius: 12 }}
              />
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section style={{ padding: isMobile ? "48px 16px 40px" : "80px 32px 64px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: isMobile ? 28 : 40 }}>

          {/* Left text */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.accentLight, border: `1px solid #bbf7d0`, borderRadius: 20, padding: "5px 12px", marginBottom: 20 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent, display: "inline-block" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: C.accentText, letterSpacing: 0.5 }}>Premium Fitness Nutrition</span>
            </div>

            <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: isMobile ? 38 : isTablet ? 52 : 64, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-1.5px", color: C.text, marginBottom: 20 }}>
              Fuel your<br />
              <em style={{ color: C.accent, fontStyle: "italic" }}>strongest</em> self.
            </h1>

            <p style={{ fontSize: isMobile ? 15 : 17, color: C.textSub, lineHeight: 1.7, maxWidth: 420, fontWeight: 300 }}>
              Top-grade supplements delivered to your door. Trusted by 10,000+ athletes across India.
            </p>

            {/* Trust pills */}
            <div style={{ display: "flex", gap: 8, marginTop: 28, flexWrap: "wrap" }}>
              {[["🚚","Free delivery ₹2000+"],["✅","100% authentic"],["⚡","Same day dispatch"]].map(([icon, text]) => (
                <div key={text} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 20, padding: "6px 14px", fontSize: isMobile ? 12 : 13, color: C.textSub, fontWeight: 400 }}>
                  <span style={{ fontSize: 13 }}>{icon}</span>{text}
                </div>
              ))}
            </div>
          </div>

          {/* Right stats */}
          <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", gap: 12, width: isMobile ? "100%" : "auto" }}>
            {[["10K+","Happy customers"],["99%","Authenticity rate"],["24hr","Order dispatch"]].map(([num, label]) => (
              <div key={label} style={{
                flex: isMobile ? 1 : "none",
                background: C.surface, border: `1.5px solid ${C.border}`,
                borderRadius: 16, padding: isMobile ? "16px 10px" : "20px 32px",
                textAlign: isMobile ? "center" : "left",
                minWidth: isMobile ? 0 : 180
              }}>
                <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: isMobile ? 22 : 30, color: C.text, letterSpacing: "-1px" }}>{num}</div>
                <div style={{ fontSize: isMobile ? 10 : 12, color: C.textMuted, marginTop: 3, fontWeight: 400 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `1px solid ${C.border}`, margin: "0 auto", maxWidth: isMobile ? "none" : 1200, marginLeft: isMobile ? 0 : "auto", marginRight: isMobile ? 0 : "auto" }} />

      {/* ── PRODUCTS ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "32px 16px 80px" : "48px 32px 100px" }}>

        {/* Filters row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isMobile ? 24 : 36, gap: 12, flexWrap: "nowrap" }}>
          <div className="cat-scroll" style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2, flex: 1 }}>
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: isMobile ? "6px 14px" : "7px 18px",
                    borderRadius: 30, fontSize: isMobile ? 12 : 13,
                    fontWeight: active ? 600 : 400,
                    border: `1.5px solid ${active ? C.accent : C.border}`,
                    background: active ? C.accent : C.surface,
                    color: active ? "#fff" : C.textSub,
                    whiteSpace: "nowrap", flexShrink: 0,
                    transition: "all 0.18s",
                  }}
                >{cat}</button>
              );
            })}
          </div>
          <div style={{ fontSize: 12, color: C.textMuted, whiteSpace: "nowrap", flexShrink: 0 }}>
            {filtered.length} items
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: cols, gap: isMobile ? 14 : 24 }}>
          <AnimatePresence>
            {filtered.map((p, idx) => {
              const inWL = wishlist.find((i) => i.id === p.id);
              const inCart = cart.find((i) => i.id === p.id);
              const tag = tagStyles[p.tag];
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.35 }}
                  className="card-hover"
                  style={{
                    background: C.surface, border: `1.5px solid ${C.border}`,
                    borderRadius: 18, overflow: "hidden"
                  }}
                >
                  {/* Image zone */}
                  <div style={{ background: "#f7f7f4", height: isMobile ? 130 : 165, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 52 : 66, position: "relative" }}>
                    <motion.span whileHover={{ scale: 1.12 }} transition={{ type: "spring", stiffness: 300 }}>{p.emoji}</motion.span>

                    {/* Tag */}
                    <div style={{ position: "absolute", top: 12, left: 12, display: "flex", alignItems: "center", gap: 5, background: tag.bg, border: `1px solid ${tag.bg}`, borderRadius: 20, padding: "4px 10px" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: tag.dot, display: "inline-block", flexShrink: 0 }} />
                      <span style={{ fontSize: 10, fontWeight: 600, color: tag.color, letterSpacing: 0.3 }}>{p.tag}</span>
                    </div>

                    {/* Wishlist */}
                    <button
                      onClick={() => toggleWishlist(p)}
                      style={{
                        position: "absolute", top: 10, right: 10,
                        background: inWL ? "#fff0f3" : C.surface,
                        border: `1.5px solid ${inWL ? "#fecdd3" : C.border}`,
                        borderRadius: 10, width: 34, height: 34,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s"
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={inWL ? "#f43f5e" : "none"} stroke={inWL ? "#f43f5e" : "#9ca39a"} strokeWidth="2.2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    </button>
                  </div>

                  {/* Info */}
                  <div style={{ padding: isMobile ? "14px 15px 16px" : "18px 20px 20px" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 5 }}>{p.category}</div>
                    <h3 style={{ fontSize: isMobile ? 15 : 16, fontWeight: 600, color: C.text, marginBottom: 6, letterSpacing: "-0.2px" }}>{p.name}</h3>
                    <p style={{ fontSize: isMobile ? 12 : 13, color: C.textSub, lineHeight: 1.6, marginBottom: 16, fontWeight: 300 }}>{p.desc}</p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: isMobile ? "wrap" : "nowrap" }}>
                      <div>
                        <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: isMobile ? 20 : 24, color: C.text, letterSpacing: "-0.5px" }}>₹{p.price.toLocaleString()}</span>
                        <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 4 }}>/unit</span>
                      </div>
                      <button
                        onClick={() => addToCart(p)}
                        className="btn-green"
                        style={{
                          background: inCart ? "#15803d" : C.accent,
                          border: "none", color: "#fff",
                          padding: isMobile ? "9px 0" : "9px 18px",
                          borderRadius: 10, fontSize: isMobile ? 12 : 13, fontWeight: 600,
                          display: "flex", alignItems: "center", gap: 6, justifyContent: "center",
                          width: isMobile ? "100%" : "auto", whiteSpace: "nowrap",
                          boxShadow: "0 2px 8px rgba(22,163,74,0.2)"
                        }}
                      >
                        {inCart
                          ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> In Cart ({inCart.qty})</>
                          : <>+ Add to cart</>
                        }
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: C.textMuted }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 16, color: C.textSub }}>No products found for "{search}"</p>
          </div>
        )}
      </section>

      {/* ── CART DRAWER ── */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(26,26,24,0.35)", zIndex: 200, backdropFilter: "blur(3px)" }}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              style={{ position: "fixed", top: 0, right: 0, width: drawerW, height: "100vh", background: "#ffffff", borderLeft: `1.5px solid ${C.border}`, zIndex: 300, display: "flex", flexDirection: "column" }}
            >
              {/* Header */}
              <div style={{ padding: isMobile ? "18px 20px" : "22px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: isMobile ? 22 : 26, fontWeight: 400, color: C.text, letterSpacing: "-0.5px" }}>Your cart</h2>
                  <p style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{cartCount} item{cartCount !== 1 ? "s" : ""}</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} style={{ background: "#f5f5f2", border: `1.5px solid ${C.border}`, color: C.textSub, width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              {/* Items */}
              <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px 20px" : "20px 28px" }}>
                {cart.length === 0 ? (
                  <div style={{ textAlign: "center", paddingTop: 80 }}>
                    <div style={{ fontSize: 52, marginBottom: 16 }}>🛒</div>
                    <p style={{ color: C.textSub, fontSize: 15, marginBottom: 16 }}>Your cart is empty</p>
                    <button onClick={() => setIsCartOpen(false)} className="btn-green" style={{ background: C.accent, border: "none", color: "#fff", padding: "11px 24px", borderRadius: 10, fontWeight: 600, fontSize: 14 }}>Start shopping</button>
                  </div>
                ) : cart.map((item) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ width: 48, height: 48, background: "#f7f7f4", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, border: `1.5px solid ${C.border}` }}>
                      {item.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                      <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 15, color: C.accent }}>₹{(item.price * item.qty).toLocaleString()}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f7f7f4", borderRadius: 10, padding: "5px 10px", border: `1.5px solid ${C.border}`, flexShrink: 0 }}>
                      <button onClick={() => updateQty(item.id, -1)} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 18, lineHeight: 1, padding: "0 1px" }}>−</button>
                      <span style={{ fontSize: 14, fontWeight: 600, minWidth: 20, textAlign: "center", color: C.text }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} style={{ background: "none", border: "none", color: C.accent, fontSize: 18, lineHeight: 1, padding: "0 1px" }}>+</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout panel */}
              {cart.length > 0 && (
                <div style={{ padding: isMobile ? "16px 20px" : "20px 28px", borderTop: `1px solid ${C.border}` }}>
                  {/* Order summary */}
                  <div style={{ background: "#f9f9f6", borderRadius: 14, padding: "14px 16px", marginBottom: 14, border: `1.5px solid ${C.border}` }}>
                    {[["Subtotal", `₹${total.toLocaleString()}`], ["Delivery", total >= 2000 ? "Free" : "₹99"]].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.textSub, marginBottom: 8 }}>
                        <span>{k}</span>
                        <span style={v === "Free" ? { color: C.accent, fontWeight: 600 } : { color: C.text }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16 }}>
                      <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: 400, fontSize: 18 }}>Total</span>
                      <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 18, color: C.text }}>₹{(total < 2000 ? total + 99 : total).toLocaleString()}</span>
                    </div>
                    {total < 2000 && <p style={{ fontSize: 11, color: C.textMuted, marginTop: 8 }}>Add ₹{(2000 - total).toLocaleString()} more for free delivery</p>}
                  </div>

                  {/* Form */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                    {[{ key: "name", ph: "Full name", icon: "👤" }, { key: "phone", ph: "Phone number", icon: "📞" }].map(({ key, ph, icon }) => (
                      <div key={key} style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 13 }}>{icon}</span>
                        <input placeholder={ph} onChange={(e) => setUser({ ...user, [key]: e.target.value })}
                          className="input-focus" style={inputStyle} />
                      </div>
                    ))}
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 11, top: 11, fontSize: 13 }}>📍</span>
                      <textarea placeholder="Delivery address" rows={2} onChange={(e) => setUser({ ...user, address: e.target.value })}
                        className="input-focus" style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }} />
                    </div>
                  </div>

                  {/* WhatsApp CTA */}
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#25d366", color: "#fff", padding: "14px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: isMobile ? 14 : 15, boxShadow: "0 4px 16px rgba(37,211,102,0.3)", transition: "opacity 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Order via WhatsApp
                  </a>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── FOOTER ── */}
      {/* <footer style={{ borderTop: `1px solid ${C.border}`, padding: isMobile ? "32px 16px" : "48px 32px", background: C.surface }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: 20 }}>
          <div>
            <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 22, color: C.text, marginBottom: 4 }}>GymStore</div>
            <p style={{ fontSize: 13, color: C.textMuted, fontWeight: 300 }}>Premium fitness nutrition. Trusted by athletes across India.</p>
          </div>
          <p style={{ fontSize: 12, color: "#c8c8c0" }}>© 2025 GymStore. All rights reserved.</p>
        </div>
      </footer> */}

      {/* ── MOBILE FLOAT CART ── */}
      <AnimatePresence>
        {isMobile && cartCount > 0 && !isCartOpen && (
          <motion.button
            initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            onClick={() => setIsCartOpen(true)}
            className="btn-green"
            style={{
              position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
              background: C.accent, border: "none", color: "#fff",
              padding: "14px 28px", borderRadius: 40, fontSize: 15, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 10,
              boxShadow: "0 8px 28px rgba(22,163,74,0.35)", zIndex: 150, whiteSpace: "nowrap"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            View Cart
            <span style={{ background: "rgba(255,255,255,0.25)", padding: "2px 8px", borderRadius: 20, fontSize: 13 }}>{cartCount}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

