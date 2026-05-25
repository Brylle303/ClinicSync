import { colors } from "../constants";
import { s } from "../styles";

export default function LoginPage({ username, password, loginError, setUsername, setPassword, onLogin }) {
  return (
    <div style={{ ...s.app, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "40px", width: "360px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "2rem", marginBottom: "4px" }}>🏥</div>
          <h1 style={{ margin: 0, fontSize: "1.6rem", color: colors.primary }}>ClinicSync</h1>
          <p style={{ margin: "4px 0 0", color: colors.muted, fontSize: "0.88rem" }}>Clinic Booking System</p>
        </div>
        <div style={{ marginBottom: "14px" }}>
          <label style={s.label}>Username</label>
          <input
            style={s.input}
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Input username"
          />
        </div>
        <div style={{ marginBottom: "18px" }}>
          <label style={s.label}>Password</label>
          <input
            style={s.input}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Input password"
            onKeyDown={e => e.key === "Enter" && onLogin()}
          />
        </div>
        {loginError && <div style={s.msg("error")}>{loginError}</div>}
        <button
          style={{ ...s.btn("primary"), width: "100%", padding: "11px", marginTop: "14px", fontSize: "1rem" }}
          onClick={onLogin}
        >
          Log In
        </button>
        <p style={{ textAlign: "center", fontSize: "0.78rem", color: colors.muted, marginTop: "16px" }}>
          Demo: <strong>staff/1234</strong> or <strong>patient/1234</strong>
        </p>
      </div>
    </div>
  );
}
