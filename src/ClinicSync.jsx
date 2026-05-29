import "./ClinicSync.css";
import logo from "./assets/logo.png";
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { TODAY } from "./constants";
import { s } from "./styles";
import { supabase } from "./supabase";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import BookAppointment from "./pages/BookAppointment";
import PatientRecords from "./pages/PatientRecords";
import DoctorSchedules from "./pages/DoctorSchedules";
import ReschedulePage from "./pages/ReschedulePage";

export default function ClinicSync() {
  const navigate = useNavigate();
  const location = useLocation();

  // Auth
  const [role, setRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [loading, setLoading] = useState(false);

  // Data
  const [doctors, setDoctors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [patients, setPatients] = useState([]);

  // Booking form
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [bookMsg, setBookMsg] = useState("");

  // Reschedule
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduleSlot, setRescheduleSlot] = useState(null);

  // Schedule blocking
  const [blockDate, setBlockDate] = useState(TODAY);
  const [blockDoctor, setBlockDoctor] = useState(null);

  // Patient editing
  const [editPatient, setEditPatient] = useState(null);

  // -------------------------------------------------------
  // Fetch on login
  // -------------------------------------------------------
  useEffect(() => {
    if (!currentUser) return;
    fetchDoctors().then(doctorData => {
      fetchBookings(currentUser);
    });
    if (currentUser.role === "staff") fetchPatients();
  }, [currentUser]);

  async function fetchDoctors() {
    const { data } = await supabase.from("doctors").select("*");
    if (data) { setDoctors(data); setBlockDoctor(data[0]?.id); }
    return data;
  }

  async function fetchBookings(user) {
    let query = supabase.from("bookings").select("*").order("date", { ascending: true });
    if (user.role === "patient") query = query.eq("username", user.username);
    const { data } = await query;
    if (data) setBookings(data);
  }

  async function fetchPatients() {
    const { data } = await supabase.from("patients").select("*");
    if (data) setPatients(data);
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
      setLoginError("Invalid credentials."); 
      return; 
    }
    
    setRole(data.role);
    setLoginError("");
    navigate("/dashboard");
    setCurrentUser(data);
  }

      // async function handleLogin(username, password) {
      //   setLoading(true);
      //   const { data, error } = await supabase.from("users").select("*").eq("username", username).eq("password", password).single();
      //   setLoading(false);
      //   if (error || !data) { setLoginError("Invalid credentials."); return; }
      //   setRole(data.role);
      //   setLoginError("");
      //   navigate("/dashboard");
      //   setCurrentUser(data);
      // }

  async function handleRegister(username, password, confirmPassword, role) {
    if (!username || !password || !confirmPassword) { setRegisterError("Please fill in all fields."); return; }
    if (password !== confirmPassword) { setRegisterError("Passwords do not match."); return; }
    const { data: existing } = await supabase.from("users").select("id").eq("username", username).single();
    if (existing) { setRegisterError("Username already taken."); return; }
    const { data, error } = await supabase.from("users").insert({ username, password, role }).select().single();
    if (error) { setRegisterError("Registration failed."); return; }
    setRole(data.role);
    setRegisterError("");
    navigate("/dashboard");
    setCurrentUser(data);
  }

  function handleLogout() {
    setRole(null);
    setDoctors([]); setBookings([]); setPatients([]);
    navigate("/");
    setCurrentUser(null);
  }

  // -------------------------------------------------------
  // Booking
  // -------------------------------------------------------
  function isSlotBooked(doctorId, date, slot) {
    return bookings.some(b => b.doctor_id === doctorId && b.date === date && b.slot === slot);
  }
  function isDateBlocked(doctorId, date) {
    return doctors.find(d => d.id === doctorId)?.blocked_dates?.includes(date) ?? false;
  }

  async function handleBook() {
    if (!selectedDoctor || !selectedSlot || !patientName) { setBookMsg("Please fill in all fields."); return; }
    if (isSlotBooked(selectedDoctor, selectedDate, selectedSlot)) { setBookMsg("That slot is already booked."); return; }
    if (isDateBlocked(selectedDoctor, selectedDate)) { setBookMsg("Doctor is unavailable on that date."); return; }
    const { data, error } = await supabase
      .from("bookings")
      .insert({ doctor_id: selectedDoctor, date: selectedDate, slot: selectedSlot, patient: patientName, username: currentUser.username })
      .select().single();

    if (error) { setBookMsg("Booking failed."); return; }
    setBookings([...bookings, data]);
    setBookMsg(`✓ Appointment booked for ${patientName}!`);
    setSelectedSlot(null); setPatientName("");
  }

  async function handleCancel(id) {
    await supabase.from("bookings").delete().eq("id", id);
    setBookings(bookings.filter(b => b.id !== id));
  }

  function handleReschedule(booking) {
    setRescheduleTarget(booking);
    setRescheduleSlot(null);
    navigate("/reschedule");
  }

  // --- RESCHEDULING LOGIC ---
  async function confirmReschedule(newDate, newSlot) {
    if (!rescheduleTarget) return;

    const { error, data } = await supabase
      .from("bookings")
      .update({ date: newDate, slot: newSlot })
      .eq("id", rescheduleTarget.id)
      .select()
      .single();

    if (!error && data) {
      setBookings(bookings.map(b => 
        b.id === rescheduleTarget.id 
          ? { ...b, date: newDate, slot: newSlot } 
          : b
      ));
      
      setRescheduleTarget(null);
      setRescheduleSlot(null);
      navigate("/dashboard");
    } else {
      console.error("Failed to reschedule appointment:", error);
      alert("There was an error rescheduling. Please try again.");
    }
  }

  function getDoctorName(id) {
    console.log("doctors array:", doctors);
    console.log("looking for id:", id, typeof id);
    return doctors.find(d => d.id == id)?.name || "Unknown";
  }

  // -------------------------------------------------------
  // Doctor schedules
  // -------------------------------------------------------
  async function handleUpdateSlots(doctorId, newSlots) {
    await supabase.from("doctors").update({ slots: newSlots }).eq("id", doctorId);
    setDoctors(doctors.map(d => d.id === doctorId ? { ...d, slots: newSlots } : d));
  }

  async function handleBlockDate() {
    const doc = doctors.find(d => d.id === blockDoctor);
    if (!doc) return;
    const updated = [...(doc.blocked_dates || []), blockDate].filter((v, i, a) => a.indexOf(v) === i);
    await supabase.from("doctors").update({ blocked_dates: updated }).eq("id", blockDoctor);
    setDoctors(doctors.map(d => d.id === blockDoctor ? { ...d, blocked_dates: updated } : d));
  }

  // -------------------------------------------------------
  // Patients
  // -------------------------------------------------------
  async function handleSavePatient(p) {
    await supabase.from("patients").update({ name: p.name, age: p.age, contact: p.contact, notes: p.notes }).eq("id", p.id);
    setPatients(patients.map(x => x.id === p.id ? p : x));
    setEditPatient(null);
  }

  // --- STAFF SLOT BLOCKING ---
  async function handleToggleBlockSlot(doctorId, date, slot, isCurrentlyBlocked, bookingId) {
    if (isCurrentlyBlocked) {
      // Unblock: delete the ghost booking from Supabase
      await supabase.from("bookings").delete().eq("id", bookingId);
      setBookings(bookings.filter(b => b.id !== bookingId));
    } else {
      // Block: create a ghost booking in Supabase
      const { data, error } = await supabase
        .from("bookings")
        .insert({ doctor_id: doctorId, date: date, slot: slot, patient: "BLOCKED", username: "system" })
        .select().single();
      if (!error && data) {
        setBookings([...bookings, data]);
      }
    }
  }

  // --- STAFF DAY BLOCKING ---
  async function handleToggleBlockDay(doctorId, date, isCurrentlyBlocked) {
    const doc = doctors.find(d => d.id === doctorId);
    if (!doc) return;
    
    let updatedDates;
    if (isCurrentlyBlocked) {
      // Unblock: Remove the date from the array
      updatedDates = (doc.blocked_dates || []).filter(d => d !== date);
    } else {
      // Block: Add the date to the array
      updatedDates = [...(doc.blocked_dates || []), date].filter((v, i, a) => a.indexOf(v) === i);
    }
    
    await supabase.from("doctors").update({ blocked_dates: updatedDates }).eq("id", doctorId);
    setDoctors(doctors.map(d => d.id === doctorId ? { ...d, blocked_dates: updatedDates } : d));
  }

  // -------------------------------------------------------
  // Layout
  // -------------------------------------------------------
  let navItems = [];
  if (role === "patient") {
    navItems = [["dashboard", "/dashboard", "Dashboard"], ["book", "/book", "Booking"]];
  } else if (role === "staff") {
    navItems = [["dashboard", "/dashboard", "Dashboard"], ["records", "/records", "Patient Records"]];
  } else if (role === "doctor") {
    // Doctors get the Grid (mapped to /book) and the Shift Manager (mapped to /schedule)
    navItems = [["dashboard", "/dashboard", "Dashboard"], ["book", "/book", "Doctor Schedule"], ["schedule", "/schedule", "Shift Manager"]];
  }

  if (!role) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} onRegister={handleRegister} loginError={loginError} registerError={registerError} loading={loading} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <div className="clinicsync-app">
      <header className="top-navbar">
        <div className="nav-left">
          <img src={logo} alt="ClinicSync Logo" className="nav-logo" />
        </div>

        <nav className="nav-center">
          {navItems.map(([, path, label]) => {
            const isActive = location.pathname === path;
            return (
              <div key={path} className="nav-item-container">
                <button 
                  className={`nav-link ${isActive ? "active" : ""}`} 
                  onClick={() => navigate(path)}
                >
                  {label}
                </button>
                {isActive && <span className="active-dot"></span>}
              </div>
            );
          })}
        </nav>

        <div className="nav-right">
          <button className="logout-btn" onClick={handleLogout}>Log out</button>
        </div>
      </header>

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard doctors={doctors} bookings={bookings} onReschedule={handleReschedule} onCancel={handleCancel} getDoctorName={getDoctorName} currentUser={currentUser} role={role} />} />
          
          {(role === "patient" || role === "doctor") && (
             <Route path="/book" element={<BookAppointment doctors={doctors} selectedDoctor={selectedDoctor} setSelectedDoctor={setSelectedDoctor} selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} patientName={patientName} setPatientName={setPatientName} bookMsg={bookMsg} setBookMsg={setBookMsg} isSlotBooked={isSlotBooked} isDateBlocked={isDateBlocked} onBook={handleBook} currentUser={currentUser} role={role} bookings={bookings} onCancel={handleCancel} onReschedule={handleReschedule} onToggleBlockSlot={handleToggleBlockSlot} onToggleBlockDay={handleToggleBlockDay} />} />
          )}

          {role === "staff" && (
             <Route path="/records" element={<PatientRecords patients={patients} editPatient={editPatient} setEditPatient={setEditPatient} onSavePatient={handleSavePatient} />} />
          )}

          {role === "doctor" && (
             <Route path="/schedule" element={<DoctorSchedules doctors={doctors} onUpdateSlots={handleUpdateSlots} blockDate={blockDate} setBlockDate={setBlockDate} blockDoctor={blockDoctor} setBlockDoctor={setBlockDoctor} onBlockDate={handleBlockDate} />} />
          )}

          <Route path="/reschedule" element={rescheduleTarget ? <ReschedulePage rescheduleTarget={rescheduleTarget} rescheduleSlot={rescheduleSlot} setRescheduleSlot={setRescheduleSlot} isSlotBooked={isSlotBooked} onConfirm={confirmReschedule} onCancel={() => navigate("/dashboard")} doctors={doctors} /> : <Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
}
