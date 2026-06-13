import { useState, useEffect, useMemo, useCallback, createContext, useContext } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const MERCHANTS = [
  { id: 1, name: "Amazon", logo: "🛒", color: "#FF9900", bg: "#FFF3E0" },
  { id: 2, name: "Flipkart", logo: "🛍", color: "#2874F0", bg: "#E3F0FF" },
  { id: 3, name: "Myntra", logo: "👗", color: "#FF3F6C", bg: "#FFF0F4" },
  { id: 4, name: "Swiggy", logo: "🍔", color: "#FC8019", bg: "#FFF3E8" },
  { id: 5, name: "BigBasket", logo: "🥦", color: "#84C225", bg: "#F0F8E0" },
  { id: 6, name: "Zomato", logo: "🍕", color: "#E23744", bg: "#FFEAEB" },
  { id: 7, name: "MakeMyTrip", logo: "✈️", color: "#1A9AE0", bg: "#E5F4FD" },
  { id: 8, name: "Nykaa", logo: "💄", color: "#FC2779", bg: "#FFE8F2" },
];

const BANKS = [
  { id: 1, name: "HDFC Bank Credit Card", short: "HDFC" },
  { id: 2, name: "ICICI Bank Credit Card", short: "ICICI" },
  { id: 3, name: "SBI Card", short: "SBI" },
  { id: 4, name: "Axis Bank Credit Card", short: "AXIS" },
  { id: 5, name: "Kotak Mahindra Debit Card", short: "KOTAK" },
  { id: 6, name: "Yes Bank Credit Card", short: "YES" },
];

const CATEGORIES = ["All", "Shopping", "Food delivery", "Groceries", "Fashion", "Travel", "Beauty"];

const OFFERS = [
  { id: 1, mid: 1, bid: 1, category: "Shopping", title: "5% cashback on Amazon with HDFC Credit Card", type: "percent", val: 5, min: 1000, cap: 1500, excl: "Gold, Gift Cards, EMI transactions", until: "2026-12-31", price: 49, sold: 1240, rating: 4.8, hot: false },
  { id: 2, mid: 1, bid: 2, category: "Shopping", title: "3% unlimited cashback on Amazon Pay ICICI Card", type: "percent", val: 3, min: 0, cap: null, excl: "Wallet loads, Gift Cards", until: "2026-12-31", price: 39, sold: 980, rating: 4.6, hot: false },
  { id: 3, mid: 1, bid: 3, category: "Shopping", title: "10% cashback up to ₹750 on Amazon with SBI Card", type: "percent", val: 10, min: 2000, cap: 750, excl: "Gold, Jewellery, Gift Cards, Insurance", until: "2026-09-30", price: 69, sold: 2100, rating: 4.9, hot: true },
  { id: 4, mid: 2, bid: 4, category: "Shopping", title: "7.5% cashback on Flipkart with Axis Bank Cards", type: "percent", val: 7.5, min: 3000, cap: 1000, excl: "Mobiles (capped separately), Gift Cards", until: "2026-10-31", price: 79, sold: 890, rating: 4.7, hot: false },
  { id: 5, mid: 2, bid: 1, category: "Shopping", title: "5% cashback on Flipkart with HDFC Bank Cards", type: "percent", val: 5, min: 2500, cap: 750, excl: "Gift Cards, Recharges", until: "2026-10-31", price: 49, sold: 670, rating: 4.5, hot: false },
  { id: 6, mid: 2, bid: 5, category: "Shopping", title: "₹200 flat cashback on Flipkart with Kotak Debit Card", type: "flat", val: 200, min: 1500, cap: 200, excl: "Gift Cards", until: "2026-08-31", price: 29, sold: 440, rating: 4.4, hot: false },
  { id: 7, mid: 3, bid: 2, category: "Fashion", title: "5% cashback on Myntra with ICICI Bank Credit Card", type: "percent", val: 5, min: 1500, cap: 500, excl: "Gift Cards, Vouchers", until: "2026-11-30", price: 49, sold: 560, rating: 4.6, hot: false },
  { id: 8, mid: 3, bid: 4, category: "Fashion", title: "10% instant discount on Myntra with Axis Bank Cards", type: "percent", val: 10, min: 2000, cap: 1200, excl: "Gift Cards, Beauty (capped separately)", until: "2026-09-15", price: 59, sold: 780, rating: 4.8, hot: true },
  { id: 9, mid: 4, bid: 1, category: "Food delivery", title: "10% cashback on Swiggy with HDFC Bank Credit Card", type: "percent", val: 10, min: 200, cap: 100, excl: "Swiggy Instamart (separate cap)", until: "2026-12-31", price: 29, sold: 3200, rating: 4.9, hot: true },
  { id: 10, mid: 4, bid: 5, category: "Food delivery", title: "15% cashback on Swiggy with Kotak Debit Card", type: "percent", val: 15, min: 150, cap: 75, excl: "Tips, Delivery charges", until: "2026-12-31", price: 29, sold: 4100, rating: 4.9, hot: true },
  { id: 11, mid: 5, bid: 3, category: "Groceries", title: "5% cashback on BigBasket with SBI Card", type: "percent", val: 5, min: 1000, cap: 250, excl: "Fuel surcharge, Gift Cards", until: "2026-12-31", price: 29, sold: 1800, rating: 4.7, hot: false },
  { id: 12, mid: 5, bid: 2, category: "Groceries", title: "₹150 flat cashback on BigBasket orders above ₹2000", type: "flat", val: 150, min: 2000, cap: 150, excl: "Gift Cards", until: "2026-08-31", price: 19, sold: 1200, rating: 4.5, hot: false },
  { id: 13, mid: 6, bid: 4, category: "Food delivery", title: "12% cashback on Zomato with Axis Bank Cards", type: "percent", val: 12, min: 200, cap: 120, excl: "Zomato Pro orders, Tips", until: "2026-12-31", price: 35, sold: 2800, rating: 4.8, hot: true },
  { id: 14, mid: 7, bid: 6, category: "Travel", title: "8% cashback on MakeMyTrip flights with Yes Bank Card", type: "percent", val: 8, min: 5000, cap: 2000, excl: "Bus tickets, Hotel cancellations", until: "2026-11-30", price: 99, sold: 340, rating: 4.6, hot: false },
  { id: 15, mid: 8, bid: 2, category: "Beauty", title: "10% cashback on Nykaa with ICICI Bank Credit Card", type: "percent", val: 10, min: 1500, cap: 600, excl: "Gift Cards, Nykaa Man", until: "2026-10-31", price: 49, sold: 920, rating: 4.7, hot: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inr = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 0 });

function calcCashback(offer, amount) {
  const amt = Number(amount);
  const steps = [];
  let eligible = true, reason = null, raw = 0, final = 0, capApplied = false;
  steps.push({ label: "Transaction amount", value: amt });
  if (amt < offer.min) {
    eligible = false;
    reason = `Minimum spend of ${inr(offer.min)} not met`;
    steps.push({ label: `Minimum required: ${inr(offer.min)}`, value: 0, fail: true });
    return { eligible, reason, raw: 0, final: 0, capApplied: false, steps };
  }
  steps.push({ label: `Meets minimum spend of ${inr(offer.min)}`, value: null, ok: true });
  if (offer.type === "percent") {
    raw = (amt * offer.val) / 100;
    steps.push({ label: `${offer.val}% of ${inr(amt)}`, value: raw });
  } else {
    raw = offer.val;
    steps.push({ label: "Flat cashback amount", value: raw });
  }
  final = raw;
  if (offer.cap != null && raw > offer.cap) {
    capApplied = true;
    final = offer.cap;
    steps.push({ label: `Capped at ${inr(offer.cap)}`, value: -(raw - offer.cap), deduct: true });
  }
  steps.push({ label: "You actually receive", value: final, total: true });
  return { eligible, reason, raw: Math.round(raw * 100) / 100, final: Math.round(final * 100) / 100, capApplied, steps };
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppCtx = createContext(null);
function useApp() { return useContext(AppCtx); }

// ─── Design tokens ────────────────────────────────────────────────────────────

const C = {
  green: "#1A7A5C",
  greenDim: "#E0F0EA",
  greenDeep: "#085041",
  ink: "#0B1220",
  paper: "#F7F5F0",
  paperDim: "#EDEAE2",
  slate: "#6B7380",
  line: "#E2DED5",
  warn: "#C97038",
  warnDim: "#FBF0E3",
};

const styles = {
  app: { minHeight: "100vh", background: "#fff", fontFamily: "'Inter', sans-serif", color: C.ink },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 5vw", height: 60, borderBottom: `1px solid ${C.line}`, position: "sticky", top: 0, background: "#fff", zIndex: 100 },
  navBrand: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  navMark: { width: 32, height: 32, background: C.green, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16 },
  navName: { fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em", color: C.ink },
  navLinks: { display: "flex", gap: 28, fontSize: 14, color: C.slate },
  navLink: { cursor: "pointer", transition: "color 0.15s" },
  navCta: { display: "flex", gap: 10, alignItems: "center" },
  btnGhost: { padding: "7px 16px", border: `1.5px solid ${C.line}`, borderRadius: 8, background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 500, color: C.ink },
  btnSolid: { padding: "7px 18px", border: "none", borderRadius: 8, background: C.green, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 },
  btnLg: { padding: "12px 28px", border: "none", borderRadius: 10, background: C.green, color: "#fff", cursor: "pointer", fontSize: 15, fontWeight: 600 },
  btnLgGhost: { padding: "12px 28px", border: `1.5px solid ${C.line}`, borderRadius: 10, background: "transparent", color: C.ink, cursor: "pointer", fontSize: 15, fontWeight: 500 },
  section: { padding: "56px 5vw" },
  sectionNarrow: { padding: "56px 5vw", maxWidth: 960, margin: "0 auto" },
  eyebrow: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.green, marginBottom: 12, fontWeight: 600 },
  h1: { fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.08, marginBottom: 16, color: C.ink },
  h2: { fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, letterSpacing: "-0.02em", color: C.ink, marginBottom: 8 },
  sub: { fontSize: 15, lineHeight: 1.65, color: C.slate, maxWidth: 520, marginBottom: 28 },
  badge: { display: "inline-block", padding: "3px 10px", borderRadius: 999, background: C.greenDim, color: C.greenDeep, fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" },
  badgeHot: { display: "inline-block", padding: "3px 10px", borderRadius: 999, background: "#FFF0E0", color: "#8B4500", fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" },
  card: { background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: "20px", cursor: "pointer", transition: "border-color 0.15s, transform 0.15s", display: "flex", flexDirection: "column", gap: 10 },
  footer: { background: C.ink, color: "rgba(247,245,240,0.5)", padding: "40px 5vw 32px", fontSize: 13 },
};

// ─── Shared components ────────────────────────────────────────────────────────

function Navbar({ page, setPage, cartCount }) {
  return (
    <nav style={styles.nav}>
      <div style={styles.navBrand} onClick={() => setPage("home")}>
        <div style={styles.navMark}>₹</div>
        <span style={styles.navName}>CashbackNow</span>
      </div>
      <div style={styles.navLinks}>
        {["Browse", "Calculator", "How it works"].map(l => (
          <span
            key={l}
            style={{ ...styles.navLink, color: page === l.toLowerCase().replace(/ /g, "-") ? C.green : C.slate, fontWeight: page === l.toLowerCase().replace(/ /g, "-") ? 600 : 400 }}
            onClick={() => setPage(l.toLowerCase().replace(/ /g, "-"))}
          >{l}</span>
        ))}
      </div>
      <div style={styles.navCta}>
        <button style={styles.btnGhost} onClick={() => setPage("cart")} aria-label="Cart">
          🛒 Cart {cartCount > 0 && <span style={{ background: C.green, color: "#fff", borderRadius: 999, padding: "1px 7px", fontSize: 11, marginLeft: 4 }}>{cartCount}</span>}
        </button>
        <button style={styles.btnSolid}>Sign up free</button>
      </div>
    </nav>
  );
}

function OfferCard({ offer, onBuy, onView, inCart }) {
  const m = MERCHANTS.find(m => m.id === offer.mid);
  const b = BANKS.find(b => b.id === offer.bid);
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{ ...styles.card, borderColor: hover ? C.green : inCart ? C.green : C.line, transform: hover ? "translateY(-3px)" : "none", background: inCart ? "#F5FBF8" : "#fff" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onView(offer)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{m.logo}</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <span style={offer.hot ? styles.badgeHot : styles.badge}>{offer.type === "percent" ? `${offer.val}%` : inr(offer.val)}</span>
          {offer.hot && <span style={{ fontSize: 10, color: C.warn, fontWeight: 600 }}>🔥 HOT</span>}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: C.slate, marginBottom: 3, fontFamily: "'JetBrains Mono', monospace" }}>{b.short}</div>
        <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, color: C.ink }}>{offer.title}</div>
      </div>
      <div style={{ display: "flex", gap: 10, fontSize: 11, color: C.slate, fontFamily: "'JetBrains Mono', monospace" }}>
        <span>Min {inr(offer.min)}</span>
        {offer.cap && <span>Cap {inr(offer.cap)}</span>}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
        <div>
          <span style={{ fontSize: 17, fontWeight: 700, color: C.ink }}>{inr(offer.price)}</span>
          <span style={{ fontSize: 11, color: C.slate, marginLeft: 4 }}>/ deal</span>
        </div>
        <button
          style={{ ...styles.btnSolid, padding: "6px 14px", fontSize: 12, background: inCart ? C.slate : C.green }}
          onClick={e => { e.stopPropagation(); onBuy(offer); }}
        >{inCart ? "In cart" : "Add to cart"}</button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.slate }}>
        <span style={{ color: "#F59E0B" }}>★</span>
        <span>{offer.rating}</span>
        <span>· {offer.sold.toLocaleString("en-IN")} sold</span>
      </div>
    </div>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────

function HomePage({ setPage, cart, addToCart }) {
  const [activeCat, setActiveCat] = useState("All");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const filtered = useMemo(() =>
    activeCat === "All" ? OFFERS : OFFERS.filter(o => o.category === activeCat),
    [activeCat]
  );
  const hot = OFFERS.filter(o => o.hot).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <div style={{ background: C.ink, color: "#fff", padding: "72px 5vw 64px" }}>
        <p style={{ ...styles.eyebrow, color: C.green, marginBottom: 16 }}>India's cashback marketplace</p>
        <h1 style={{ ...styles.h1, color: "#fff", maxWidth: 640 }}>
          Buy verified cashback deals.<br />
          <span style={{ color: C.green }}>Get real money back.</span>
        </h1>
        <p style={{ ...styles.sub, color: "rgba(247,245,240,0.65)", maxWidth: 480 }}>
          Every bank offer hides its real value behind fine print. We decode 200+ live bank deals and sell them as ready-to-use cashback packs — verified, calculated, guaranteed.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button style={styles.btnLg} onClick={() => setPage("browse")}>Browse all deals</button>
          <button style={{ ...styles.btnLgGhost, borderColor: "rgba(255,255,255,0.25)", color: "#fff" }} onClick={() => setPage("how-it-works")}>How it works</button>
        </div>
        <div style={{ display: "flex", gap: 40, marginTop: 40 }}>
          {[["₹2.4Cr", "Cashback earned"], ["48K", "Active users"], ["200+", "Live offers"], ["5", "Banks covered"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff" }}>{n}</div>
              <div style={{ fontSize: 12, color: "rgba(247,245,240,0.45)", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hot deals */}
      <div style={{ padding: "48px 5vw 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <p style={styles.eyebrow}>Right now</p>
            <h2 style={styles.h2}>Hot deals</h2>
          </div>
          <span style={{ fontSize: 13, color: C.green, cursor: "pointer", fontWeight: 600 }} onClick={() => setPage("browse")}>See all →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {hot.map(o => (
            <OfferCard key={o.id} offer={o} onBuy={addToCart} onView={setSelectedOffer} inCart={cart.some(c => c.id === o.id)} />
          ))}
        </div>
      </div>

      {/* Category strip */}
      <div style={{ padding: "48px 5vw 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <p style={styles.eyebrow}>Browse by category</p>
            <h2 style={styles.h2}>All offers</h2>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setActiveCat(c)} style={{ padding: "7px 16px", borderRadius: 999, border: `1.5px solid ${activeCat === c ? C.green : C.line}`, background: activeCat === c ? C.greenDim : "#fff", color: activeCat === c ? C.greenDeep : C.slate, fontSize: 13, fontWeight: activeCat === c ? 600 : 400, cursor: "pointer" }}>{c}</button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16, marginBottom: 56 }}>
          {filtered.map(o => (
            <OfferCard key={o.id} offer={o} onBuy={addToCart} onView={setSelectedOffer} inCart={cart.some(c => c.id === o.id)} />
          ))}
        </div>
      </div>

      {/* Trust bar */}
      <div style={{ borderTop: `1px solid ${C.line}`, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        {[
          ["🛡", "Verified offers", "Every deal manually checked before listing"],
          ["🧮", "Real calculator", "See exact cashback before buying"],
          ["🔒", "Secure checkout", "Razorpay · UPI · All major cards"],
          ["↩️", "7-day refund", "Full refund if the offer is invalid"],
        ].map(([icon, title, desc]) => (
          <div key={title} style={{ padding: "28px 24px", borderRight: `1px solid ${C.line}`, textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 12, color: C.slate, lineHeight: 1.5 }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* CTA banner */}
      <div style={{ background: C.greenDim, padding: "56px 5vw", textAlign: "center" }}>
        <p style={{ ...styles.eyebrow, textAlign: "center" }}>Don't guess — calculate</p>
        <h2 style={{ ...styles.h2, textAlign: "center", marginBottom: 12 }}>See your exact cashback before buying any deal</h2>
        <p style={{ ...styles.sub, textAlign: "center", margin: "0 auto 28px" }}>Our cashback calculator runs every condition — min spend, category exclusions, payout caps — so you know exactly what lands in your account.</p>
        <button style={styles.btnLg} onClick={() => setPage("calculator")}>Open calculator</button>
      </div>

      {/* Deal modal */}
      {selectedOffer && <DealModal offer={selectedOffer} onClose={() => setSelectedOffer(null)} onBuy={addToCart} inCart={cart.some(c => c.id === selectedOffer.id)} />}
    </div>
  );
}

function BrowsePage({ cart, addToCart }) {
  const [activeCat, setActiveCat] = useState("All");
  const [activeMid, setActiveMid] = useState(null);
  const [sort, setSort] = useState("hot");
  const [selectedOffer, setSelectedOffer] = useState(null);

  const filtered = useMemo(() => {
    let list = [...OFFERS];
    if (activeCat !== "All") list = list.filter(o => o.category === activeCat);
    if (activeMid) list = list.filter(o => o.mid === activeMid);
    if (sort === "hot") list = [...list].sort((a, b) => (b.hot ? 1 : 0) - (a.hot ? 1 : 0) || b.sold - a.sold);
    if (sort === "cashback") list = [...list].sort((a, b) => b.val - a.val);
    if (sort === "price-low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [activeCat, activeMid, sort]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "calc(100vh - 60px)" }}>
      {/* Sidebar */}
      <aside style={{ borderRight: `1px solid ${C.line}`, padding: "28px 20px" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.slate, marginBottom: 12 }}>Category</div>
          {CATEGORIES.map(c => (
            <div key={c} onClick={() => setActiveCat(c)} style={{ padding: "7px 10px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: activeCat === c ? 600 : 400, color: activeCat === c ? C.greenDeep : C.ink, background: activeCat === c ? C.greenDim : "transparent", marginBottom: 2 }}>{c}</div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.slate, marginBottom: 12 }}>Merchant</div>
          <div onClick={() => setActiveMid(null)} style={{ padding: "7px 10px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: !activeMid ? 600 : 400, color: !activeMid ? C.greenDeep : C.ink, background: !activeMid ? C.greenDim : "transparent", marginBottom: 2 }}>All merchants</div>
          {MERCHANTS.map(m => (
            <div key={m.id} onClick={() => setActiveMid(activeMid === m.id ? null : m.id)} style={{ padding: "7px 10px", borderRadius: 8, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 8, fontWeight: activeMid === m.id ? 600 : 400, color: activeMid === m.id ? C.greenDeep : C.ink, background: activeMid === m.id ? C.greenDim : "transparent", marginBottom: 2 }}>
              <span>{m.logo}</span>{m.name}
            </div>
          ))}
        </div>
      </aside>

      {/* Main */}
      <div style={{ padding: "28px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontSize: 14, color: C.slate }}>{filtered.length} deals found</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: C.slate }}>Sort by</span>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ fontSize: 13, padding: "6px 12px", border: `1px solid ${C.line}`, borderRadius: 8, background: "#fff", cursor: "pointer" }}>
              <option value="hot">Popular</option>
              <option value="cashback">Highest cashback %</option>
              <option value="price-low">Lowest price</option>
              <option value="rating">Best rated</option>
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {filtered.map(o => (
            <OfferCard key={o.id} offer={o} onBuy={addToCart} onView={setSelectedOffer} inCart={cart.some(c => c.id === o.id)} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: C.slate }}>No deals match this filter.</div>
        )}
      </div>

      {selectedOffer && <DealModal offer={selectedOffer} onClose={() => setSelectedOffer(null)} onBuy={addToCart} inCart={cart.some(c => c.id === selectedOffer.id)} />}
    </div>
  );
}

function CalculatorPage() {
  const [mid, setMid] = useState(1);
  const [bid, setBid] = useState(1);
  const [amount, setAmount] = useState("5000");
  const offer = OFFERS.find(o => o.mid === mid && o.bid === bid);
  const result = useMemo(() => {
    if (!offer || !amount || Number(amount) <= 0) return null;
    return calcCashback(offer, amount);
  }, [offer, amount]);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 5vw" }}>
      <p style={styles.eyebrow}>Cashback calculator</p>
      <h1 style={{ ...styles.h1, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", marginBottom: 10 }}>See your exact cashback — before you pay</h1>
      <p style={{ ...styles.sub, marginBottom: 36 }}>Pick any merchant, your bank card, and enter your planned spend. We run every condition and show you precisely what you'll receive.</p>

      <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 16, padding: "32px", boxShadow: "0 8px 32px -8px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 17 }}>Cashback estimator</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.green, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, display: "inline-block", animation: "pulse 2s infinite" }} />
            LIVE
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.slate, marginBottom: 8 }}>Merchant</label>
            <select value={mid} onChange={e => setMid(+e.target.value)} style={{ width: "100%", fontSize: 14, padding: "10px 14px", border: `1.5px solid ${C.line}`, borderRadius: 8, background: "#fff" }}>
              {MERCHANTS.map(m => <option key={m.id} value={m.id}>{m.logo} {m.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.slate, marginBottom: 8 }}>Bank / card</label>
            <select value={bid} onChange={e => setBid(+e.target.value)} style={{ width: "100%", fontSize: 14, padding: "10px 14px", border: `1.5px solid ${C.line}`, borderRadius: 8, background: "#fff" }}>
              {BANKS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.slate, marginBottom: 8 }}>Transaction amount</label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: C.slate }}>₹</span>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} min="0" style={{ width: "100%", fontSize: 18, fontWeight: 700, padding: "12px 14px 12px 32px", border: `1.5px solid ${C.line}`, borderRadius: 8, fontFamily: "'JetBrains Mono', monospace" }} />
          </div>
        </div>

        <div style={{ borderTop: `1.5px dashed ${C.line}`, paddingTop: 20 }}>
          {!offer ? (
            <div style={{ color: C.slate, fontSize: 13 }}>No offer found for this merchant + bank combination.</div>
          ) : !result ? (
            <div style={{ color: C.slate, fontSize: 13 }}>Enter an amount to see your cashback breakdown.</div>
          ) : (
            <>
              {result.steps.map((s, i) => {
                const isTotal = s.total, isOk = s.ok, isFail = s.fail, isDeduct = s.deduct;
                return (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: isTotal ? "14px 0 0" : "6px 0", borderTop: isTotal ? `1.5px solid ${C.ink}` : "none", marginTop: isTotal ? 8 : 0, gap: 12 }}>
                    <span style={{ fontSize: isTotal ? 15 : 13, fontWeight: isTotal ? 700 : 400, color: isOk ? C.green : isFail ? C.warn : isDeduct ? C.warn : C.ink, textDecoration: isDeduct ? "line-through" : "none", flex: 1 }}>
                      {isOk && "✓ "}{s.label}
                    </span>
                    {s.value !== null && (
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: isTotal ? 28 : 13, color: isTotal ? C.green : isDeduct ? C.warn : C.ink, textDecoration: isDeduct ? "line-through" : "none", whiteSpace: "nowrap" }}>
                        {s.value < 0 ? "−" : ""}{inr(Math.abs(s.value))}
                      </span>
                    )}
                  </div>
                );
              })}
              {!result.eligible && (
                <div style={{ marginTop: 14, padding: "12px 14px", background: C.warnDim, border: `1px solid ${C.warn}`, borderRadius: 8, fontSize: 13, color: "#8a4a1c", fontWeight: 500 }}>
                  {result.reason}. No cashback applies.
                </div>
              )}
              {result.eligible && (
                <div style={{ marginTop: 14, padding: "12px 14px", background: C.greenDim, border: `1px solid ${C.green}`, borderRadius: 8, fontSize: 13, color: C.greenDeep, fontWeight: 500 }}>
                  Effective rate: {((result.final / Number(amount)) * 100).toFixed(2)}%{result.capApplied ? " (cap applied)" : ""}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function HowItWorksPage() {
  const steps = [
    { n: "01", icon: "🔍", title: "Browse verified deals", desc: "We manually verify every cashback offer from HDFC, ICICI, SBI, Axis, Kotak and more. No expired offers, no misleading claims." },
    { n: "02", icon: "🧮", title: "Calculate your real cashback", desc: "Use our calculator to enter your planned spend. We apply every condition — minimum spend, exclusions, caps — and show the exact amount you'll earn." },
    { n: "03", icon: "🛒", title: "Buy the deal pack", desc: "Each deal pack costs between ₹19–₹99. After purchasing, you receive a verified offer code and step-by-step redemption instructions." },
    { n: "04", icon: "💰", title: "Shop and get cashback", desc: "Use your card at the merchant. The cashback lands in your account within the bank's processing timeline — typically 30–90 days." },
  ];

  return (
    <div>
      <div style={{ background: C.ink, padding: "72px 5vw 64px", color: "#fff" }}>
        <p style={{ ...styles.eyebrow, color: C.green, marginBottom: 16 }}>No asterisks</p>
        <h1 style={{ ...styles.h1, color: "#fff", maxWidth: 540 }}>How CashbackNow works</h1>
        <p style={{ ...styles.sub, color: "rgba(247,245,240,0.65)" }}>Four steps from browsing to money in your account.</p>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 5vw" }}>
        {steps.map((s, i) => (
          <div key={s.n} style={{ display: "flex", gap: 28, marginBottom: 48 }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: C.greenDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{s.icon}</div>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.green, fontWeight: 700, marginBottom: 6, letterSpacing: "0.08em" }}>{s.n}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.01em" }}>{s.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.slate }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: C.greenDim, padding: "56px 5vw" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ ...styles.h2, marginBottom: 24 }}>Frequently asked questions</h2>
          {[
            ["What is a deal pack?", "A deal pack is a verified, ready-to-use cashback offer tied to a specific bank card and merchant. Buying it confirms your eligibility and gives you redemption instructions."],
            ["Why do I pay for a deal?", "The small fee (₹19–₹99) covers our manual verification work and the calculator infrastructure. The cashback you earn almost always far exceeds the pack cost."],
            ["What if the offer is invalid?", "We offer a full refund within 7 days if the bank cancels or modifies the offer after your purchase."],
            ["Which banks are covered?", "HDFC, ICICI, SBI, Axis, Kotak, and Yes Bank — with more being added monthly."],
          ].map(([q, a]) => (
            <div key={q} style={{ borderTop: `1px solid ${C.line}`, padding: "20px 0" }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{q}</div>
              <div style={{ fontSize: 14, color: C.slate, lineHeight: 1.65 }}>{a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CartPage({ cart, removeFromCart, clearCart }) {
  const [ordered, setOrdered] = useState(false);
  const total = cart.reduce((s, o) => s + o.price, 0);

  if (ordered) {
    return (
      <div style={{ maxWidth: 560, margin: "80px auto", padding: "0 5vw", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
        <h1 style={{ ...styles.h1, fontSize: "2rem", marginBottom: 12 }}>Order confirmed!</h1>
        <p style={{ ...styles.sub, textAlign: "center", margin: "0 auto 28px" }}>Your cashback deal packs have been sent to your email. Check your inbox for redemption instructions.</p>
        <button style={styles.btnLg} onClick={clearCart}>Browse more deals</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 5vw" }}>
      <h1 style={{ ...styles.h1, fontSize: "1.8rem", marginBottom: 28 }}>Your cart</h1>
      {cart.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: C.slate }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
          <p style={{ fontSize: 15 }}>Your cart is empty. Browse deals to get started.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32, alignItems: "start" }}>
          <div>
            {cart.map(o => {
              const m = MERCHANTS.find(m => m.id === o.mid);
              const b = BANKS.find(b => b.id === o.bid);
              return (
                <div key={o.id} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: `1px solid ${C.line}`, alignItems: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{m.logo}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{o.title}</div>
                    <div style={{ fontSize: 11, color: C.slate }}>{b.name}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginRight: 12 }}>{inr(o.price)}</div>
                  <button onClick={() => removeFromCart(o.id)} style={{ border: "none", background: "none", cursor: "pointer", color: C.slate, fontSize: 18 }}>×</button>
                </div>
              );
            })}
          </div>
          <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: 24, position: "sticky", top: 80 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Order summary</div>
            {cart.map(o => (
              <div key={o.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8, color: C.slate }}>
                <span style={{ flex: 1, marginRight: 12 }}>{MERCHANTS.find(m => m.id === o.mid)?.name} · {BANKS.find(b => b.id === o.bid)?.short}</span>
                <span style={{ fontWeight: 600, color: C.ink }}>{inr(o.price)}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 14, marginTop: 14, display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 17, marginBottom: 4 }}>
              <span>Total</span><span>{inr(total)}</span>
            </div>
            <div style={{ fontSize: 12, color: C.green, marginBottom: 20 }}>
              Potential cashback: up to {inr(cart.reduce((s, o) => s + (o.cap || o.val * 50), 0))}
            </div>
            <button style={{ ...styles.btnLg, width: "100%", marginBottom: 10 }} onClick={() => setOrdered(true)}>
              Pay {inr(total)} · UPI / Card
            </button>
            <div style={{ textAlign: "center", fontSize: 11, color: C.slate }}>🔒 Secured by Razorpay · 7-day refund</div>
          </div>
        </div>
      )}
    </div>
  );
}

function DealModal({ offer, onClose, onBuy, inCart }) {
  const m = MERCHANTS.find(m => m.id === offer.mid);
  const b = BANKS.find(b => b.id === offer.bid);
  const [amount, setAmount] = useState("5000");
  const result = useMemo(() => {
    if (!amount || Number(amount) <= 0) return null;
    return calcCashback(offer, amount);
  }, [offer, amount]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(11,18,32,0.65)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 20, maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "28px 28px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{m.logo}</div>
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: C.slate, fontFamily: "'JetBrains Mono', monospace", marginBottom: 3 }}>{b.short}</div>
                <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.35 }}>{offer.title}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 22, color: C.slate, lineHeight: 1, padding: 4 }}>×</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
            {[["Cashback", offer.type === "percent" ? `${offer.val}%` : inr(offer.val)], ["Min spend", inr(offer.min)], ["Max cashback", offer.cap ? inr(offer.cap) : "No cap"], ["Valid until", offer.until]].map(([l, v]) => (
              <div key={l} style={{ background: C.paper, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10, color: C.slate, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 3 }}>{l}</div>
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: C.ink }}>{v}</div>
              </div>
            ))}
          </div>

          {offer.excl && <div style={{ fontSize: 12, color: C.slate, background: C.paper, borderRadius: 8, padding: "10px 14px", marginBottom: 20 }}>Excludes: {offer.excl}</div>}

          <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 20, marginBottom: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Calculate your cashback</div>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: C.slate }}>₹</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: "100%", fontSize: 16, fontWeight: 700, padding: "10px 14px 10px 30px", border: `1.5px solid ${C.line}`, borderRadius: 8, fontFamily: "'JetBrains Mono', monospace" }} />
            </div>
            {result && (
              <div style={{ background: result.eligible ? C.greenDim : C.warnDim, borderRadius: 10, padding: "14px 16px", marginBottom: 4 }}>
                <div style={{ fontSize: 12, color: result.eligible ? C.greenDeep : "#8a4a1c", marginBottom: 4 }}>{result.eligible ? "You receive" : result.reason}</div>
                <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: result.eligible ? C.green : C.warn }}>{inr(result.final)}</div>
                {result.eligible && result.capApplied && <div style={{ fontSize: 11, color: C.greenDeep, marginTop: 2 }}>Cap applied — raw cashback was {inr(result.raw)}</div>}
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: "20px 28px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <span style={{ fontSize: 22, fontWeight: 800 }}>{inr(offer.price)}</span>
              <span style={{ fontSize: 12, color: C.slate, marginLeft: 6 }}>/ deal pack</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.slate }}>
              <span style={{ color: "#F59E0B" }}>★</span> {offer.rating} · {offer.sold.toLocaleString("en-IN")} sold
            </div>
          </div>
          <button style={{ ...styles.btnLg, width: "100%", background: inCart ? C.slate : C.green }} onClick={() => { onBuy(offer); onClose(); }}>
            {inCart ? "Already in cart" : `Add to cart — ${inr(offer.price)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={styles.footer}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, marginBottom: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, background: C.green, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>₹</div>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>CashbackNow</span>
          </div>
          <p style={{ lineHeight: 1.6, fontSize: 12 }}>India's first verified cashback marketplace. Real offers, real money back.</p>
        </div>
        {[
          ["Product", ["Browse deals", "Calculator", "How it works"]],
          ["Banks", ["HDFC offers", "ICICI offers", "SBI offers", "Axis offers", "Kotak offers"]],
          ["Company", ["About us", "Blog", "Careers", "Contact"]],
        ].map(([title, links]) => (
          <div key={title}>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 13, marginBottom: 12 }}>{title}</div>
            {links.map(l => <div key={l} style={{ fontSize: 12, marginBottom: 7, cursor: "pointer" }}>{l}</div>)}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(247,245,240,0.12)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <span>© 2026 CashbackNow. All rights reserved.</span>
        <span>Offer terms modelled on HDFC, ICICI, SBI, Axis, Kotak promotion structures · Always confirm on bank's official page before transacting.</span>
      </div>
    </footer>
  );
}

// ─── App shell ────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);

  const addToCart = useCallback((offer) => {
    setCart(prev => prev.some(o => o.id === offer.id) ? prev : [...prev, offer]);
  }, []);
  const removeFromCart = useCallback((id) => setCart(prev => prev.filter(o => o.id !== id)), []);
  const clearCart = useCallback(() => { setCart([]); setPage("home"); }, []);

  const navigate = (p) => { setPage(p); window.scrollTo(0, 0); };

  return (
    <div style={styles.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input, select { outline: none; font-family: inherit; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        button { font-family: inherit; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: #D8D4C8; border-radius: 3px; }
      `}</style>

      <Navbar page={page} setPage={navigate} cartCount={cart.length} />

      {page === "home" && <HomePage setPage={navigate} cart={cart} addToCart={addToCart} />}
      {page === "browse" && <BrowsePage cart={cart} addToCart={addToCart} />}
      {page === "calculator" && <CalculatorPage />}
      {page === "how-it-works" && <HowItWorksPage />}
      {page === "cart" && <CartPage cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} />}

      <Footer setPage={navigate} />
    </div>
  );
}
