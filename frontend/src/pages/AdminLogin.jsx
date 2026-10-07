import { useState } from "react";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (username === "admin" && password === "1234") {
      setLoggedIn(true);
      setMessage("✅ Admin Login Successful");

      const response = await fetch("http://localhost:5000/api/certificates");
      const data = await response.json();

      setCertificates(data);
    } else {
      setMessage("❌ Invalid Username or Password");
    }
  };

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h1>👨‍💼 Admin Login</h1>

      {!loggedIn && (
        <>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <br /><br />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <br /><br />

          <button onClick={handleLogin}>
            Login
          </button>

          <h3>{message}</h3>
        </>
      )}

      {loggedIn && (
        <>
          <h2>Uploaded Certificates</h2>

          <table
            border="1"
            cellPadding="10"
            style={{
              margin: "20px auto",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th>Student</th>
                <th>Certificate ID</th>
                <th>Course</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {certificates.map((item) => (
                <tr key={item._id}>
                  <td>{item.studentName}</td>
                  <td>{item.certificateId}</td>
                  <td>{item.courseName}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default AdminLogin;