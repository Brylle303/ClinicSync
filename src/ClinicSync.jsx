import { useState } from "react";
import { DOCTORS, TODAY } from "./constants";
import { s } from "./styles";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import BookAppointment from "./pages/BookAppointment";
import PatientRecords from "./pages/PatientRecords";
import DoctorSchedules from "./pages/DoctorSchedules";
import ReschedulePage from "./pages/ReschedulePage";

const DEFAULT_USERS = [
  { username: "staff", password: "1234", role: "staff" },
  { username: "patient", password: "1234", role: "patient" },
];

export default function ClinicSync() {
  // Auth
  const [users, setUsers] = useState(DEFAULT_USERS);
  const [role, setRole] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  // Doctors (moved to state so slots can be edited)
  const [doctors, setDoctors] = useState(DOCTORS);

  // Navigation
  const [view, setView] = useState("login");

  // Booking
  const [bookings, setBookings] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [bookMsg, setBookMsg] = useState("");

  // Reschedule
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduleSlot, setRescheduleSlot] = useState(null);

  // Patient records
  const [patients, setPatients] = useState([
    { id: 1, name: "Juan dela Cruz", age: 34, contact: "09171234567", notes: "Hypertension" },
    { id: 2, name: "Maria Garcia", age: 28, contact: "09281234567", notes: "Asthma" },
  ]);
  const [editPatient, setEditPatient] = useState(null);

  // Schedules
  const [blockedDates, setBlockedDates] = useState({});
  const [blockDate, setBlockDate] = useState(TODAY);
  const [blockDoctor, setBlockDoctor] = useState(DOCTORS[0].id);

  // --- Auth handlers ---

  function handleLogin(username, password) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setRole(user.role);
      setView("dashboard");
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Try staff/1234 or patient/1234");
    }
  }

  function handleRegister(username, password, confirmPassword, role) {
    if (!username || !password || !confirmPassword) {
      setRegisterError("Please fill in all fields."); return;
    }
    if (password !== confirmPassword) {
      setRegisterError("Passwords do not match."); return;
    }
    if (users.find(u => u.username === username)) {
      setRegisterError("Username already taken."); return;
    }
    setUsers([...users, { username, password, role }]);
    setRegisterError("");
    // Auto-login after registration
    setRole(role);
    setView("dashboard");
  }

  function handleLogout() {
    setRole(null);
    setView("login");
    setLoginError("");
    setRegisterError("");
  }

  // --- Booking helpers ---

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
    setSelectedSlot(null);
    setPatientName("");
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
    setRescheduleTarget(null);
    setView("dashboard");
  }

  function getDoctorName(id) {
    return doctors.find(d => d.id === id)?.name || "Unknown";
  }

  function handleUpdateSlots(doctorId, newSlots) {
    setDoctors(doctors.map(d => d.id === doctorId ? { ...d, slots: newSlots } : d));
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
        onLogin={handleLogin}
        onRegister={handleRegister}
        loginError={loginError}
        registerError={registerError}
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
            doctors={doctors}
            bookings={bookings}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
            getDoctorName={getDoctorName}
          />
        )}

        {view === "book" && (
          <BookAppointment
            doctors={doctors}
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
            doctors={doctors}
            onUpdateSlots={handleUpdateSlots}
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
