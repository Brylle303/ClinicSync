import { useState } from "react";
import { DOCTORS, TODAY, colors } from "./constants";
import { s } from "./styles";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import BookAppointment from "./pages/BookAppointment";
import PatientRecords from "./pages/PatientRecords";
import DoctorSchedules from "./pages/DoctorSchedules";
import ReschedulePage from "./pages/ReschedulePage";

export default function ClinicSync() {
  const [role, setRole] = useState(null); // null | "patient" | "staff"
  const [view, setView] = useState("login"); // login | dashboard | book | records | schedule | reschedule
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [bookings, setBookings] = useState([]);
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

  // --- Helpers ---

  function handleLogin() {
    if (username === "staff" && password === "1234") {
      setRole("staff"); setView("dashboard"); setLoginError("");
    } else if (username === "patient" && password === "1234") {
      setRole("patient"); setView("dashboard"); setLoginError("");
    } else {
      setLoginError("Invalid credentials.");
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
      [blockDoctor]: [...(prev[blockDoctor] || []), blockDate].filter((v, i, a) => a.indexOf(v) === i),
    }));
  }

  // --- Routing ---

  if (view === "login") {
    return (
      <LoginPage
        username={username}
        password={password}
        loginError={loginError}
        setUsername={setUsername}
        setPassword={setPassword}
        onLogin={handleLogin}
      />
    );
  }

  if (view === "reschedule" && rescheduleTarget) {
    return (
      <ReschedulePage
        rescheduleTarget={rescheduleTarget}
        rescheduleSlot={rescheduleSlot}
        setRescheduleSlot={setRescheduleSlot}
        isSlotBooked={isSlotBooked}
        onConfirm={confirmReschedule}
        onCancel={() => setView("dashboard")}
      />
    );
  }

  const navItems = role === "staff"
    ? [["dashboard", "Dashboard"], ["book", "Book Appointment"], ["records", "Patient Records"], ["schedule", "Doctor Schedules"]]
    : [["dashboard", "Dashboard"], ["book", "Book Appointment"]];

  return (
    <div style={s.app}>
      <header style={s.header}>
        <span style={s.logo}>
          🏥 ClinicSync{" "}
          <span style={s.roleTag}>{role === "staff" ? "Staff" : "Patient"}</span>
        </span>
        <button style={s.logoutBtn} onClick={handleLogout}>Log Out</button>
      </header>

      <nav style={s.nav}>
        {navItems.map(([key, label]) => (
          <button key={key} style={s.navBtn(view === key)} onClick={() => setView(key)}>{label}</button>
        ))}
      </nav>

      <div style={s.main}>
        {view === "dashboard" && (
          <Dashboard
            bookings={bookings}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
            getDoctorName={getDoctorName}
          />
        )}

        {view === "book" && (
          <BookAppointment
            selectedDoctor={selectedDoctor} setSelectedDoctor={setSelectedDoctor}
            selectedDate={selectedDate} setSelectedDate={setSelectedDate}
            selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot}
            patientName={patientName} setPatientName={setPatientName}
            bookMsg={bookMsg} setBookMsg={setBookMsg}
            isSlotBooked={isSlotBooked}
            isDateBlocked={isDateBlocked}
            onBook={handleBook}
          />
        )}

        {view === "records" && role === "staff" && (
          <PatientRecords
            patients={patients}
            setPatients={setPatients}
            editPatient={editPatient}
            setEditPatient={setEditPatient}
          />
        )}

        {view === "schedule" && role === "staff" && (
          <DoctorSchedules
            blockedDates={blockedDates}
            blockDate={blockDate} setBlockDate={setBlockDate}
            blockDoctor={blockDoctor} setBlockDoctor={setBlockDoctor}
            onBlockDate={handleBlockDate}
          />
        )}
      </div>
    </div>
  );
}
