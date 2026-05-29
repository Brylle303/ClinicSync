import { useState, useEffect } from "react";
import { TODAY } from "../constants";
import "./BookAppointment.css";

export default function BookAppointment({
  doctors, selectedDoctor, setSelectedDoctor,
  selectedDate, setSelectedDate, selectedSlot, setSelectedSlot,
  patientName, setPatientName, bookMsg, setBookMsg,
  isSlotBooked, isDateBlocked, onBook, currentUser, role, 
  bookings, onCancel, onReschedule, onToggleBlockSlot, onToggleBlockDay
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dayOffset, setDayOffset] = useState(0); 
  
  const [staffView, setStaffView] = useState("monthly"); 
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  
  const [activeActionMenu, setActiveActionMenu] = useState(null);

  useEffect(() => {
    if (role === "patient" && currentUser?.username && !patientName) {
      setPatientName(currentUser.username);
    }
  }, [role, currentUser, patientName, setPatientName]);

  const visibleDates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset + i);
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  });

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExpandDoctor = (docId) => {
    if (selectedDoctor === docId) {
      setSelectedDoctor(null); 
    } else {
      setSelectedDoctor(docId);
      setSelectedDate(TODAY);
      setSelectedSlot(null);
      setBookMsg("");
      setDayOffset(0); 
    }
  };

  // --- STAFF VIEW COMPONENTS ---
  if (role === "doctor") {
    const staffDocId = doctors[0]?.id; 

    const getWeekDates = () => {
      const dates = [];
      const today = new Date();
      const start = new Date(today.setDate(today.getDate() - today.getDay() + (weekOffset * 7)));
      for(let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        dates.push(`${year}-${month}-${day}`);
      }
      return dates;
    };

    const weekDates = getWeekDates();
    const standardTimes = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
    
    const displayMonthDate = new Date();
    displayMonthDate.setMonth(displayMonthDate.getMonth() + monthOffset);
    const monthYear = displayMonthDate.getFullYear();
    const monthIndex = displayMonthDate.getMonth();

    const firstDayOfMonth = new Date(monthYear, monthIndex, 1).getDay(); 
    const daysInMonth = new Date(monthYear, monthIndex + 1, 0).getDate(); 

    const blankDays = Array.from({ length: firstDayOfMonth }).map((_, i) => i);
    const monthDays = Array.from({ length: daysInMonth }).map((_, i) => i + 1);
    const monthName = displayMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
      <div className="book-wrapper staff-schedule-wrapper" onClick={() => setActiveActionMenu(null)}>
        <div className="dash-header">
          <h1>Schedule Manager</h1>
          <p>Manage appointments and availability for your clinic.</p>
        </div>

        <div className="staff-controls">
          <div className="view-toggles">
            <button className={`toggle-btn ${staffView === 'monthly' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setStaffView('monthly'); }}>Monthly</button>
            <button className={`toggle-btn ${staffView === 'weekly' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setStaffView('weekly'); }}>Weekly</button>
          </div>
          
          {staffView === 'weekly' && (
            <div className="calendar-nav">
              <button className="cal-nav-btn" onClick={(e) => { e.stopPropagation(); setWeekOffset(prev => prev - 1); }}>&larr; Prev Week</button>
              <button className="btn-book-now" onClick={(e) => { e.stopPropagation(); setWeekOffset(0); }}>This Week</button>
              <button className="cal-nav-btn" onClick={(e) => { e.stopPropagation(); setWeekOffset(prev => prev + 1); }}>Next Week &rarr;</button>
            </div>
          )}
        </div>

        {staffView === 'weekly' ? (
          <div className="weekly-grid-container">
            <div className="grid-header">
              <div className="time-col-header">Time</div>
              {weekDates.map(date => {
                const isBlockedDay = isDateBlocked(staffDocId, date);
                return (
                  <div key={date} className={`day-col-header ${date === TODAY ? 'is-today' : ''}`}>
                    <span className="grid-day-name">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span className="grid-day-num">{new Date(date).getDate()}</span>
                    
                    <button 
                      className={`block-day-btn ${isBlockedDay ? 'blocked' : ''}`}
                      onClick={(e) => { e.stopPropagation(); onToggleBlockDay(staffDocId, date, isBlockedDay); }}
                    >
                      {isBlockedDay ? "Unblock Day" : "Block Day"}
                    </button>
                  </div>
                )
              })}
            </div>
            
            <div className="grid-body">
              {standardTimes.map(time => (
                <div key={time} className="grid-row">
                  <div className="time-label">{time}</div>
                  {weekDates.map(date => {
                    const booking = bookings?.find(b => b.doctor_id === staffDocId && b.date === date && b.slot === time);
                    const isBlockedDay = isDateBlocked(staffDocId, date);
                    
                    const isSlotManuallyBlocked = booking?.patient === "BLOCKED";
                    const isRealBooking = booking && !isSlotManuallyBlocked;

                    return (
                      <div 
                        key={date} 
                        className={`grid-cell ${isRealBooking ? 'booked' : ''} ${(isBlockedDay || isSlotManuallyBlocked) && !isRealBooking ? 'blocked' : ''}`}
                        onClick={(e) => { 
                          e.stopPropagation();
                          if (isBlockedDay) return;
                          
                          if (isRealBooking) {
                             setActiveActionMenu(booking.id);
                          } else {
                             onToggleBlockSlot(staffDocId, date, time, isSlotManuallyBlocked, booking?.id);
                          }
                        }}
                      >
                        {isRealBooking && (
                          <>
                            <div className="patient-badge">{booking.patient}</div>
                            
                            {activeActionMenu === booking.id && (
                               <div className="action-menu">
                                 <button onClick={(e) => { e.stopPropagation(); onReschedule(booking); }}>Reschedule</button>
                                 <button className="cancel-btn" onClick={(e) => { e.stopPropagation(); onCancel(booking.id); setActiveActionMenu(null); }}>Cancel Booking</button>
                               </div>
                            )}
                          </>
                        )}
                        {isBlockedDay && !booking && <div className="blocked-text">Day Off</div>}
                        {isSlotManuallyBlocked && <div className="blocked-text">Unavailable</div>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="monthly-calendar-container">
            <div className="calendar-nav-header">
              <button className="cal-nav-btn" onClick={(e) => { e.stopPropagation(); setMonthOffset(p => p - 1); }}>&larr; Prev Month</button>
              <h2 className="month-title">{monthName}</h2>
              <button className="cal-nav-btn" onClick={(e) => { e.stopPropagation(); setMonthOffset(p => p + 1); }}>Next Month &rarr;</button>
            </div>
            
            <div className="month-grid">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="month-col-header">{day}</div>
              ))}
              
              {blankDays.map(b => <div key={`blank-${b}`} className="month-cell empty"></div>)}
              
              {monthDays.map(day => {
                const d = new Date(monthYear, monthIndex, day);
                const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                
                const dayBookings = bookings?.filter(b => b.doctor_id === staffDocId && b.date === dateStr && b.patient !== "BLOCKED") || [];
                const isBlocked = isDateBlocked(staffDocId, dateStr);

                return (
                  <div 
                    key={day} 
                    className={`month-cell ${isBlocked ? 'blocked' : ''} ${dateStr === TODAY ? 'is-today' : ''}`}
                    onClick={(e) => {
                       e.stopPropagation();
                       setWeekOffset(Math.floor((d - new Date()) / (1000 * 60 * 60 * 24 * 7)));
                       setStaffView('weekly');
                    }}
                  >
                    <span className="month-day-num">{day}</span>
                    {dayBookings.length > 0 && <span className="monthly-badge">{dayBookings.length} Appt(s)</span>}
                    {isBlocked && <span className="monthly-badge blocked">Blocked</span>}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- PATIENT VIEW ---
  return (
    <div className="book-wrapper">
      <div className="dash-header">
        <h1>Find Your Doctor</h1>
        <p>Select a medical professional to view their availability.</p>
      </div>

      <div className="search-bar-container">
        <input 
          type="text" 
          placeholder="Search by name or specialty..." 
          className="doc-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {bookMsg && (
        <div className={`booking-alert ${bookMsg.includes("failed") ? "error" : "success"}`}>
          {bookMsg}
        </div>
      )}

      <div className="doctor-accordion-list">
        {filteredDoctors.map(doc => {
          const isExpanded = selectedDoctor === doc.id;

          return (
            <div key={doc.id} className={`doc-accordion-card ${isExpanded ? "expanded" : ""}`}>
              <div className="doc-header" onClick={() => handleExpandDoctor(doc.id)}>
                <div className="doc-header-info">
                  <h3 className="doc-title">{doc.name}</h3>
                  <span className="doc-specialty">{doc.specialty || "General Practice"}</span>
                </div>
                <div className="doc-expand-icon">
                  {isExpanded ? "−" : "+"}
                </div>
              </div>

              {isExpanded && (
                <div className="doc-body">
                  <div className="calendar-section">
                    <div className="calendar-header">
                      <h4>Select a Date</h4>
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
                        const isBlocked = isDateBlocked(doc.id, dateStr);

                        return (
                          <button 
                            key={dateStr}
                            disabled={isBlocked}
                            className={`date-tile ${selectedDate === dateStr ? 'selected' : ''} ${isBlocked ? 'blocked' : ''}`}
                            onClick={() => { setSelectedDate(dateStr); setSelectedSlot(null); }}
                          >
                            <span className="day-name">{dayName}</span>
                            <span className="day-num">{dayNum}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="time-section">
                    <h4>Available Times for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h4>
                    
                    {isDateBlocked(doc.id, selectedDate) ? (
                      <p className="unavailable-text">The doctor is unavailable on this date.</p>
                    ) : (
                      <div className="time-slot-grid">
                        {doc.slots?.length === 0 && <p className="unavailable-text">No slots scheduled.</p>}
                        
                        {doc.slots?.map(slot => {
                          const booked = isSlotBooked(doc.id, selectedDate, slot);
                          return (
                            <button
                              key={slot}
                              disabled={booked}
                              className={`time-pill ${selectedSlot === slot ? 'selected' : ''} ${booked ? 'booked' : ''}`}
                              onClick={() => setSelectedSlot(slot)}
                            >
                              {slot} {booked && "(Booked)"}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="booking-for-section">
                    <label>Booking For (Patient Name)</label>
                    <input 
                      type="text" 
                      className="patient-name-input"
                      value={patientName || ""}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Enter patient name..."
                    />
                  </div>

                  <div className="booking-action-row">
                    <button 
                      className="btn-book-now" 
                      disabled={!selectedSlot || !patientName || isDateBlocked(doc.id, selectedDate)} 
                      onClick={onBook}
                    >
                      Confirm & Book Appointment
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filteredDoctors.length === 0 && <p className="unavailable-text">No doctors found.</p>}
      </div>
    </div>
  );
}