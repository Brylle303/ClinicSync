import { useState } from "react";
import { colors } from "../constants";
import { s } from "../styles";

export default function LoginPage({ onLogin, onRegister, loginError, registerError }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("patient"); // "patient" | "staff"

  function handleSubmit() {
    if (mode === "login") {
      onLogin(username, password);
    } else {
      onRegister(username, password, confirmPassword, role);
    }
  }

  function switchMode(newMode) {
    setMode(newMode);
    setUsername(""); setPassword(""); setConfirmPassword("");
  }

  const error = mode === "login" ? loginError : registerError;

  return (
    <div style={{ ...s.app, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "40px", maxWidth: "380px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "2rem", marginBottom: "4px" }}>🏥</div>
          <h1 style={{ margin: 0, fontSize: "1.6rem", color: colors.primary }}>ClinicSync</h1>
          <p style={{ margin: "4px 0 0", color: colors.muted, fontSize: "0.88rem" }}>Clinic Booking System</p>
        </div>

        {/* Tab toggle */}
        <div style={{ display: "flex", marginBottom: "24px", border: `1px solid ${colors.border}`, borderRadius: "8px", overflow: "hidden" }}>
          {["login", "register"].map(m => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              style={{
                flex: 1, padding: "10px", border: "none", cursor: "pointer", fontSize: "0.9rem",
                fontFamily: "'Georgia', serif", fontWeight: mode === m ? "600" : "400",
                background: mode === m ? colors.primary : colors.card,
                color: mode === m ? "#fff" : colors.muted,
              }}
            >
              {m === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div style={{ marginBottom: "14px" }}>
          <label style={s.label}>Username</label>
          <input style={s.input} value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" />
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={s.label}>Password</label>
          <input
            style={s.input} type="password" value={password}
            onChange={e => setPassword(e.target.value)} placeholder="Enter password"
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
        </div>

        {mode === "register" && (
          <>
            <div style={{ marginBottom: "14px" }}>
              <label style={s.label}>Confirm Password</label>
              <input
                style={s.input} type="password" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter password"
              />
            </div>
            <div style={{ marginBottom: "18px" }}>
              <label style={s.label}>Role</label>
              <select style={s.input} value={role} onChange={e => setRole(e.target.value)}>
                <option value="patient">Patient</option>
                <option value="staff">Staff</option>
              </select>
            </div>
          </>
        )}

        {error && <div style={s.msg("error")}>{error}</div>}

        <button
          style={{ ...s.btn("primary"), width: "100%", padding: "11px", marginTop: "14px", fontSize: "1rem" }}
          onClick={handleSubmit}
        >
          {mode === "login" ? "Log In" : "Create Account"}
        </button>

        {mode === "login" && (
          <p style={{ textAlign: "center", fontSize: "0.78rem", color: colors.muted, marginTop: "16px" }}>
            Demo: <strong>staff/1234</strong> or <strong>patient/1234</strong>
          </p>
        )}
      </div>
    </div>
  );
}
