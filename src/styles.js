import { colors } from "./constants";

export const s = {
  app: { fontFamily: "'Georgia', serif", background: colors.bg, minHeight: "100vh", color: colors.text },
  header: { background: colors.primary, color: "#fff", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo: { fontSize: "1.4rem", fontWeight: "bold", letterSpacing: "0.5px" },
  roleTag: { fontSize: "0.78rem", background: "rgba(255,255,255,0.2)", padding: "3px 10px", borderRadius: "20px", marginLeft: "10px", verticalAlign: "middle" },
  logoutBtn: { background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem" },
  nav: { background: colors.card, borderBottom: `1px solid ${colors.border}`, padding: "0 28px", display: "flex", gap: "4px" },
  navBtn: (active) => ({ padding: "12px 18px", border: "none", background: "none", cursor: "pointer", fontSize: "0.9rem", color: active ? colors.primary : colors.muted, borderBottom: active ? `2px solid ${colors.primary}` : "2px solid transparent", fontWeight: active ? "600" : "400", fontFamily: "'Georgia', serif" }),
  main: { padding: "28px", maxWidth: "900px", margin: "0 auto" },
  card: { background: colors.card, border: `1px solid ${colors.border}`, borderRadius: "10px", padding: "24px", marginBottom: "18px" },
  h2: { margin: "0 0 18px", fontSize: "1.25rem", color: colors.primary, borderBottom: `1px solid ${colors.border}`, paddingBottom: "10px" },
  h3: { margin: "0 0 10px", fontSize: "1rem", color: colors.text },
  label: { display: "block", fontSize: "0.85rem", color: colors.muted, marginBottom: "5px", fontWeight: "600", letterSpacing: "0.3px" },
  input: { width: "100%", padding: "9px 12px", border: `1px solid ${colors.border}`, borderRadius: "6px", fontSize: "0.95rem", boxSizing: "border-box", fontFamily: "'Georgia', serif", background: colors.bg },
  btn: (variant = "primary") => ({
    padding: "9px 20px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem", fontFamily: "'Georgia', serif", fontWeight: "600",
    background: variant === "primary" ? colors.primary : variant === "danger" ? colors.danger : variant === "success" ? colors.success : variant === "accent" ? colors.accent : "#e2e8f0",
    color: variant === "ghost" ? colors.text : "#fff",
  }),
  slotGrid: { display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" },
  slot: (available, selected) => ({
    padding: "7px 14px", borderRadius: "6px", border: `1px solid ${selected ? colors.primary : available ? colors.border : colors.border}`,
    background: selected ? colors.primary : available ? colors.card : "#f8d7d7",
    color: selected ? "#fff" : available ? colors.text : "#c0392b",
    cursor: available ? "pointer" : "not-allowed", fontSize: "0.85rem", fontFamily: "'Georgia', serif"
  }),
  doctorCard: (selected) => ({
    padding: "14px 18px", borderRadius: "8px", border: `2px solid ${selected ? colors.primary : colors.border}`,
    background: selected ? colors.primaryLight : colors.card, cursor: "pointer", marginBottom: "10px"
  }),
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" },
  msg: (type) => ({ padding: "10px 14px", borderRadius: "6px", marginTop: "12px", fontSize: "0.9rem", background: type === "success" ? "#d4edda" : "#f8d7da", color: type === "success" ? "#155724" : "#721c24" }),
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 12px", fontSize: "0.8rem", color: colors.muted, borderBottom: `1px solid ${colors.border}`, fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase" },
  td: { padding: "10px 12px", fontSize: "0.9rem", borderBottom: `1px solid ${colors.border}` },
};
