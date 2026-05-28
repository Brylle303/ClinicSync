import { useState } from "react";
import { colors } from "../constants";
import { s } from "../styles";

export default function DoctorSchedules({
  doctors, onUpdateSlots,
  blockDate, setBlockDate,
  blockDoctor, setBlockDoctor, onBlockDate,
}) {
  const [editingId, setEditingId] = useState(null);
  const [newSlot, setNewSlot] = useState("");
  const [slotError, setSlotError] = useState("");

  function startEditing(docId) {
    setEditingId(docId);
    setNewSlot("");
    setSlotError("");
  }

  function stopEditing() {
    setEditingId(null);
    setNewSlot("");
    setSlotError("");
  }

  function handleAddSlot(doc) {
    const trimmed = newSlot.trim();
    if (!trimmed) { setSlotError("Please enter a time."); return; }
    if (doc.slots.includes(trimmed)) { setSlotError("That slot already exists."); return; }
    onUpdateSlots(doc.id, [...doc.slots, trimmed]);
    setNewSlot("");
    setSlotError("");
  }

  function handleRemoveSlot(doc, slot) {
    onUpdateSlots(doc.id, doc.slots.filter(s => s !== slot));
  }

  return (
    <>
      {/* Doctor Schedules */}
      <div style={s.card}>
        <h2 style={s.h2}>Doctor Schedules</h2>
        {doctors.map(doc => (
          <div
            key={doc.id}
            style={{ marginBottom: "18px", paddingBottom: "18px", borderBottom: `1px solid ${colors.border}` }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h3 style={{ ...s.h3, margin: 0 }}>
                {doc.name}{" "}
                <span style={{ fontWeight: "normal", color: colors.muted, fontSize: "0.85rem" }}>— {doc.specialty}</span>
              </h3>
              {editingId === doc.id ? (
                <button style={{ ...s.btn("ghost"), padding: "4px 12px", fontSize: "0.8rem", border: `1px solid ${colors.border}` }} onClick={stopEditing}>
                  Done
                </button>
              ) : (
                <button style={{ ...s.btn("primary"), padding: "4px 12px", fontSize: "0.8rem" }} onClick={() => startEditing(doc.id)}>
                  Edit Hours
                </button>
              )}
            </div>

            <div style={{ fontSize: "0.85rem", color: colors.muted, marginBottom: "6px" }}>Working hours:</div>
            <div style={s.slotGrid}>
              {doc.slots.length === 0 && (
                <span style={{ fontSize: "0.83rem", color: colors.muted }}>No slots set.</span>
              )}
              {doc.slots.map(slot => (
                <span
                  key={slot}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    padding: "5px 12px", background: colors.primaryLight,
                    color: colors.primary, borderRadius: "20px", fontSize: "0.83rem"
                  }}
                >
                  {slot}
                  {editingId === doc.id && (
                    <span
                      onClick={() => handleRemoveSlot(doc, slot)}
                      style={{ cursor: "pointer", color: colors.danger, fontWeight: "bold", lineHeight: 1 }}
                      title="Remove slot"
                    >
                      ×
                    </span>
                  )}
                </span>
              ))}
            </div>

            {/* Add slot input */}
            {editingId === doc.id && (
              <div style={{ marginTop: "12px", display: "flex", gap: "8px", alignItems: "flex-start", flexWrap: "wrap" }}>
                <div>
                  <input
                    style={{ ...s.input, width: "140px", padding: "7px 10px" }}
                    type="time"
                    value={newSlot}
                    onChange={e => {
                      // Convert 24h time input to 12h display format
                      const [h, m] = e.target.value.split(":");
                      if (!h || !m) { setNewSlot(e.target.value); return; }
                      const hour = parseInt(h);
                      const suffix = hour >= 12 ? "PM" : "AM";
                      const display = `${hour % 12 || 12}:${m} ${suffix}`;
                      setNewSlot(display);
                    }}
                  />
                  {slotError && <div style={{ fontSize: "0.78rem", color: colors.danger, marginTop: "4px" }}>{slotError}</div>}
                </div>
                <button
                  style={{ ...s.btn("success"), padding: "7px 16px", fontSize: "0.85rem" }}
                  onClick={() => handleAddSlot(doc)}
                >
                  + Add Slot
                </button>
              </div>
            )}

            {doc.blocked_dates?.length > 0 && (
              <div style={{ marginTop: "8px", fontSize: "0.83rem", color: colors.danger }}>
                Blocked dates: {doc.blocked_dates.join(", ")}
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Block Unavailable Date */}
      <div style={s.card}>
        <h2 style={s.h2}>Block Unavailable Date</h2>
        <div style={s.grid2}>
          <div>
            <label style={s.label}>Doctor</label>
            <select style={s.input} value={blockDoctor} onChange={e => setBlockDoctor(Number(e.target.value))}>
              {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>Date to Block</label>
            <input style={s.input} type="date" value={blockDate} onChange={e => setBlockDate(e.target.value)} />
          </div>
        </div>
        <button style={{ ...s.btn("danger"), marginTop: "14px" }} onClick={onBlockDate}>Block Date</button>
      </div>
    </>
  );
}
