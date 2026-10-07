function Navbar() {
  return (
    <nav
      style={{
        backgroundColor: "#0f172a",
        color: "white",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>🎓 Certificate Validator</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <a href="/" style={{ color: "white", textDecoration: "none" }}>
          Home
        </a>

        <a href="/upload" style={{ color: "white", textDecoration: "none" }}>
          Upload
        </a>

        <a href="/verify" style={{ color: "white", textDecoration: "none" }}>
          Verify
        </a>

        <a href="/admin" style={{ color: "white", textDecoration: "none" }}>
          Admin
        </a>
      </div>
    </nav>
  );
}

export default Navbar;