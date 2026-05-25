import { DOCTORS, colors } from "./constants";
import { s } from "./styles";

export default function ReschedulePage({
  rescheduleTarget, rescheduleSlot, setRescheduleSlot,
  isSlotBooked, onConfirm, onCancel,
}) {
  const doc = DOCTORS.find(d => d.id === rescheduleTarget.doctorId);

  return (
    <div style={s.app}>
      <header style={s.header}>
        <span style={s.logo}>🏥 ClinicSync</span>
      </header>
      <div style={s.main}>
        <div style={s.card}>
          <h2 style={s.h2}>Reschedule Appointment</h2>
          <p style={{ color: colors.muted }}>
            Patient: <strong>{rescheduleTarget.patient}</strong> — {doc?.name} on {rescheduleTarget.date}
          </p>
          <h3 style={s.h3}>Pick a new time slot:</h3>
          <div style={s.slotGrid}>
            {doc?.slots.map(slot => {
              const booked = isSlotBooked(rescheduleTarget.doctorId, rescheduleTarget.date, slot) && slot !== rescheduleTarget.slot;
              return (
                <div
                  key={slot}
                  style={s.slot(!booked, rescheduleSlot === slot)}
                  onClick={() => !booked && setRescheduleSlot(slot)}
                >
                  {slot}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: "18px", display: "flex", gap: "10px" }}>
            <button style={s.btn("primary")} onClick={onConfirm} disabled={!rescheduleSlot}>
              Confirm Reschedule
            </button>
            <button style={s.btn("ghost")} onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
