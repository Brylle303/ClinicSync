import { DOCTORS, TODAY, colors } from "../constants";
import { s } from "../styles";

export default function DoctorSchedules({
  blockedDates, blockDate, setBlockDate,
  blockDoctor, setBlockDoctor, onBlockDate,
}) {
  return (
    <>
      <div style={s.card}>
        <h2 style={s.h2}>Doctor Schedules</h2>
        {DOCTORS.map(doc => (
          <div
            key={doc.id}
            style={{ marginBottom: "18px", paddingBottom: "18px", borderBottom: `1px solid ${colors.border}` }}
          >
            <h3 style={s.h3}>
              {doc.name}{" "}
              <span style={{ fontWeight: "normal", color: colors.muted, fontSize: "0.85rem" }}>— {doc.specialty}</span>
            </h3>
            <div style={{ fontSize: "0.85rem", color: colors.muted, marginBottom: "6px" }}>Working hours:</div>
            <div style={s.slotGrid}>
              {doc.slots.map(slot => (
                <span
                  key={slot}
                  style={{ padding: "5px 12px", background: colors.primaryLight, color: colors.primary, borderRadius: "20px", fontSize: "0.83rem" }}
                >
                  {slot}
                </span>
              ))}
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
            <input
              style={s.input}
              type="date"
              value={blockDate}
              onChange={e => setBlockDate(e.target.value)}
            />
          </div>
        </div>
        <button style={{ ...s.btn("danger"), marginTop: "14px" }} onClick={onBlockDate}>Block Date</button>
      </div>
    </>
  );
}
