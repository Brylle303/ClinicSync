import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { TODAY } from "./constants";
import { s } from "./styles";
import { supabase } from "./supabase";
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
  const [dataLoading, setDataLoading] = useState(false);

  // Booking form
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientContact, setPatientContact] = useState("");
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
        setDataLoading(true);
        fetchDoctors()
        .then(() => fetchBookings(currentUser))
        .finally(() => setDataLoading(false));

        
        if (currentUser.role === "staff") {
        fetchPatients();

        const patientChannel = supabase
            .channel("patients-changes")
            .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "patients" },
            () => {
                
                fetchPatients();
            }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(patientChannel);
        };
        }
    }, [currentUser]);

    async function fetchDoctors() {
        const { data } = await supabase.from("doctors").select("*");
        if (data) {
        setDoctors(data);
        setBlockDoctor(data[0]?.id);
        }
        return data;
}

  async function fetchBookings(user) {
    let query = supabase.from("bookings").select("*").order("date", { ascending: true });
    if (user.role === "patient") query = query.eq("username", user.username);
    const { data } = await query;
    if (data) setBookings(data);
  }

  async function fetchPatients() {
    const { data } = await supabase.from("patients").select("*").order("name", { ascending: true });
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
    setCurrentUser(data);
    setLoginError("");
    navigate("/dashboard");
  }

  async function handleRegister(username, password, confirmPassword, role) {
    if (!username || !password || !confirmPassword) {
      setRegisterError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setRegisterError("Passwords do not match.");
      return;
    }

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .single();

    if (existing) {
      setRegisterError("Username already taken.");
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .insert({ username, password, role })
      .select()
      .single();

    if (error) {
      setRegisterError("Registration failed.");
      return;
    }

    setRole(data.role);
    setCurrentUser(data);
    setRegisterError("");
    navigate("/dashboard");
  }

  function handleLogout() {
    setRole(null);
    setCurrentUser(null);
    setDoctors([]);
    setBookings([]);
    setPatients([]);
    navigate("/");
  }

  // -------------------------------------------------------
  // Booking
  // -------------------------------------------------------
  function isSlotBooked(doctorId, date, slot) {
    return bookings.some(
      b => b.doctor_id === doctorId && b.date === date && b.slot === slot
    );
  }

  function isDateBlocked(doctorId, date) {
    return doctors.find(d => d.id === doctorId)?.blocked_dates?.includes(date) ?? false;
  }

  async function handleBook() {
    if (
      !selectedDoctor ||
      !selectedSlot ||
      !patientName ||
      !patientAge ||
      !patientContact
    ) {
      setBookMsg("Please fill in all fields.");
      return;
    }

    if (isSlotBooked(selectedDoctor, selectedDate, selectedSlot)) {
      setBookMsg("That slot is already booked.");
      return;
    }

    if (isDateBlocked(selectedDoctor, selectedDate)) {
      setBookMsg("Doctor is unavailable on that date.");
      return;
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        doctor_id: selectedDoctor,
        date: selectedDate,
        slot: selectedSlot,
        patient: patientName,
        username: currentUser.username,
      })
      .select()
      .single();

    if (error) {
      setBookMsg("Booking failed.");
      return;
    }

    setBookings([...bookings, data]);

    await ensurePatientRecord(
      patientName,
      currentUser.username,
      patientAge,
      patientContact
    );

    setBookMsg(`✓ Appointment booked for ${patientName}!`);

    setSelectedSlot(null);
    setPatientName("");
    setPatientAge("");
    setPatientContact("");
  }

async function ensurePatientRecord(name, username, age, contact) {
    
    const { data: exactMatch, error: exactErr } = await supabase
      .from("patients")
      .select("id")
      .eq("username", username)
      .ilike("name", name)
      .maybeSingle();

    if (exactErr) console.error("Error checking exact match:", exactErr);

    if (exactMatch) {
     
      await supabase
        .from("patients")
        .update({ age: age || null, contact: contact || null })
        .eq("id", exactMatch.id);
      return; 
    }

    
    const { data: byName, error: nameErr } = await supabase
      .from("patients")
      .select("id, username")
      .ilike("name", name)
      .maybeSingle();

    if (nameErr) console.error("Error checking by name:", nameErr);

    if (byName && !byName.username) {
      
      await supabase
        .from("patients")
        .update({
          username: username,
          age: age || null,
          contact: contact || null,
        })
        .eq("id", byName.id);
    } else {
      
      const { error: insertErr } = await supabase
        .from("patients")
        .insert({
          name: name,
          username: username,
          age: age || null,
          contact: contact || null,
          notes: null,
        });

      if (insertErr) console.error("Error inserting new patient:", insertErr);
    }
  }

  async function handleCancel(id) {
    const confirmed = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmed) return;

    await supabase.from("bookings").delete().eq("id", id);
    setBookings(bookings.filter(b => b.id !== id));
  }

  function handleReschedule(booking) {
    setRescheduleTarget(booking);
    setRescheduleSlot(null);
    navigate("/reschedule");
  }

  async function confirmReschedule() {
    if (!rescheduleSlot) return;

    await supabase
      .from("bookings")
      .update({ slot: rescheduleSlot })
      .eq("id", rescheduleTarget.id);

    setBookings(
      bookings.map(b =>
        b.id === rescheduleTarget.id
          ? { ...b, slot: rescheduleSlot }
          : b
      )
    );

    setRescheduleTarget(null);
    navigate("/dashboard");
  }

  function getDoctorName(id) {
    return doctors.find(d => d.id == id)?.name || "Unknown";
  }

  // -------------------------------------------------------
  // Doctor schedules
  // -------------------------------------------------------
  async function handleUpdateSlots(doctorId, newSlots) {
    await supabase.from("doctors").update({ slots: newSlots }).eq("id", doctorId);

    setDoctors(
      doctors.map(d =>
        d.id === doctorId
          ? { ...d, slots: newSlots }
          : d
      )
    );
  }

  async function handleBlockDate() {
    const doc = doctors.find(d => d.id === blockDoctor);
    if (!doc) return;

    const updated = [...(doc.blocked_dates || []), blockDate].filter(
      (v, i, a) => a.indexOf(v) === i
    );

    await supabase
      .from("doctors")
      .update({ blocked_dates: updated })
      .eq("id", blockDoctor);

    setDoctors(
      doctors.map(d =>
        d.id === blockDoctor
          ? { ...d, blocked_dates: updated }
          : d
      )
    );

    setBlockDate(TODAY);
  }

  async function handleUnblockDate(doctorId, dateToUnblock) {
    const doc = doctors.find(d => d.id === doctorId);
    if (!doc) return;

    const updatedBlockedDates = (doc.blocked_dates || []).filter(d => d !== dateToUnblock);

    const { error } = await supabase
      .from("doctors")
      .update({ blocked_dates: updatedBlockedDates })
      .eq("id", doctorId);

    if (error) {
      console.error("Error unblocking date:", error);
    } else {
      setDoctors(prev =>
        prev.map(d => (d.id === doctorId ? { ...d, blocked_dates: updatedBlockedDates } : d))
      );
    }
  }

  // -------------------------------------------------------
  // Patients
  // -------------------------------------------------------
  async function handleSavePatient(p) {
    await supabase
      .from("patients")
      .update({
        name: p.name,
        age: p.age,
        contact: p.contact,
        notes: p.notes,
      })
      .eq("id", p.id);

    setPatients(patients.map(x => (x.id === p.id ? p : x)));
    setEditPatient(null);
  }

  async function handleAddPatient(p) {
    const { data, error } = await supabase
      .from("patients")
      .insert({
        name: p.name,
        age: p.age || null,
        contact: p.contact || null,
        notes: p.notes || null,
        username: null,
      })
      .select()
      .single();

    if (error) {
      console.error("handleAddPatient:", error);
      return;
    }

    setPatients(prev =>
      [...prev, data].sort((a, b) => a.name.localeCompare(b.name))
    );
  }

  // -------------------------------------------------------
  // Layout
  // -------------------------------------------------------
  const navItems =
    role === "staff"
      ? [["dashboard", "/dashboard", "Dashboard"], ["records", "/records", "Patient Records"]]
      : role === "doctor"
      ? [["dashboard", "/dashboard", "Dashboard"], ["schedule", "/schedule", "Doctor Schedules"]]
      : [["dashboard", "/dashboard", "Dashboard"], ["book", "/book", "Book Appointment"]];

  if (!role) {
    return (
      <Routes>
        <Route
          path="*"
          element={
            <LoginPage
              onLogin={handleLogin}
              onRegister={handleRegister}
              loginError={loginError}
              registerError={registerError}
              loading={loading}
            />
          }
        />
      </Routes>
    );
  }

  return (
    <div style={s.app}>
      <header style={s.header}>
        <span style={s.logo}>
          🏥 ClinicSync
          <span style={s.roleTag}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
        </span>

        <button style={s.logoutBtn} onClick={handleLogout}>
          Log Out
        </button>
      </header>

      <nav style={s.nav}>
        {navItems.map(([, path, label]) => (
          <button
            key={path}
            style={s.navBtn(location.pathname === path)}
            onClick={() => navigate(path)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div style={s.main}>
        {dataLoading ? (
          <p
            style={{
              textAlign: "center",
              color: "#6b7a8d",
              padding: "40px 0",
            }}
          >
            Loading...
          </p>
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />

            <Route
              path="/dashboard"
              element={
                <Dashboard
                  role={role}
                  doctors={doctors}
                  bookings={bookings}
                  onReschedule={handleReschedule}
                  onCancel={handleCancel}
                  getDoctorName={getDoctorName}
                />
              }
            />

            {role === "patient" && (
              <>
                <Route
                  path="/book"
                  element={
                    <BookAppointment
                      doctors={doctors}
                      currentUser={currentUser}
                      selectedDoctor={selectedDoctor}
                      setSelectedDoctor={setSelectedDoctor}
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                      selectedSlot={selectedSlot}
                      setSelectedSlot={setSelectedSlot}
                      patientName={patientName}
                      setPatientName={setPatientName}
                      patientAge={patientAge}
                      setPatientAge={setPatientAge}
                      patientContact={patientContact}
                      setPatientContact={setPatientContact}
                      bookMsg={bookMsg}
                      setBookMsg={setBookMsg}
                      isSlotBooked={isSlotBooked}
                      isDateBlocked={isDateBlocked}
                      onBook={handleBook}
                    />
                  }
                />

                <Route
                  path="/reschedule"
                  element={
                    rescheduleTarget ? (
                      <ReschedulePage
                        rescheduleTarget={rescheduleTarget}
                        rescheduleSlot={rescheduleSlot}
                        setRescheduleSlot={setRescheduleSlot}
                        isSlotBooked={isSlotBooked}
                        onConfirm={confirmReschedule}
                        onCancel={() => navigate("/dashboard")}
                        doctors={doctors}
                      />
                    ) : (
                      <Navigate to="/dashboard" />
                    )
                  }
                />
              </>
            )}

            {role === "staff" && (
              <Route
                path="/records"
                element={
                  <PatientRecords
                    patients={patients}
                    editPatient={editPatient}
                    setEditPatient={setEditPatient}
                    onSavePatient={handleSavePatient}
                    onFetch={fetchPatients}
                    onAddPatient={handleAddPatient}
                  />
                }
              />
            )}

            {role === "doctor" && (
              <Route
                path="/schedule"
                element={
                  <DoctorSchedules
                    doctors={doctors}
                    onUpdateSlots={handleUpdateSlots}
                    blockDate={blockDate}
                    setBlockDate={setBlockDate}
                    blockDoctor={blockDoctor}
                    setBlockDoctor={setBlockDoctor}
                    onBlockDate={handleBlockDate}
                    onUnblockDate={handleUnblockDate}
                  />
                }
              />
            )}

            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        )}
      </div>
    </div>
  );
}