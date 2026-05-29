import { TODAY } from "../constants";
import './Dashboard.css';

const LinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="link-icon">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

export default function Dashboard({ doctors, bookings, onReschedule, onCancel, getDoctorName, currentUser, role }) {
  
  const realBookings = bookings.filter(b => b.patient !== "BLOCKED");

  const groupedBookings = realBookings.reduce((acc, booking) => {
   if (!acc[booking.date]) acc[booking.date] = [];
   acc[booking.date].push(booking);
   return acc;
 }, {});

  const getGroupTitle = (dateString) => {
    const dateObj = new Date(dateString);
    const formatted = dateObj.toLocaleDateString('en-GB', { month: 'long', day: 'numeric' });
    return dateString === TODAY ? `TODAY, ${formatted}` : formatted;
  };

  const name = currentUser?.username || "User";
  const isDoctor = role === "doctor";
  const isStaffOrDoctor = role === "staff" || role === "doctor";

  return (
    <div className="dash-wrapper">
       <div className="dash-main">
          
       <div className="dash-header">
             <h1>Good Morning, {isDoctor ? `Dr. ${name}` : name}</h1>
             <p>Have a Pleasant Day {isStaffOrDoctor ? "at Work!" : "Ahead!"}</p>
          </div>

          <div className="dash-section">
             <h2>My Appointments</h2>
             <div className="dash-card">
                {Object.keys(groupedBookings).length === 0 ? (
                   <p className="empty-text">No appointments booked yet.</p>
                ) : (
                   Object.keys(groupedBookings).map((date) => (
                      <div key={date} className="date-group">
                         <h3 className="date-title">{getGroupTitle(date)}</h3>
                         
                         {groupedBookings[date].map((b, i) => {
                            const isNewPatient = isStaffOrDoctor && i === 0 && date === TODAY;
                            
                            return (
                               <div key={b.id} className="appointment-row">
                                  <div className="apt-info">
                                     {isNewPatient && <span className="new-dot"></span>}
                                     <span className="apt-name">{isStaffOrDoctor ? b.patient : getDoctorName(b.doctor_id)}</span>
                                     
                                     {!isStaffOrDoctor && <span className="apt-sub">({doctors.find(d => d.id === b.doctor_id)?.specialty || "Doctor"})</span>}
                                     {isStaffOrDoctor && <LinkIcon />}
                                  </div>
                                  
                                  <div className="apt-date">
                                     {new Date(b.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                                  </div>

                                  <div className="apt-time-group">
                                     <div className="apt-time">{b.slot}</div>
                                     <div className="apt-actions">
                                        <button onClick={() => onReschedule(b)} className="action-btn">Reschedule</button>
                                        <button onClick={() => onCancel(b.id)} className="action-btn cancel">Cancel</button>
                                     </div>
                                  </div>
                               </div>
                            );
                         })}
                      </div>
                   ))
                )}
             </div>
          </div>

          {!isStaffOrDoctor && (
             <div className="dash-section">
                <h2>Available Doctors</h2>
                <div className="dash-card">
                   {doctors.map(doc => (
                      <div key={doc.id} className="doctor-row">
                         <div className="doc-info">
                            <span className="doc-name">{doc.name}</span>
                            <span className="doc-specialty">{doc.specialty}</span>
                         </div>
                         <div className="doc-slots">
                            {doc.slots.length === 0 && <span className="apt-sub">No available slots</span>}
                            {doc.slots.map(slot => (
                               <span key={slot} className="slot-badge">{slot}</span>
                            ))}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}
       </div>

       <div className="dash-sidebar">
          <h2>Notifications</h2>
          <div className="dash-card notifications-card">
             <div className="notification-list">
                
                <div className="notif-item">
                   <div className="notif-header">
                      <strong>{isStaffOrDoctor ? "Jane Doe" : "Clinic Staff"}</strong>
                      <span className="notif-time">10:42 AM</span>
                   </div>
                   <p className="notif-text">
                      {isStaffOrDoctor ? "Can we reschedule my appointment to 3 PM?" : "Please remember to bring your previous medical records."}
                   </p>
                   <button className="reply-btn">Reply</button>
                </div>

                <div className="notif-item">
                   <div className="notif-header">
                      <strong>System</strong>
                      <span className="notif-time">Yesterday</span>
                   </div>
                   <p className="notif-text">Your appointment has been confirmed.</p>
                </div>
             </div>

             <div className="notif-input-area">
                <input type="text" placeholder="Type a message..." className="notif-input" />
                <button className="send-btn">Send</button>
             </div>
          </div>
       </div>
    </div>
  );
}