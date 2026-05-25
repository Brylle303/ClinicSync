import { TODAY, colors } from "../constants";
import { s } from "../styles";

export default function BookAppointment({
  doctors,
  selectedDoctor, setSelectedDoctor,
  selectedDate, setSelectedDate,
  selectedSlot, setSelectedSlot,
  patientName, setPatientName,
  bookMsg, setBookMsg,
  isSlotBooked, isDateBlocked,
  onBook,
}) {
  return (
    <div style={s.card}>
      <h2 style={s.h2}>Book an Appointment</h2>

      <div style={{ marginBottom: "18px" }}>
        <label style={s.label}>Select Doctor</label>
        {doctors.map(doc => (
          <div
            key={doc.id}
            style={s.doctorCard(selectedDoctor === doc.id)}
            onClick={() => { setSelectedDoctor(doc.id); setSelectedSlot(null); setBookMsg(""); }}
          >
            <strong>{doc.name}</strong>
            <span style={{ fontSize: "0.83rem", color: colors.muted, marginLeft: "10px" }}>{doc.specialty}</span>
            {isDateBlocked(doc.id, selectedDate) && (
              <span style={{ fontSize: "0.78rem", color: colors.danger, marginLeft: "10px" }}>⚠ Blocked on selected date</span>
            )}
          </div>
        ))}
      </div>

      <div style={{ ...s.grid2, marginBottom: "18px" }}>
        <div>
          <label style={s.label}>Patient Name</label>
          <input
            style={s.input}
            value={patientName}
            onChange={e => setPatientName(e.target.value)}
            placeholder="Full name"
          />
        </div>
        <div>
          <label style={s.label}>Date</label>
          <input
            style={s.input}
            type="date"
            value={selectedDate}
            min={TODAY}
            onChange={e => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
          />
        </div>
      </div>

      {selectedDoctor && (
        <div style={{ marginBottom: "18px" }}>
          <label style={s.label}>Available Time Slots</label>
          <div style={s.slotGrid}>
            {doctors.find(d => d.id === selectedDoctor)?.slots.length === 0 && (
              <span style={{ fontSize: "0.85rem", color: colors.muted }}>No slots available for this doctor.</span>
            )}
            {doctors.find(d => d.id === selectedDoctor)?.slots.map(slot => {
              const booked = isSlotBooked(selectedDoctor, selectedDate, slot);
              return (
                <div
                  key={slot}
                  style={s.slot(!booked, selectedSlot === slot)}
                  onClick={() => !booked && setSelectedSlot(slot)}
                >
                  {slot} {booked ? "✗" : ""}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button style={s.btn("success")} onClick={onBook}>Confirm Booking</button>
      {bookMsg && <div style={s.msg(bookMsg.startsWith("✓") ? "success" : "error")}>{bookMsg}</div>}
    </div>
  );
}
