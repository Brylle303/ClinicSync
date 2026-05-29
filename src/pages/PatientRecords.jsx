import { useState } from "react";
import "./PatientRecords.css";

export default function PatientRecords({ patients, editPatient, setEditPatient, onSavePatient }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = patients?.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.contact?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleSave = (e) => {
    e.preventDefault();
    onSavePatient(editPatient);
  };

  return (
    <div className="records-wrapper">
      <div className="dash-header">
        <h1>Patient Records</h1>
        <p>Manage patient details, contact info, and medical notes.</p>
      </div>

      <div className="search-bar-container">
        <input 
          type="text" 
          placeholder="Search by patient name or phone number..." 
          className="records-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="table-card">
        <table className="records-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Contact Number</th>
              <th>Medical Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length === 0 ? (
              <tr><td colSpan="5" className="empty-state">No patients found.</td></tr>
            ) : (
              filteredPatients.map(p => (
                <tr key={p.id}>
                  <td className="fw-bold">{p.name}</td>
                  <td>{p.age || "—"}</td>
                  <td>{p.contact || "—"}</td>
                  <td className="notes-cell">{p.notes || "No notes added."}</td>
                  <td>
                    <button className="edit-btn" onClick={() => setEditPatient(p)}>Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editPatient && (
        <div className="modal-overlay" onClick={() => setEditPatient(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2>Edit Record</h2>
            <form onSubmit={handleSave} className="edit-form">
              <div className="input-group">
                <label>Patient Name</label>
                <input type="text" value={editPatient.name || ""} onChange={e => setEditPatient({...editPatient, name: e.target.value})} required />
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Age</label>
                  <input type="number" value={editPatient.age || ""} onChange={e => setEditPatient({...editPatient, age: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Contact Number</label>
                  <input type="text" value={editPatient.contact || ""} onChange={e => setEditPatient({...editPatient, contact: e.target.value})} />
                </div>
              </div>
              <div className="input-group">
                <label>Medical Notes</label>
                <textarea rows="4" value={editPatient.notes || ""} onChange={e => setEditPatient({...editPatient, notes: e.target.value})}></textarea>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setEditPatient(null)}>Cancel</button>
                <button type="submit" className="save-btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}