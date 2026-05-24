import { useState } from "react";

const DOCTORS = [
  { id: 1, name: "Dr. Ana Reyes", specialty: "General Medicine", slots: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"] },
  { id: 2, name: "Dr. Marco Santos", specialty: "Pediatrics", slots: ["8:00 AM", "11:00 AM", "1:00 PM", "4:00 PM"] },
  { id: 3, name: "Dr. Clara Tan", specialty: "Internal Medicine", slots: ["9:30 AM", "10:30 AM", "2:30 PM"] },
];

const TODAY = new Date().toISOString().split("T")[0];

const INITIAL_BOOKINGS = [];

export default function ClinicSync() {
  const [role, setRole] = useState(null); // null | "patient" | "staff"
  const [view, setView] = useState("login"); // login | dashboard | book | records | schedule
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [bookMsg, setBookMsg] = useState("");

  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduleSlot, setRescheduleSlot] = useState(null);

  const [patients, setPatients] = useState([
    { id: 1, name: "Juan dela Cruz", age: 34, contact: "09171234567", notes: "Hypertension" },
    { id: 2, name: "Maria Garcia", age: 28, contact: "09281234567", notes: "Asthma" },
  ]);
  const [editPatient, setEditPatient] = useState(null);

  const [blockedDates, setBlockedDates] = useState({});
  const [blockDate, setBlockDate] = useState(TODAY);
  const [blockDoctor, setBlockDoctor] = useState(DOCTORS[0].id);

  function handleLogin() {
    if (username === "staff" && password === "1234") {
      setRole("staff"); setView("dashboard"); setLoginError("");
    } else if (username === "patient" && password === "1234") {
      setRole("patient"); setView("dashboard"); setLoginError("");
    } else {
      setLoginError("Invalid credentials. Try staff/1234 or patient/1234");
    }
  }

  function handleLogout() {
    setRole(null); setView("login"); setUsername(""); setPassword(""); setLoginError("");
  }

  function isSlotBooked(doctorId, date, slot) {
    return bookings.some(b => b.doctorId === doctorId && b.date === date && b.slot === slot);
  }

  function isDateBlocked(doctorId, date) {
    return blockedDates[doctorId]?.includes(date);
  }

  function handleBook() {
    if (!selectedDoctor || !selectedSlot || !patientName) {
      setBookMsg("Please fill in all fields."); return;
    }
    if (isSlotBooked(selectedDoctor, selectedDate, selectedSlot)) {
      setBookMsg("That slot is already booked."); return;
    }
    if (isDateBlocked(selectedDoctor, selectedDate)) {
      setBookMsg("Doctor is unavailable on that date."); return;
    }
    setBookings([...bookings, { id: Date.now(), doctorId: selectedDoctor, date: selectedDate, slot: selectedSlot, patient: patientName }]);
    setBookMsg(`✓ Appointment booked for ${patientName}!`);
    setSelectedSlot(null); setPatientName("");
  }

  function handleCancel(id) {
    setBookings(bookings.filter(b => b.id !== id));
  }

  function handleReschedule(booking) {
    setRescheduleTarget(booking);
    setRescheduleSlot(null);
    setView("reschedule");
  }

  function confirmReschedule() {
    if (!rescheduleSlot) return;
    setBookings(bookings.map(b => b.id === rescheduleTarget.id ? { ...b, slot: rescheduleSlot } : b));
    setRescheduleTarget(null); setView("dashboard");
  }

  function getDoctorName(id) {
    return DOCTORS.find(d => d.id === id)?.name || "Unknown";
  }

  function handleBlockDate() {
    setBlockedDates(prev => ({
      ...prev,
      [blockDoctor]: [...(prev[blockDoctor] || []), blockDate].filter((v, i, a) => a.indexOf(v) === i)
    }));
  }

  const colors = {
    bg: "#f0f4f8",
    card: "#ffffff",
    primary: "#1a6b8a",
    primaryLight: "#e8f4f8",
    accent: "#e8734a",
    text: "#1a2332",
    muted: "#6b7a8d",
    border: "#d1dce8",
    success: "#2a9d5c",
    danger: "#c0392b",
  };

  const s = {
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
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
    msg: (type) => ({ padding: "10px 14px", borderRadius: "6px", marginTop: "12px", fontSize: "0.9rem", background: type === "success" ? "#d4edda" : "#f8d7da", color: type === "success" ? "#155724" : "#721c24" }),
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", padding: "10px 12px", fontSize: "0.8rem", color: colors.muted, borderBottom: `1px solid ${colors.border}`, fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase" },
    td: { padding: "10px 12px", fontSize: "0.9rem", borderBottom: `1px solid ${colors.border}` },
  };

  // LOGIN
  if (view === "login") return (
    <div style={{ ...s.app, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "40px", width: "360px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "2rem", marginBottom: "4px" }}>🏥</div>
          <h1 style={{ margin: 0, fontSize: "1.6rem", color: colors.primary }}>ClinicSync</h1>
          <p style={{ margin: "4px 0 0", color: colors.muted, fontSize: "0.88rem" }}>Clinic Booking System</p>
        </div>
        <div style={{ marginBottom: "14px" }}>
          <label style={s.label}>Username</label>
          <input style={s.input} value={username} onChange={e => setUsername(e.target.value)} placeholder="staff or patient" />
        </div>
        <div style={{ marginBottom: "18px" }}>
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="1234" onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>
        {loginError && <div style={s.msg("error")}>{loginError}</div>}
        <button style={{ ...s.btn("primary"), width: "100%", padding: "11px", marginTop: "14px", fontSize: "1rem" }} onClick={handleLogin}>Log In</button>
        <p style={{ textAlign: "center", fontSize: "0.78rem", color: colors.muted, marginTop: "16px" }}>Demo: <strong>staff/1234</strong> or <strong>patient/1234</strong></p>
      </div>
    </div>
  );

  // RESCHEDULE VIEW
  if (view === "reschedule" && rescheduleTarget) {
    const doc = DOCTORS.find(d => d.id === rescheduleTarget.doctorId);
    return (
      <div style={s.app}>
        <header style={s.header}><span style={s.logo}>🏥 ClinicSync</span></header>
        <div style={s.main}>
          <div style={s.card}>
            <h2 style={s.h2}>Reschedule Appointment</h2>
            <p style={{ color: colors.muted }}>Patient: <strong>{rescheduleTarget.patient}</strong> — {doc?.name} on {rescheduleTarget.date}</p>
            <h3 style={s.h3}>Pick a new time slot:</h3>
            <div style={s.slotGrid}>
              {doc?.slots.map(slot => {
                const booked = isSlotBooked(rescheduleTarget.doctorId, rescheduleTarget.date, slot) && slot !== rescheduleTarget.slot;
                return (
                  <div key={slot} style={s.slot(!booked, rescheduleSlot === slot)} onClick={() => !booked && setRescheduleSlot(slot)}>{slot}</div>
                );
              })}
            </div>
            <div style={{ marginTop: "18px", display: "flex", gap: "10px" }}>
              <button style={s.btn("primary")} onClick={confirmReschedule} disabled={!rescheduleSlot}>Confirm Reschedule</button>
              <button style={s.btn("ghost")} onClick={() => setView("dashboard")}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const navItems = role === "staff"
    ? [["dashboard", "Dashboard"], ["book", "Book Appointment"], ["records", "Patient Records"], ["schedule", "Doctor Schedules"]]
    : [["dashboard", "Dashboard"], ["book", "Book Appointment"]];

  return (
    <div style={s.app}>
      <header style={s.header}>
        <span style={s.logo}>🏥 ClinicSync <span style={s.roleTag}>{role === "staff" ? "Staff" : "Patient"}</span></span>
        <button style={s.logoutBtn} onClick={handleLogout}>Log Out</button>
      </header>

      <nav style={s.nav}>
        {navItems.map(([key, label]) => (
          <button key={key} style={s.navBtn(view === key)} onClick={() => setView(key)}>{label}</button>
        ))}
      </nav>

      <div style={s.main}>

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <>
            <div style={{ ...s.grid2, marginBottom: "18px" }}>
              <div style={{ ...s.card, margin: 0, borderLeft: `4px solid ${colors.primary}` }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: colors.primary }}>{bookings.length}</div>
                <div style={{ color: colors.muted, fontSize: "0.9rem" }}>Total Appointments</div>
              </div>
              <div style={{ ...s.card, margin: 0, borderLeft: `4px solid ${colors.accent}` }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: colors.accent }}>{DOCTORS.length}</div>
                <div style={{ color: colors.muted, fontSize: "0.9rem" }}>Available Doctors</div>
              </div>
            </div>

            <div style={s.card}>
              <h2 style={s.h2}>Upcoming Appointments</h2>
              {bookings.length === 0 ? (
                <p style={{ color: colors.muted, textAlign: "center", padding: "20px 0" }}>No appointments booked yet.</p>
              ) : (
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>Patient</th>
                      <th style={s.th}>Doctor</th>
                      <th style={s.th}>Date</th>
                      <th style={s.th}>Time</th>
                      <th style={s.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id}>
                        <td style={s.td}>{b.patient}</td>
                        <td style={s.td}>{getDoctorName(b.doctorId)}</td>
                        <td style={s.td}>{b.date}</td>
                        <td style={s.td}>{b.slot}</td>
                        <td style={s.td}>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button style={{ ...s.btn("accent"), padding: "5px 12px", fontSize: "0.8rem" }} onClick={() => handleReschedule(b)}>Reschedule</button>
                            <button style={{ ...s.btn("danger"), padding: "5px 12px", fontSize: "0.8rem" }} onClick={() => handleCancel(b.id)}>Cancel</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div style={s.card}>
              <h2 style={s.h2}>Doctors on Duty</h2>
              {DOCTORS.map(doc => (
                <div key={doc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${colors.border}` }}>
                  <div>
                    <strong>{doc.name}</strong>
                    <div style={{ fontSize: "0.83rem", color: colors.muted }}>{doc.specialty}</div>
                  </div>
                  <span style={{ fontSize: "0.82rem", background: colors.primaryLight, color: colors.primary, padding: "3px 10px", borderRadius: "20px" }}>{doc.slots.length} slots today</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* BOOK APPOINTMENT */}
        {view === "book" && (
          <div style={s.card}>
            <h2 style={s.h2}>Book an Appointment</h2>

            <div style={{ marginBottom: "18px" }}>
              <label style={s.label}>Select Doctor</label>
              {DOCTORS.map(doc => (
                <div key={doc.id} style={s.doctorCard(selectedDoctor === doc.id)} onClick={() => { setSelectedDoctor(doc.id); setSelectedSlot(null); setBookMsg(""); }}>
                  <strong>{doc.name}</strong>
                  <span style={{ fontSize: "0.83rem", color: colors.muted, marginLeft: "10px" }}>{doc.specialty}</span>
                  {isDateBlocked(doc.id, selectedDate) && <span style={{ fontSize: "0.78rem", color: colors.danger, marginLeft: "10px" }}>⚠ Blocked on selected date</span>}
                </div>
              ))}
            </div>

            <div style={{ ...s.grid2, marginBottom: "18px" }}>
              <div>
                <label style={s.label}>Patient Name</label>
                <input style={s.input} value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="Full name" />
              </div>
              <div>
                <label style={s.label}>Date</label>
                <input style={s.input} type="date" value={selectedDate} min={TODAY} onChange={e => { setSelectedDate(e.target.value); setSelectedSlot(null); }} />
              </div>
            </div>

            {selectedDoctor && (
              <div style={{ marginBottom: "18px" }}>
                <label style={s.label}>Available Time Slots</label>
                <div style={s.slotGrid}>
                  {DOCTORS.find(d => d.id === selectedDoctor)?.slots.map(slot => {
                    const booked = isSlotBooked(selectedDoctor, selectedDate, slot);
                    return (
                      <div key={slot} style={s.slot(!booked, selectedSlot === slot)} onClick={() => !booked && setSelectedSlot(slot)}>
                        {slot} {booked ? "✗" : ""}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <button style={s.btn("success")} onClick={handleBook}>Confirm Booking</button>
            {bookMsg && <div style={s.msg(bookMsg.startsWith("✓") ? "success" : "error")}>{bookMsg}</div>}
          </div>
        )}

        {/* PATIENT RECORDS — staff only */}
        {view === "records" && role === "staff" && (
          <div style={s.card}>
            <h2 style={s.h2}>Patient Records</h2>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Name</th>
                  <th style={s.th}>Age</th>
                  <th style={s.th}>Contact</th>
                  <th style={s.th}>Notes</th>
                  <th style={s.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.id}>
                    {editPatient?.id === p.id ? (
                      <>
                        <td style={s.td}><input style={{ ...s.input, padding: "5px 8px" }} value={editPatient.name} onChange={e => setEditPatient({ ...editPatient, name: e.target.value })} /></td>
                        <td style={s.td}><input style={{ ...s.input, padding: "5px 8px", width: "60px" }} value={editPatient.age} onChange={e => setEditPatient({ ...editPatient, age: e.target.value })} /></td>
                        <td style={s.td}><input style={{ ...s.input, padding: "5px 8px" }} value={editPatient.contact} onChange={e => setEditPatient({ ...editPatient, contact: e.target.value })} /></td>
                        <td style={s.td}><input style={{ ...s.input, padding: "5px 8px" }} value={editPatient.notes} onChange={e => setEditPatient({ ...editPatient, notes: e.target.value })} /></td>
                        <td style={s.td}>
                          <button style={{ ...s.btn("success"), padding: "5px 12px", fontSize: "0.8rem" }} onClick={() => { setPatients(patients.map(x => x.id === editPatient.id ? editPatient : x)); setEditPatient(null); }}>Save</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={s.td}>{p.name}</td>
                        <td style={s.td}>{p.age}</td>
                        <td style={s.td}>{p.contact}</td>
                        <td style={s.td}>{p.notes}</td>
                        <td style={s.td}><button style={{ ...s.btn("primary"), padding: "5px 12px", fontSize: "0.8rem" }} onClick={() => setEditPatient({ ...p })}>Edit</button></td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* DOCTOR SCHEDULE MANAGEMENT — staff only */}
        {view === "schedule" && role === "staff" && (
          <>
            <div style={s.card}>
              <h2 style={s.h2}>Doctor Schedules</h2>
              {DOCTORS.map(doc => (
                <div key={doc.id} style={{ marginBottom: "18px", paddingBottom: "18px", borderBottom: `1px solid ${colors.border}` }}>
                  <h3 style={s.h3}>{doc.name} <span style={{ fontWeight: "normal", color: colors.muted, fontSize: "0.85rem" }}>— {doc.specialty}</span></h3>
                  <div style={{ fontSize: "0.85rem", color: colors.muted, marginBottom: "6px" }}>Working hours:</div>
                  <div style={s.slotGrid}>
                    {doc.slots.map(slot => <span key={slot} style={{ padding: "5px 12px", background: colors.primaryLight, color: colors.primary, borderRadius: "20px", fontSize: "0.83rem" }}>{slot}</span>)}
                  </div>
                  {blockedDates[doc.id]?.length > 0 && (
                    <div style={{ marginTop: "8px", fontSize: "0.83rem", color: colors.danger }}>
                      Blocked dates: {blockedDates[doc.id].join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={s.card}>
              <h2 style={s.h2}>Block Unavailable Date</h2>
              <div style={s.grid2}>
                <div>
                  <label style={s.label}>Doctor</label>
                  <select style={s.input} value={blockDoctor} onChange={e => setBlockDoctor(Number(e.target.value))}>
                    {DOCTORS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Date to Block</label>
                  <input style={s.input} type="date" value={blockDate} onChange={e => setBlockDate(e.target.value)} />
                </div>
              </div>
              <button style={{ ...s.btn("danger"), marginTop: "14px" }} onClick={handleBlockDate}>Block Date</button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
