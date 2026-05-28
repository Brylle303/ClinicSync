import { colors } from "../constants";
import { s } from "../styles";

export default function Dashboard({ doctors, bookings, onReschedule, onCancel, getDoctorName }) {
  return (
    <>
      <div style={{ ...s.grid2, marginBottom: "18px" }}>
        <div style={{ ...s.card, margin: 0, borderLeft: `4px solid ${colors.primary}` }}>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: colors.primary }}>{bookings.length}</div>
          <div style={{ color: colors.muted, fontSize: "0.9rem" }}>Total Appointments</div>
        </div>
        <div style={{ ...s.card, margin: 0, borderLeft: `4px solid ${colors.accent}` }}>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: colors.accent }}>{doctors.length}</div>
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
                  <td style={s.td}>{getDoctorName(b.doctor_id)}</td>
                  <td style={s.td}>{b.date}</td>
                  <td style={s.td}>{b.slot}</td>
                  <td style={s.td}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        style={{ ...s.btn("accent"), padding: "5px 12px", fontSize: "0.8rem" }}
                        onClick={() => onReschedule(b)}
                      >
                        Reschedule
                      </button>
                      <button
                        style={{ ...s.btn("danger"), padding: "5px 12px", fontSize: "0.8rem" }}
                        onClick={() => onCancel(b.id)}
                      >
                        Cancel
                      </button>
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
        {doctors.map(doc => (
          <div
            key={doc.id}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${colors.border}` }}
          >
            <div>
              <strong>{doc.name}</strong>
              <div style={{ fontSize: "0.83rem", color: colors.muted }}>{doc.specialty}</div>
            </div>
            <span style={{ fontSize: "0.82rem", background: colors.primaryLight, color: colors.primary, padding: "3px 10px", borderRadius: "20px" }}>
              {doc.slots.length} slots today
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
