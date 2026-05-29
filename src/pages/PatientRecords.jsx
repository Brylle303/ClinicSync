import { useState, useEffect } from "react";
import { colors } from "../constants";
import { s } from "../styles";

export default function PatientRecords({ patients, editPatient, setEditPatient, onSavePatient, onFetch, onAddPatient }) {
  useEffect(() => { onFetch(); }, []);

  const [showForm, setShowForm] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: "", age: "", contact: "", notes: "" });
  const [addMsg, setAddMsg] = useState("");

  function handleAdd() {
    if (!newPatient.name) { setAddMsg("Name is required."); return; }
    onAddPatient(newPatient);
    setNewPatient({ name: "", age: "", contact: "", notes: "" });
    setShowForm(false);
    setAddMsg("");
  }

  return (
    <div style={s.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", borderBottom: `1px solid ${colors.border}`, paddingBottom: "10px" }}>
        <h2 style={{ ...s.h2, margin: 0, border: "none", padding: 0 }}>Patient Records</h2>
        <button style={{ ...s.btn("success"), padding: "6px 14px", fontSize: "0.85rem" }} onClick={() => { setShowForm(!showForm); setAddMsg(""); }}>
          {showForm ? "Cancel" : "+ Add Patient"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: "8px", padding: "16px", marginBottom: "18px" }}>
          <h3 style={{ ...s.h3, marginBottom: "12px" }}>New Patient</h3>
          <div style={{ ...s.grid2, marginBottom: "10px" }}>
            <div>
              <label style={s.label}>Name *</label>
              <input style={s.input} value={newPatient.name} onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} placeholder="Full name" />
            </div>
            <div>
              <label style={s.label}>Age</label>
              <input style={s.input} type="number" value={newPatient.age} onChange={e => setNewPatient({ ...newPatient, age: e.target.value })} placeholder="Age" />
            </div>
            <div>
              <label style={s.label}>Contact</label>
              <input style={s.input} value={newPatient.contact} onChange={e => setNewPatient({ ...newPatient, contact: e.target.value })} placeholder="Phone or email" />
            </div>
            <div>
              <label style={s.label}>Notes</label>
              <input style={s.input} value={newPatient.notes} onChange={e => setNewPatient({ ...newPatient, notes: e.target.value })} placeholder="e.g. Hypertension" />
            </div>
          </div>
          {addMsg && <div style={s.msg("error")}>{addMsg}</div>}
          <button style={{ ...s.btn("primary"), marginTop: "10px" }} onClick={handleAdd}>Save Patient</button>
        </div>
      )}

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Name</th>
            <th style={s.th}>Age</th>
            <th style={s.th}>Contact</th>
            <th style={s.th}>Notes</th>
            <th style={s.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id}>
              {editPatient?.id === p.id ? (
                <>
                  <td style={s.td}><input style={{ ...s.input, padding: "5px 8px" }} value={editPatient.name} onChange={e => setEditPatient({ ...editPatient, name: e.target.value })} /></td>
                  <td style={s.td}><input style={{ ...s.input, padding: "5px 8px", width: "60px" }} value={editPatient.age ?? ""} onChange={e => setEditPatient({ ...editPatient, age: e.target.value })} /></td>
                  <td style={s.td}><input style={{ ...s.input, padding: "5px 8px" }} value={editPatient.contact ?? ""} onChange={e => setEditPatient({ ...editPatient, contact: e.target.value })} /></td>
                  <td style={s.td}><input style={{ ...s.input, padding: "5px 8px" }} value={editPatient.notes ?? ""} onChange={e => setEditPatient({ ...editPatient, notes: e.target.value })} /></td>
                  <td style={s.td}>
                    <button style={{ ...s.btn("success"), padding: "5px 12px", fontSize: "0.8rem" }} onClick={() => onSavePatient(editPatient)}>Save</button>
                  </td>
                </>
              ) : (
                <>
                  <td style={s.td}>{p.name}</td>
                  <td style={s.td}>{p.age ?? "—"}</td>
                  <td style={s.td}>{p.contact ?? "—"}</td>
                  <td style={s.td}>{p.notes ?? "—"}</td>
                  <td style={s.td}>
                    <button style={{ ...s.btn("primary"), padding: "5px 12px", fontSize: "0.8rem" }} onClick={() => setEditPatient({ ...p })}>Edit</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
