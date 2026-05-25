import { s } from "./styles";

export default function PatientRecords({ patients, setPatients, editPatient, setEditPatient }) {
  return (
    <div style={s.card}>
      <h2 style={s.h2}>Patient Records</h2>
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
                  <td style={s.td}>
                    <input style={{ ...s.input, padding: "5px 8px" }} value={editPatient.name} onChange={e => setEditPatient({ ...editPatient, name: e.target.value })} />
                  </td>
                  <td style={s.td}>
                    <input style={{ ...s.input, padding: "5px 8px", width: "60px" }} value={editPatient.age} onChange={e => setEditPatient({ ...editPatient, age: e.target.value })} />
                  </td>
                  <td style={s.td}>
                    <input style={{ ...s.input, padding: "5px 8px" }} value={editPatient.contact} onChange={e => setEditPatient({ ...editPatient, contact: e.target.value })} />
                  </td>
                  <td style={s.td}>
                    <input style={{ ...s.input, padding: "5px 8px" }} value={editPatient.notes} onChange={e => setEditPatient({ ...editPatient, notes: e.target.value })} />
                  </td>
                  <td style={s.td}>
                    <button
                      style={{ ...s.btn("success"), padding: "5px 12px", fontSize: "0.8rem" }}
                      onClick={() => {
                        setPatients(patients.map(x => x.id === editPatient.id ? editPatient : x));
                        setEditPatient(null);
                      }}
                    >
                      Save
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td style={s.td}>{p.name}</td>
                  <td style={s.td}>{p.age}</td>
                  <td style={s.td}>{p.contact}</td>
                  <td style={s.td}>{p.notes}</td>
                  <td style={s.td}>
                    <button
                      style={{ ...s.btn("primary"), padding: "5px 12px", fontSize: "0.8rem" }}
                      onClick={() => setEditPatient({ ...p })}
                    >
                      Edit
                    </button>
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
