import { useState } from "react";
import "./DoctorSchedules.css";

export default function DoctorSchedules({ doctors, onUpdateSlots, blockDate, setBlockDate, blockDoctor, setBlockDoctor, onBlockDate }) {
  const [selectedDocId, setSelectedDocId] = useState(doctors[0]?.id || "");
  const [newSlot, setNewSlot] = useState("09:00 AM");

  const selectedDoctor = doctors.find(d => d.id == selectedDocId);

  const standardTimes = [
    "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
  ];

  const handleAddSlot = () => {
    if (!selectedDoctor || !newSlot || selectedDoctor.slots?.includes(newSlot)) return;
    
    const updatedSlots = [...(selectedDoctor.slots || []), newSlot];
    updatedSlots.sort((a, b) => new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b));
    
    onUpdateSlots(selectedDoctor.id, updatedSlots);
  };

  const handleRemoveSlot = (slotToRemove) => {
    const updatedSlots = selectedDoctor.slots.filter(s => s !== slotToRemove);
    onUpdateSlots(selectedDoctor.id, updatedSlots);
  };

  return (
    <div className="shift-wrapper">
      <div className="dash-header">
        <h1>Shift Manager</h1>
        <p>Set the standard daily working hours available for patients to book.</p>
      </div>

      <div className="shift-card">
        <div className="shift-doc-selector">
          <label>Select a Doctor to Manage:</label>
          <select value={selectedDocId} onChange={e => setSelectedDocId(e.target.value)}>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialty})</option>
            ))}
          </select>
        </div>

        {selectedDoctor && (
          <div className="shift-editor">
            <h3>Current Active Slots</h3>
            <div className="slots-container">
              {selectedDoctor.slots?.length === 0 && <p className="empty-text">No slots assigned. Patients cannot book this doctor.</p>}
              
              {selectedDoctor.slots?.map(slot => (
                <div key={slot} className="slot-badge-edit">
                  {slot}
                  <button onClick={() => handleRemoveSlot(slot)} className="remove-slot-btn" title="Remove Slot">×</button>
                </div>
              ))}
            </div>

            <div className="add-slot-row">
              <select value={newSlot} onChange={e => setNewSlot(e.target.value)}>
                {standardTimes.map(time => <option key={time} value={time}>{time}</option>)}
              </select>
              <button onClick={handleAddSlot} className="save-btn">Add Time Slot</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}