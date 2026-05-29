import { useState } from "react";
import './LoginPage.css';
import logo from '../assets/logo.png'; 

export default function LoginPage({ onLogin, onRegister, loginError, registerError }) {
  const [mode, setMode] = useState("login"); // "login" | "register" | "change"
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("patient"); 
  
  const [newPassword, setNewPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    
    if (mode === "login") {
      onLogin(username, password);
    } else if (mode === "register") {
      onRegister(username, password, confirmPassword, role);
    } else if (mode === "change") {
      alert("Password change UI is ready! We will connect this to Supabase later.");
      setMode("login");
    }
  }

  function switchMode(newMode) {
    setMode(newMode);
    setUsername(""); setPassword(""); setConfirmPassword(""); setNewPassword("");
  }

  const error = mode === "login" ? loginError : (mode === "register" ? registerError : "");

  return (
    <div className="auth-container">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="auth-content">
        <div className="auth-header">
          <img src={logo} alt="ClinicSync Logo" className="auth-logo" />
          <h1>
            {mode === "login" && "Good to see you again"}
            {mode === "register" && "We're glad to have you"}
            {mode === "change" && "Change password"}
          </h1>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          
          {mode === "change" ? (
            <>
              <div className="input-group">
                <label>Current password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>New password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
            </>
          ) : (
            <>
              <div className="input-group">
                <label>Your email or username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Your password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
            </>
          )}

          {mode === "register" && (
            <>
              <div className="input-group">
                <label>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Account Type</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="role-select">
                  <option value="patient">Patient</option>
                  <option value="staff">Staff</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>
            </>
          )}

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="auth-button">
            {mode === "login" && "Sign in"}
            {mode === "register" && "Register"}
            {mode === "change" && "Change password"}
          </button>

          <div className="auth-links">
            {mode === "login" ? (
              <>
                <span onClick={() => switchMode("register")}>Don't have an account?</span>
                <span onClick={() => switchMode("change")}>Forgot password?</span>
              </>
            ) : mode === "register" ? (
               <>
                <span onClick={() => switchMode("login")}>Already have an account?</span>
                <span onClick={() => switchMode("change")}>Forgot password?</span>
              </>
            ) : (
              <>
                <span onClick={() => switchMode("register")}>Don't have an account?</span>
                <span onClick={() => switchMode("login")}>Back to Sign in</span>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}