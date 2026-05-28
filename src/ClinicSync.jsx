import { useState, useEffect } from "react";
import { DOCTORS, TODAY } from "./constants";
import { s } from "./styles";
import { supabase } from "./supabase";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import BookAppointment from "./pages/BookAppointment";
import PatientRecords from "./pages/PatientRecords";
import DoctorSchedules from "./pages/DoctorSchedules";
import ReschedulePage from "./pages/ReschedulePage";

export default function ClinicSync() {
  // Auth
  const [role, setRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  // Doctors
  const [doctors, setDoctors] = useState([]);

  // Navigation
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);

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
  const [patients, setPatients] = useState([]);
  const [editPatient, setEditPatient] = useState(null);

  // Schedules
  const [blockDate, setBlockDate] = useState(TODAY);
  const [blockDoctor, setBlockDoctor] = useState(null);

  // -------------------------------------------------------
  // Load data on login
  // -------------------------------------------------------
  useEffect(() => {
    if (!role) return;
    fetchDoctors();
    fetchBookings();
    if (role === "staff") fetchPatients();
  }, [role]);

  async function fetchDoctors() {
    const { data, error } = await supabase.from("doctors").select("*");
    if (error) { console.error("fetchDoctors:", error); return; }
    setDoctors(data);
    if (data.length > 0) setBlockDoctor(data[0].id);
  }

  async function fetchBookings() {
    const { data, error } = await supabase.from("bookings").select("*").order("date", { ascending: true });
    if (error) { console.error("fetchBookings:", error); return; }
    setBookings(data);
  }

  async function fetchPatients() {
    const { data, error } = await supabase.from("patients").select("*");
    if (error) { console.error("fetchPatients:", error); return; }
    setPatients(data);
  }

  // -------------------------------------------------------
  // Auth
  // -------------------------------------------------------
  async function handleLogin(username, password) {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();
    setLoading(false);

    if (error || !data) {
      setLoginError("Invalid credentials."); return;
    }
    setCurrentUser(data);
    setRole(data.role);
    setView("dashboard");
    setLoginError("");
  }

  async function handleRegister(username, password, confirmPassword, role) {
    if (!username || !password || !confirmPassword) {
      setRegisterError("Please fill in all fields."); return;
    }
    if (password !== confirmPassword) {
      setRegisterError("Passwords do not match."); return;
    }

    // Check if username already exists
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .single();

    if (existing) {
      setRegisterError("Username already taken."); return;
    }

    const { data, error } = await supabase
      .from("users")
      .insert({ username, password, role })
      .select()
      .single();

    if (error) {
      setRegisterError("Registration failed. Try again."); return;
    }

    setCurrentUser(data);
    setRole(data.role);
    setView("dashboard");
    setRegisterError("");
  }

  function handleLogout() {
    setRole(null);
    setCurrentUser(null);
    setView("login");
    setDoctors([]);
    setBookings([]);
    setPatients([]);
    setLoginError("");
    setRegisterError("");
  }

  // -------------------------------------------------------
  // Booking
  // -------------------------------------------------------
  function isSlotBooked(doctorId, date, slot) {
    return bookings.some(b => b.doctor_id === doctorId && b.date === date && b.slot === slot);
  }

  function isDateBlocked(doctorId, date) {
    const doc = doctors.find(d => d.id === doctorId);
    return doc?.blocked_dates?.includes(date) ?? false;
  }

  async function handleBook() {
    if (!selectedDoctor || !selectedSlot || !patientName) {
      setBookMsg("Please fill in all fields."); return;
    }
    if (isSlotBooked(selectedDoctor, selectedDate, selectedSlot)) {
      setBookMsg("That slot is already booked."); return;
    }
    if (isDateBlocked(selectedDoctor, selectedDate)) {
      setBookMsg("Doctor is unavailable on that date."); return;
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert({ doctor_id: selectedDoctor, date: selectedDate, slot: selectedSlot, patient: patientName })
      .select()
      .single();

    if (error) { setBookMsg("Booking failed. Try again."); return; }

    setBookings([...bookings, data]);
    setBookMsg(`✓ Appointment booked for ${patientName}!`);
    setSelectedSlot(null);
    setPatientName("");
  }

  async function handleCancel(id) {
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) { console.error("handleCancel:", error); return; }
    setBookings(bookings.filter(b => b.id !== id));
  }

  function handleReschedule(booking) {
    setRescheduleTarget(booking);
    setRescheduleSlot(null);
    setView("reschedule");
  }

  async function confirmReschedule() {
    if (!rescheduleSlot) return;
    const { error } = await supabase
      .from("bookings")
      .update({ slot: rescheduleSlot })
      .eq("id", rescheduleTarget.id);

    if (error) { console.error("confirmReschedule:", error); return; }

    setBookings(bookings.map(b => b.id === rescheduleTarget.id ? { ...b, slot: rescheduleSlot } : b));
    setRescheduleTarget(null);
    setView("dashboard");
  }

  function getDoctorName(id) {
    return doctors.find(d => d.id === id)?.name || "Unknown";
  }

  // -------------------------------------------------------
  // Doctor slots
  // -------------------------------------------------------
  async function handleUpdateSlots(doctorId, newSlots) {
    const { error } = await supabase
      .from("doctors")
      .update({ slots: newSlots })
      .eq("id", doctorId);

    if (error) { console.error("handleUpdateSlots:", error); return; }
    setDoctors(doctors.map(d => d.id === doctorId ? { ...d, slots: newSlots } : d));
  }

  async function handleBlockDate() {
    const doc = doctors.find(d => d.id === blockDoctor);
    if (!doc) return;
    const updatedBlocked = [...(doc.blocked_dates || []), blockDate].filter((v, i, a) => a.indexOf(v) === i);

    const { error } = await supabase
      .from("doctors")
      .update({ blocked_dates: updatedBlocked })
      .eq("id", blockDoctor);

    if (error) { console.error("handleBlockDate:", error); return; }
    setDoctors(doctors.map(d => d.id === blockDoctor ? { ...d, blocked_dates: updatedBlocked } : d));
  }

  // -------------------------------------------------------
  // Patient records
  // -------------------------------------------------------
  async function handleSavePatient(updatedPatient) {
    const { error } = await supabase
      .from("patients")
      .update({ name: updatedPatient.name, age: updatedPatient.age, contact: updatedPatient.contact, notes: updatedPatient.notes })
      .eq("id", updatedPatient.id);

    if (error) { console.error("handleSavePatient:", error); return; }
    setPatients(patients.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    setEditPatient(null);
  }

  // -------------------------------------------------------
  // Routing
  // -------------------------------------------------------
  if (view === "login") {
    return (
      <LoginPage
        onLogin={handleLogin}
        onRegister={handleRegister}
        loginError={loginError}
        registerError={registerError}
        loading={loading}
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
        doctors={doctors}
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
            editPatient={editPatient}
            setEditPatient={setEditPatient}
            onSavePatient={handleSavePatient}
          />
        )}

        {view === "schedule" && role === "staff" && (
          <DoctorSchedules
            doctors={doctors}
            onUpdateSlots={handleUpdateSlots}
            blockDate={blockDate} setBlockDate={setBlockDate}
            blockDoctor={blockDoctor} setBlockDoctor={setBlockDoctor}
            onBlockDate={handleBlockDate}
          />
        )}
      </div>
    </div>
  );
}
