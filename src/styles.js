// For UI  (UPDATE: Now more mobile friendly)
export const colors = {
  primary: "#0f46be",       // Vibrant Blue
  primaryLight: "#dbeafe",  // Soft Blue highlight
  accent: "#7c3aed",        // Purple for actions
  success: "#16a34a",       // Crisp Green
  danger: "#d34141",        // Sharp Red
  warning: "#ca8a04",       // Amber
  bg: "#f8fafc",            // Light grey canvas background
  card: "#ffffff",          // Clean white for panels
  border: "#e2e8f0",        // Subtle border lines
  text: "#1e293b",          // Dark slate for readability
  muted: "#64748b",         // Cool grey for descriptions
};

export const s = {
  // Global layout framework
  app: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "16px",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: colors.text,
    backgroundColor: colors.bg,
    minHeight: "100vh",
    boxSizing: "border-box",
    width: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: `1px solid ${colors.border}`,
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "12px",
  },
  logo: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: colors.primary,
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  
  // MISSING HEADER/NAV STYLES RESTORED
  roleTag: {
    fontSize: "0.75rem",
    backgroundColor: colors.primaryLight,
    color: colors.primary,
    padding: "3px 10px",
    borderRadius: "20px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  logoutBtn: {
    padding: "6px 14px",
    backgroundColor: "transparent",
    color: colors.danger,
    border: `1px solid ${colors.danger}`,
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "500",
  },
  nav: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    overflowX: "auto",      // Allows horizontal scroll on mobile for tabs
    whiteSpace: "nowrap",
    paddingBottom: "5px",   // Gives breathing room for the scrollbar
  },
  navBtn: (active) => ({
    padding: "10px 18px",
    backgroundColor: active ? colors.primary : colors.card,
    color: active ? "#ffffff" : colors.muted,
    border: active ? `1px solid ${colors.primary}` : `1px solid ${colors.border}`,
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: active ? "600" : "500",
    fontSize: "0.9rem",
    transition: "all 0.15s ease",
  }),

  main: {
    width: "100%",
    boxSizing: "border-box",
  },

  // Responsive Cards and Dynamic Grids
  card: {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
    width: "100%",
    boxSizing: "border-box",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
    width: "100%",
    boxSizing: "border-box",
  },

  // Typography
  h1: { margin: "0 0 8px 0", fontSize: "1.8rem", color: colors.primary },
  h2: { margin: "0 0 16px 0", fontSize: "1.35rem", fontWeight: "600", paddingBottom: "8px", borderBottom: `1px solid ${colors.border}` },
  h3: { margin: "14px 0 8px 0", fontSize: "1.1rem", fontWeight: "600" },

  // Mobile-safe horizontal scrollable tables
  table: {
    width: "100%",
    borderCollapse: "collapse",
    display: "block",
    overflowX: "auto",
    whiteSpace: "nowrap",
    WebkitOverflowScrolling: "touch",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    background: colors.bg,
    borderBottom: `2px solid ${colors.border}`,
    color: colors.muted,
    fontSize: "0.85rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  td: {
    padding: "12px",
    borderBottom: `1px solid ${colors.border}`,
    fontSize: "0.92rem",
    verticalAlign: "middle",
  },

  // Forms and Inputs
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "0.88rem",
    fontWeight: "500",
    color: colors.muted,
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: `1px solid ${colors.border}`,
    fontSize: "0.95rem",
    background: colors.card,
    color: colors.text,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s ease",
    fontFamily: "inherit",
  },

  btn: (type = "primary") => {
    const base = {
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      fontWeight: "500",
      fontSize: "0.92rem",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "opacity 0.15s ease, transform 0.1s ease",
      fontFamily: "inherit",
    };

    const themes = {
      primary: { background: colors.primary, color: "#ffffff" },
      success: { background: colors.success, color: "#ffffff" },
      danger: { background: colors.danger, color: "#ffffff" },
      accent: { background: colors.accent, color: "#ffffff" },
      ghost: { background: "transparent", color: colors.muted, border: `1px solid ${colors.border}` },
    };

    return { ...base, ...themes[type] };
  },

  // Appointment Interactive Time Slots
  slotGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(95px, 1fr))",
    gap: "8px",
    marginTop: "8px",
  },
  slot: (available, selected) => ({
    padding: "10px 6px",
    textAlign: "center",
    borderRadius: "6px",
    fontSize: "0.85rem",
    fontWeight: "500",
    cursor: available ? "pointer" : "not-allowed",
    background: selected 
      ? colors.primary 
      : available 
        ? colors.primaryLight 
        : colors.border,
    color: selected 
      ? "#ffffff" 
      : available 
        ? colors.primary 
        : colors.muted,
    border: `1px solid ${selected ? colors.primary : "transparent"}`,
    userSelect: "none",
  }),

  // Selection Card list components (Doctors list UI)
  doctorCard: (selected) => ({
    padding: "14px",
    borderRadius: "10px",
    border: `2px solid ${selected ? colors.primary : colors.border}`,
    background: selected ? colors.primaryLight : colors.card,
    cursor: "pointer",
    marginBottom: "10px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    transition: "all 0.15s ease",
  }),

  // Application Notification Banners
  msg: (type = "info") => ({
    padding: "12px 16px",
    borderRadius: "8px",
    marginTop: "12px",
    fontSize: "0.88rem",
    fontWeight: "500",
    lineHeight: "1.4",
    background: type === "error" || type === "danger" 
      ? "#fef2f2" 
      : type === "success" 
        ? "#f0fdf4" 
        : "#fefce8",
    color: type === "error" || type === "danger" 
      ? colors.danger 
      : type === "success" 
        ? colors.success 
        : colors.warning,
    border: `1px solid ${
      type === "error" || type === "danger" 
        ? "#fee2e2" 
        : type === "success" 
          ? "#dcfce7" 
          : "#fef9c3"
    }`,
  })
};