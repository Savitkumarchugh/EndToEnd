import { useState, useEffect, useRef } from "react";

/* ── STATIC DATA ─────────────────────────────────────────────── */
const MERCHANTS = [
  { id: "flannels",       name: "Flannels",        cat: "Luxury Fashion",  color: "#7C2D12", accent: "#FCA5A5", url: "flannels.com",        rating: 4.2, reviews: 1840 },
  { id: "nordstrom",      name: "Nordstrom",        cat: "Department Store",color: "#1E3A5F", accent: "#93C5FD", url: "nordstrom.com",       rating: 4.5, reviews: 5230 },
  { id: "bloomingdales",  name: "Bloomingdale's",   cat: "Luxury Retail",   color: "#4C1D95", accent: "#C4B5FD", url: "bloomingdales.com",   rating: 4.3, reviews: 3100 },
  { id: "netaporter",     name: "NET-A-PORTER",     cat: "Designer",        color: "#0F172A", accent: "#94A3B8", url: "net-a-porter.com",    rating: 4.6, reviews: 2870 },
  { id: "farfetch",       name: "Farfetch",         cat: "Designer Multi",  color: "#831843", accent: "#F9A8D4", url: "farfetch.com",        rating: 4.1, reviews: 4120 },
  { id: "selfridges",     name: "Selfridges",       cat: "Iconic Dept.",    color: "#065F46", accent: "#6EE7B7", url: "selfridges.com",      rating: 4.4, reviews: 2640 },
  { id: "harveynichols",  name: "Harvey Nichols",   cat: "Luxury Fashion",  color: "#7F1D1D", accent: "#FCA5A5", url: "harveynichols.com",   rating: 4.3, reviews: 1980 },
  { id: "riverisland",    name: "River Island",     cat: "High Street",     color: "#78350F", accent: "#FCD34D", url: "riverisland.com",     rating: 3.9, reviews: 6700 },
  { id: "asos",           name: "ASOS",             cat: "Fast Fashion",    color: "#0F766E", accent: "#5EEAD4", url: "asos.com",            rating: 3.8, reviews: 12400 },
  { id: "dsw",            name: "DSW",              cat: "Footwear",        color: "#3730A3", accent: "#A5B4FC", url: "dsw.com",             rating: 4.0, reviews: 3890 },
];

const CATEGORIES = [
  { icon: "✦", name: "Womenswear",  desc: "Curated collections" },
  { icon: "◈", name: "Menswear",    desc: "Tailored excellence" },
  { icon: "⬡", name: "Footwear",    desc: "Step in style" },
  { icon: "◉", name: "Bags",        desc: "Iconic silhouettes" },
  { icon: "✧", name: "Fragrance",   desc: "Olfactory journeys" },
  { icon: "⬨", name: "Watches",     desc: "Timeless precision" },
  { icon: "◆", name: "Beauty",      desc: "Luminous rituals" },
  { icon: "◇", name: "Homeware",    desc: "Elevated living" },
];

const TRENDING = [
  { id: "flannels",      badge: "HOT",  badgeColor: "#DC2626" },
  { id: "netaporter",    badge: "EDITORS' PICK", badgeColor: "#B45309" },
  { id: "farfetch",      badge: "NEW",  badgeColor: "#0369A1" },
  { id: "selfridges",    badge: "HOT",  badgeColor: "#DC2626" },
  { id: "harveynichols", badge: "NEW",  badgeColor: "#0369A1" },
  { id: "bloomingdales", badge: null,   badgeColor: null },
];

const MERCHANT_DETAILS = {
  flannels: {
    founded: "1976",
    stores: "40+ UK",
    delivery: "Free over £100",
    returns: "28 days",
    studentDisc: "10% off",
    history: "Founded in 1976 as a single menswear boutique in Middlesbrough, Flannels has grown into one of the UK's foremost luxury fashion destinations, now operating over 40 stores and a flagship e-commerce platform as part of the Frasers Group.",
    range: ["Menswear", "Womenswear", "Footwear", "Accessories", "Fragrance", "Sportswear", "Kidswear"],
    brands: ["Versace", "Moschino", "Dsquared²", "Emporio Armani", "Hugo Boss", "Paul Smith", "Off-White"],
    services: "Personal styling appointments, click-and-collect, next-day delivery, and an exclusive loyalty rewards programme with members-only access to new arrivals and private sales events.",
    faqs: [
      { q: "Does Flannels offer free shipping?", a: "Yes — orders over £100 qualify for free standard UK delivery. Express and next-day options are available at checkout for an additional fee." },
      { q: "Can I return sale items?", a: "Full-price items can be returned within 28 days for a full refund. Sale items are eligible for exchange or store credit within 14 days, provided they are unworn and in original packaging." },
      { q: "Is there a student discount?", a: "Yes. Flannels offers 10% off via Student Beans. Verify your status on their platform to receive a unique code redeemable on most full-price items." },
      { q: "Does Flannels have a loyalty programme?", a: "Yes — the Flannels loyalty scheme rewards regular shoppers with points on every purchase, early access to new collections, and invitations to exclusive members-only events." },
      { q: "Are all products authentic?", a: "Absolutely. Flannels sources directly from designer brands and authorised distributors, guaranteeing 100% authenticity on every item sold." },
    ],
    similar: ["harveynichols", "selfridges", "netaporter", "farfetch", "bloomingdales"],
  },
};

/* ── HELPERS ─────────────────────────────────────────────────── */
const initials = (name) =>
  name.split(" ").map((w) => w[0]).join("").replace(/[^A-Z]/gi, "").slice(0, 2).toUpperCase();

const getMerchant = (id) => MERCHANTS.find((m) => m.id === id);

const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ color: "#D4AF37", letterSpacing: 2, fontSize: 15 }}>
      {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
};

/* ── GLOBAL STYLES (injected once) ───────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Jost:wght@200;300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0D0D0D; color: #E8E0D0; font-family: 'Jost', sans-serif; }
  :root {
    --gold: #D4AF37;
    --gold-light: #F0D060;
    --gold-dim: rgba(212,175,55,0.15);
    --cream: #F5F0E8;
    --ink: #0D0D0D;
    --bg: #111111;
    --bg2: #161616;
    --bg3: #1C1C1C;
    --border: rgba(212,175,55,0.18);
    --muted: #888070;
    --r: 10px;
  }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .fade-up { animation: fadeUp 0.7s ease both; }
  .fade-up-1 { animation-delay: 0.1s; }
  .fade-up-2 { animation-delay: 0.22s; }
  .fade-up-3 { animation-delay: 0.36s; }
  .fade-up-4 { animation-delay: 0.5s; }
`;

/* ── NAV ─────────────────────────────────────────────────────── */
const Nav = ({ onHome, onSearch, searchVal, setSearchVal }) => (
  <nav style={{
    position: "sticky", top: 0, zIndex: 200,
    background: "rgba(13,13,13,0.92)", backdropFilter: "blur(20px)",
    borderBottom: "1px solid var(--border)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 48px", height: 68,
  }}>
    <div onClick={onHome} style={{ cursor: "pointer", display: "flex", alignItems: "baseline", gap: 2 }}>
      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: "var(--cream)", letterSpacing: -0.5 }}>Deal</span>
      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 300, fontStyle: "italic", color: "var(--gold)", letterSpacing: -0.5 }}>Scout</span>
    </div>

    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 50,
      padding: "9px 20px", flex: 1, maxWidth: 320, margin: "0 40px",
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input
        value={searchVal} onChange={e => setSearchVal(e.target.value)}
        placeholder="Search brands, categories…"
        style={{ background: "none", border: "none", outline: "none", fontSize: 13, color: "var(--cream)", width: "100%", fontFamily: "'Jost',sans-serif", fontWeight: 300 }}
      />
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
      {["Home", "Merchants", "Deals", "About"].map(l => (
        <a key={l} href="#" onClick={e => { e.preventDefault(); if (l === "Home") onHome(); }}
          style={{ fontSize: 13, fontWeight: 400, color: "var(--muted)", textDecoration: "none", letterSpacing: 1, textTransform: "uppercase", transition: "color 0.2s" }}
          onMouseEnter={e => e.target.style.color = "var(--gold)"}
          onMouseLeave={e => e.target.style.color = "var(--muted)"}
        >{l}</a>
      ))}
      <button style={{
        background: "var(--gold)", color: "var(--ink)", border: "none",
        padding: "10px 24px", borderRadius: 50, fontSize: 12, fontWeight: 600,
        letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer",
        fontFamily: "'Jost',sans-serif", transition: "all 0.3s",
      }}
        onMouseEnter={e => { e.target.style.background = "var(--gold-light)"; e.target.style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { e.target.style.background = "var(--gold)"; e.target.style.transform = "translateY(0)"; }}
      >Shop Now</button>
    </div>
  </nav>
);

/* ── HERO ─────────────────────────────────────────────────────── */
const Hero = ({ onShop }) => (
  <section style={{
    minHeight: "88vh", display: "flex", flexDirection: "column", justifyContent: "center",
    padding: "80px 48px", position: "relative", overflow: "hidden",
    background: "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(212,175,55,0.07) 0%, transparent 70%), var(--bg)",
  }}>
    {/* Decorative lines */}
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: "20%", right: "8%", width: 1, height: "55%", background: "linear-gradient(to bottom, transparent, var(--border), transparent)" }} />
      <div style={{ position: "absolute", top: "12%", left: "38%", width: "22%", height: 1, background: "linear-gradient(to right, transparent, var(--border), transparent)" }} />
      <div style={{ position: "absolute", bottom: "18%", right: "22%", width: "14%", height: 1, background: "linear-gradient(to right, transparent, var(--gold-dim), transparent)" }} />
    </div>

    <div style={{ maxWidth: 780, position: "relative", zIndex: 1 }}>
      <div className="fade-up fade-up-1" style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        border: "1px solid var(--border)", borderRadius: 50,
        padding: "7px 18px", marginBottom: 36,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", display: "block" }} />
        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--gold)" }}>500+ Premium Brands</span>
      </div>

      <h1 className="fade-up fade-up-2" style={{
        fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(54px, 7vw, 96px)",
        fontWeight: 300, lineHeight: 1.03, color: "var(--cream)", letterSpacing: -1, marginBottom: 28,
      }}>
        Discover the<br />
        <em style={{ fontStyle: "italic", color: "var(--gold)", fontWeight: 300 }}>finest bargains</em><br />
        <span style={{ fontWeight: 600 }}>online.</span>
      </h1>

      <p className="fade-up fade-up-3" style={{
        fontSize: 18, fontWeight: 300, color: "var(--muted)", lineHeight: 1.7,
        maxWidth: 520, marginBottom: 48,
      }}>
        Your trusted guide to premium brands, curated deals, and the world's finest shopping destinations — all in one place.
      </p>

      <div className="fade-up fade-up-4" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <button onClick={onShop} style={{
          background: "var(--gold)", color: "var(--ink)", border: "none",
          padding: "16px 40px", borderRadius: 50, fontSize: 13, fontWeight: 600,
          letterSpacing: 2, textTransform: "uppercase", cursor: "pointer",
          fontFamily: "'Jost',sans-serif", transition: "all 0.3s",
          boxShadow: "0 0 40px rgba(212,175,55,0.25)",
        }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 48px rgba(212,175,55,0.4)"; }}
          onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 0 40px rgba(212,175,55,0.25)"; }}
        >Explore Merchants</button>
        <button style={{
          background: "transparent", color: "var(--cream)", border: "1px solid var(--border)",
          padding: "16px 40px", borderRadius: 50, fontSize: 13, fontWeight: 400,
          letterSpacing: 2, textTransform: "uppercase", cursor: "pointer",
          fontFamily: "'Jost',sans-serif", transition: "all 0.3s",
        }}
          onMouseEnter={e => { e.target.style.borderColor = "var(--gold)"; e.target.style.color = "var(--gold)"; }}
          onMouseLeave={e => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--cream)"; }}
        >Browse Categories</button>
      </div>
    </div>

    {/* Floating stat pills */}
    <div style={{ position: "absolute", right: 80, top: "35%", display: "flex", flexDirection: "column", gap: 14 }}>
      {[["500+", "Premium Brands"], ["£0", "Commission Hidden"], ["24/7", "Deal Updates"]].map(([val, label]) => (
        <div key={val} style={{
          background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 12,
          padding: "14px 22px", textAlign: "center",
        }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 600, color: "var(--gold)" }}>{val}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>{label}</div>
        </div>
      ))}
    </div>
  </section>
);

/* ── MERCHANT CARD (carousel) ─────────────────────────────────── */
const MerchantCard = ({ merchant, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={() => onClick(merchant.id)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        flexShrink: 0, width: 160, cursor: "pointer",
        background: hov ? "var(--bg3)" : "var(--bg2)",
        border: `1px solid ${hov ? "rgba(212,175,55,0.45)" : "var(--border)"}`,
        borderRadius: 14, padding: "22px 16px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        transform: hov ? "translateY(-6px) scale(1.03)" : "translateY(0) scale(1)",
        boxShadow: hov ? "0 20px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.2)" : "none",
        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: merchant.color, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: -0.5,
        fontFamily: "'Jost',sans-serif",
        border: hov ? `1px solid ${merchant.accent}55` : "1px solid transparent",
        transition: "border 0.3s",
      }}>{initials(merchant.name)}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--cream)", textAlign: "center", lineHeight: 1.3 }}>{merchant.name}</div>
      <div style={{
        fontSize: 11, color: hov ? "var(--gold)" : "var(--muted)",
        background: "var(--bg)", padding: "3px 10px", borderRadius: 50,
        letterSpacing: 0.5, transition: "color 0.3s",
      }}>{merchant.cat}</div>
    </div>
  );
};

/* ── CAROUSEL SECTION ─────────────────────────────────────────── */
const CarouselSection = ({ onMerchant }) => (
  <section style={{ padding: "80px 0", borderTop: "1px solid var(--border)" }}>
    <div style={{ padding: "0 48px", display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 36 }}>
      <div>
        <div style={{ fontSize: 11, color: "var(--gold)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Featured</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 40, fontWeight: 300, color: "var(--cream)" }}>Top Merchants</h2>
      </div>
      <a href="#" style={{ fontSize: 12, color: "var(--gold)", textDecoration: "none", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 500 }}>View All →</a>
    </div>
    <div style={{ paddingLeft: 48, overflowX: "auto", scrollbarWidth: "none" }}>
      <div style={{ display: "flex", gap: 16, paddingRight: 48, paddingBottom: 8 }}>
        {MERCHANTS.map(m => <MerchantCard key={m.id} merchant={m} onClick={onMerchant} />)}
      </div>
    </div>
  </section>
);

/* ── TRENDING GRID ────────────────────────────────────────────── */
const TrendingGrid = ({ onMerchant }) => (
  <section style={{ padding: "80px 48px", borderTop: "1px solid var(--border)", background: "var(--bg2)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 40 }}>
      <div>
        <div style={{ fontSize: 11, color: "var(--gold)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Right Now</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 40, fontWeight: 300, color: "var(--cream)" }}>Trending Brands</h2>
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
      {TRENDING.map(({ id, badge, badgeColor }) => {
        const m = getMerchant(id);
        const [hov, setHov] = useState(false);
        return (
          <div key={id} onClick={() => onMerchant(id)}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{
              background: hov ? "var(--bg3)" : "var(--bg)",
              border: `1px solid ${hov ? "rgba(212,175,55,0.3)" : "var(--border)"}`,
              borderRadius: 14, padding: "22px 20px",
              display: "flex", alignItems: "center", gap: 16, cursor: "pointer",
              position: "relative", overflow: "hidden",
              transform: hov ? "translateY(-4px)" : "translateY(0)",
              boxShadow: hov ? "0 16px 40px rgba(0,0,0,0.4)" : "none",
              transition: "all 0.3s ease",
            }}>
            {badge && (
              <span style={{
                position: "absolute", top: 12, right: 12,
                background: badgeColor + "22", color: badgeColor,
                fontSize: 9, fontWeight: 700, letterSpacing: 1.5,
                padding: "3px 10px", borderRadius: 50,
                border: `1px solid ${badgeColor}44`,
              }}>{badge}</span>
            )}
            <div style={{
              width: 48, height: 48, borderRadius: 12, flexShrink: 0,
              background: m.color, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff",
            }}>{initials(m.name)}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500, color: "var(--cream)" }}>{m.name}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>{m.cat}</div>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

/* ── CATEGORIES ───────────────────────────────────────────────── */
const CategoriesSection = () => (
  <section style={{ padding: "80px 48px", borderTop: "1px solid var(--border)" }}>
    <div style={{ marginBottom: 40 }}>
      <div style={{ fontSize: 11, color: "var(--gold)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Shop By</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 40, fontWeight: 300, color: "var(--cream)" }}>Top Categories</h2>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 }}>
      {CATEGORIES.map(c => {
        const [hov, setHov] = useState(false);
        return (
          <div key={c.name}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{
              background: hov ? "var(--bg2)" : "var(--bg)",
              border: `1px solid ${hov ? "rgba(212,175,55,0.4)" : "var(--border)"}`,
              borderRadius: 14, padding: "28px 20px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
              cursor: "pointer",
              transform: hov ? "translateY(-5px)" : "translateY(0)",
              boxShadow: hov ? "0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.15)" : "none",
              transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            }}>
            <span style={{
              fontSize: 24, color: hov ? "var(--gold)" : "var(--muted)",
              transition: "color 0.3s, transform 0.3s",
              display: "block",
              transform: hov ? "scale(1.2) rotate(15deg)" : "scale(1) rotate(0)",
            }}>{c.icon}</span>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--cream)", textAlign: "center" }}>{c.name}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "center" }}>{c.desc}</div>
          </div>
        );
      })}
    </div>
  </section>
);

/* ── FOOTER ───────────────────────────────────────────────────── */
const Footer = () => (
  <footer style={{ borderTop: "1px solid var(--border)", padding: "48px", background: "var(--ink)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24, marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: "var(--cream)" }}>Deal</span>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 300, fontStyle: "italic", color: "var(--gold)" }}>Scout</span>
      </div>
      <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 300 }}>Your trusted affiliate guide to the world's finest brands.</p>
      <div style={{ display: "flex", gap: 28 }}>
        {["Privacy", "Terms", "About", "Contact"].map(l => (
          <a key={l} href="#" style={{ fontSize: 12, color: "var(--muted)", textDecoration: "none", letterSpacing: 1, textTransform: "uppercase", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "var(--gold)"}
            onMouseLeave={e => e.target.style.color = "var(--muted)"}
          >{l}</a>
        ))}
      </div>
    </div>
    <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, textAlign: "center" }}>
      <p style={{ fontSize: 11, color: "#444", letterSpacing: 1 }}>© 2026 DealScout · All rights reserved · Affiliate links may apply</p>
    </div>
  </footer>
);

/* ── FAQ ITEM ─────────────────────────────────────────────────── */
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: "var(--bg2)", border: `1px solid ${open ? "rgba(212,175,55,0.3)" : "var(--border)"}`,
      borderRadius: 12, overflow: "hidden", transition: "border 0.3s", marginBottom: 10,
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 24px", background: "none", border: "none", cursor: "pointer",
        fontFamily: "'Jost',sans-serif", fontSize: 14, fontWeight: 500, color: "var(--cream)",
        textAlign: "left", gap: 16,
      }}>
        <span>{q}</span>
        <span style={{
          width: 28, height: 28, borderRadius: "50%",
          border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, flexShrink: 0, color: open ? "var(--ink)" : "var(--gold)",
          background: open ? "var(--gold)" : "transparent",
          transform: open ? "rotate(45deg)" : "rotate(0)",
          transition: "all 0.3s ease",
        }}>+</span>
      </button>
      <div style={{
        maxHeight: open ? 200 : 0, overflow: "hidden",
        transition: "max-height 0.4s ease",
      }}>
        <p style={{ padding: "0 24px 20px", fontSize: 14, color: "var(--muted)", lineHeight: 1.75, fontWeight: 300 }}>{a}</p>
      </div>
    </div>
  );
};

/* ── MERCHANT DETAIL PAGE ─────────────────────────────────────── */
const MerchantPage = ({ id, onBack }) => {
  const merchant = getMerchant(id);
  const details = MERCHANT_DETAILS[id] || MERCHANT_DETAILS["flannels"];
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!merchant) return null;

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ padding: "18px 48px", borderBottom: "1px solid var(--border)", display: "flex", gap: 10, alignItems: "center", fontSize: 13 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: 13, fontWeight: 500, padding: 0 }}>← Home</button>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ color: "var(--muted)" }}>{merchant.cat}</span>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ color: "var(--cream)" }}>{merchant.name}</span>
      </div>

      {/* Brand hero */}
      <div style={{
        background: `linear-gradient(135deg, ${merchant.color}cc, ${merchant.color}55, transparent), var(--bg2)`,
        padding: "56px 48px", display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          width: 100, height: 100, borderRadius: 22, background: merchant.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, fontWeight: 700, color: "#fff",
          border: "2px solid rgba(255,255,255,0.2)",
          boxShadow: `0 0 60px ${merchant.color}66`,
        }}>{initials(merchant.name)}</div>

        <div style={{ flex: 1, minWidth: 260 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 52, fontWeight: 600, color: "var(--cream)", lineHeight: 1 }}>{merchant.name}</h1>
          <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 6 }}>{merchant.url} · {merchant.cat}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
            <Stars rating={merchant.rating} />
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{merchant.rating} / 5 · {merchant.reviews.toLocaleString()} reviews</span>
          </div>
        </div>

        <a href={`https://${merchant.url}`} target="_blank" rel="noopener noreferrer" style={{
          background: "var(--gold)", color: "var(--ink)", padding: "16px 36px", borderRadius: 50,
          fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase",
          textDecoration: "none", display: "inline-block",
          boxShadow: "0 8px 32px rgba(212,175,55,0.35)", transition: "all 0.3s",
        }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 16px 48px rgba(212,175,55,0.5)"; }}
          onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 32px rgba(212,175,55,0.35)"; }}
        >Visit {merchant.name} →</a>
      </div>

      {/* Content grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, padding: "32px 48px" }}>
        {/* About */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 16, padding: 36 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 400, color: "var(--cream)", marginBottom: 28 }}>About {merchant.name}</h2>

          {[
            { label: "History", content: <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.8, fontWeight: 300 }}>{details.history}</p> },
            { label: "Product Range", content: (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {details.range.map(r => (
                  <span key={r} style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 50, padding: "5px 14px", fontSize: 12, color: "var(--cream)", letterSpacing: 0.5 }}>{r}</span>
                ))}
              </div>
            )},
            { label: "Designer Brands", content: (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {details.brands.map(b => (
                  <span key={b} style={{ background: "var(--gold-dim)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 50, padding: "5px 14px", fontSize: 12, color: "var(--gold)", letterSpacing: 0.5 }}>{b}</span>
                ))}
              </div>
            )},
            { label: "Services", content: <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.8, fontWeight: 300 }}>{details.services}</p> },
          ].map(({ label, content }) => (
            <div key={label} style={{ marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--gold)", marginBottom: 12 }}>{label}</div>
              {content}
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Quick facts */}
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 16, padding: 28 }}>
            <div style={{ fontSize: 11, color: "var(--gold)", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 18 }}>Quick Facts</div>
            {[
              ["Founded", details.founded],
              ["UK Stores", details.stores],
              ["Free Delivery", details.delivery, true],
              ["Returns Window", details.returns],
              ["Student Discount", details.studentDisc, true],
            ].map(([label, val, green]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: green ? "#4ADE80" : "var(--cream)" }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Feedback */}
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 16, padding: 28 }}>
            <div style={{ fontSize: 11, color: "var(--gold)", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 16 }}>Share Your Experience</div>
            {submitted ? (
              <p style={{ fontSize: 14, color: "#4ADE80", textAlign: "center", padding: "16px 0" }}>Thank you for your feedback ✓</p>
            ) : (
              <>
                <textarea value={feedback} onChange={e => setFeedback(e.target.value)}
                  placeholder={`How was your experience with ${merchant.name}?`}
                  style={{
                    width: "100%", background: "var(--bg3)", border: "1px solid var(--border)",
                    borderRadius: 10, padding: 14, fontSize: 13, color: "var(--cream)",
                    fontFamily: "'Jost',sans-serif", resize: "none", height: 90, outline: "none",
                    fontWeight: 300, lineHeight: 1.6,
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(212,175,55,0.5)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
                <button onClick={() => { if (feedback.trim()) setSubmitted(true); }}
                  style={{
                    marginTop: 10, width: "100%", background: "var(--gold)", color: "var(--ink)",
                    border: "none", padding: "12px", borderRadius: 50,
                    fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase",
                    cursor: "pointer", fontFamily: "'Jost',sans-serif", transition: "opacity 0.2s",
                  }}
                  onMouseEnter={e => e.target.style.opacity = "0.85"}
                  onMouseLeave={e => e.target.style.opacity = "1"}
                >Submit Review</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div style={{ padding: "0 48px 48px" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: "var(--gold)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Support</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 300, color: "var(--cream)" }}>Frequently Asked Questions</h2>
        </div>
        {details.faqs.map(f => <FAQItem key={f.q} q={f.q} a={f.a} />)}
      </div>

      {/* Similar merchants */}
      <div style={{ padding: "0 48px 64px", borderTop: "1px solid var(--border)" }}>
        <div style={{ marginBottom: 28, marginTop: 48 }}>
          <div style={{ fontSize: 11, color: "var(--gold)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>You May Also Like</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 300, color: "var(--cream)" }}>Similar Merchants</h2>
        </div>
        <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
          {details.similar.map(sid => {
            const sm = getMerchant(sid);
            const [hov, setHov] = useState(false);
            return (
              <div key={sid}
                onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
                style={{
                  flexShrink: 0, background: hov ? "var(--bg3)" : "var(--bg2)",
                  border: `1px solid ${hov ? "rgba(212,175,55,0.35)" : "var(--border)"}`,
                  borderRadius: 14, padding: "18px 22px", minWidth: 180,
                  display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
                  transform: hov ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: hov ? "0 12px 32px rgba(0,0,0,0.4)" : "none",
                  transition: "all 0.3s ease",
                }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: sm.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{initials(sm.name)}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--cream)" }}>{sm.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{sm.cat}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ── HOME PAGE ────────────────────────────────────────────────── */
const HomePage = ({ onMerchant }) => (
  <>
    <Hero onShop={() => document.getElementById("merchants-section")?.scrollIntoView({ behavior: "smooth" })} />
    <div id="merchants-section"><CarouselSection onMerchant={onMerchant} /></div>
    <TrendingGrid onMerchant={onMerchant} />
    <CategoriesSection />
    <Footer />
  </>
);

/* ── APP ROOT ─────────────────────────────────────────────────── */
export default function Affliate() {
  const [page, setPage] = useState("home");
  const [activeMerchant, setActiveMerchant] = useState(null);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  const goMerchant = (id) => { setActiveMerchant(id); setPage("merchant"); };
  const goHome = () => { setPage("home"); setActiveMerchant(null); };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <Nav onHome={goHome} onSearch={() => {}} searchVal={searchVal} setSearchVal={setSearchVal} />
        {page === "home"     && <HomePage onMerchant={goMerchant} />}
        {page === "merchant" && <MerchantPage id={activeMerchant} onBack={goHome} />}
      </div>
    </>
  );
}