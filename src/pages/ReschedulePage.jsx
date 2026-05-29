import { useState, useEffect } from "react";
import "./ReschedulePage.css";

export default function ReschedulePage({ 
  rescheduleTarget, rescheduleSlot, setRescheduleSlot, 
  isSlotBooked, onConfirm, onCancel, doctors 
}) {
  const [dayOffset, setDayOffset] = useState(0);
  
  const [newDate, setNewDate] = useState(rescheduleTarget?.date || "");

  useEffect(() => {
    setRescheduleSlot(null);
  }, [setRescheduleSlot]);

  if (!rescheduleTarget) return null;

  const doctor = doctors.find(d => d.id === rescheduleTarget.doctor_id);
  if (!doctor) return <div className="reschedule-wrapper">Doctor not found.</div>;

  const visibleDates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset + i);
    return d.toISOString().split("T")[0];
  });

  const isDateBlockedLocal = (dateStr) => doctor.blocked_dates?.includes(dateStr);

  return (
    <div className="reschedule-wrapper">
      <div className="dash-header">
        <h1>Reschedule Appointment</h1>
        <p>Select a new date and time for <strong>{rescheduleTarget.patient}</strong>.</p>
      </div>

      <div className="current-appt-card">
        <div className="current-badge">Current Appointment</div>
        <div className="current-details">
          <div className="detail-group">
            <span className="detail-label">Doctor</span>
            <span className="detail-value">Dr. {doctor.name}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Date</span>
            <span className="detail-value">{new Date(rescheduleTarget.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Time</span>
            <span className="detail-value">{rescheduleTarget.slot}</span>
          </div>
        </div>
      </div>

      <div className="new-appt-card">
        <h3 className="section-title">Select New Date & Time</h3>
        
        <div className="calendar-section">
          <div className="calendar-header">
            <div className="calendar-nav">
              <button type="button" className="cal-nav-btn" onClick={() => setDayOffset(prev => Math.max(0, prev - 14))} disabled={dayOffset === 0}>&larr; Prev</button>
              <button type="button" className="cal-nav-btn" onClick={() => setDayOffset(prev => prev + 14)}>Next &rarr;</button>
            </div>
          </div>

          <div className="date-picker-row">
            {visibleDates.map(dateStr => {
              const dateObj = new Date(dateStr);
              const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNum = dateObj.getDate();
              const isBlocked = isDateBlockedLocal(dateStr);

              return (
                <button 
                  key={dateStr}
                  disabled={isBlocked}
                  className={`date-tile ${newDate === dateStr ? 'selected' : ''} ${isBlocked ? 'blocked' : ''}`}
                  onClick={() => { setNewDate(dateStr); setRescheduleSlot(null); }}
                >
                  <span className="day-name">{dayName}</span>
                  <span className="day-num">{dayNum}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="time-section">
          <h4>Available Times for {new Date(newDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h4>
          
          {isDateBlockedLocal(newDate) ? (
            <p className="unavailable-text">The doctor is unavailable on this date.</p>
          ) : (
            <div className="time-slot-grid">
              {doctor.slots?.length === 0 && <p className="unavailable-text">No slots scheduled.</p>}
              
              {doctor.slots?.map(slot => {
                const isAlreadyBooked = isSlotBooked(doctor.id, newDate, slot);
                const isCurrentSlot = (newDate === rescheduleTarget.date && slot === rescheduleTarget.slot);
                const disabled = isAlreadyBooked && !isCurrentSlot;

                return (
                  <button
                    key={slot}
                    disabled={disabled}
                    className={`time-pill ${rescheduleSlot === slot ? 'selected' : ''} ${disabled ? 'booked' : ''} ${isCurrentSlot ? 'current-slot' : ''}`}
                    onClick={() => setRescheduleSlot(slot)}
                  >
                    {slot} {disabled && "(Booked)"} {isCurrentSlot && "(Current)"}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="reschedule-action-row">
        <button className="cancel-btn" onClick={onCancel}>Keep Original Appointment</button>
        <button 
          className="btn-book-now" 
          disabled={!rescheduleSlot || isDateBlockedLocal(newDate) || (newDate === rescheduleTarget.date && rescheduleSlot === rescheduleTarget.slot)} 
          onClick={() => onConfirm(newDate, rescheduleSlot)}
        >
          Confirm Reschedule
        </button>
      </div>
    </div>
  );
}