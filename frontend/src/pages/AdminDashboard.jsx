import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalVerifications: 0,
    originalMarksheets: 0,
    fakeMarksheets: 0,
    blockchainBlocks: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/admin/stats")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Admin stats:", data);

        setStats({
          totalVerifications:
            data.totalVerifications ?? data.total ?? 0,

          originalMarksheets:
            data.originalMarksheets ?? data.original ?? 0,

          fakeMarksheets:
            data.fakeMarksheets ?? data.fake ?? 0,

          blockchainBlocks:
            data.blockchainBlocks ?? data.blocks ?? 0,
        });
      })
      .catch((error) => {
        console.error("Admin statistics error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="admin-layout">

      {/* ================= SIDEBAR ================= */}

      <aside className="admin-sidebar">

        <div className="admin-brand">
          <div className="admin-logo">✓</div>

          <div>
            <strong>Blockchain</strong>
            <span>Marksheet Validator</span>
          </div>
        </div>

        <nav className="admin-nav">

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            <span>⌂</span>
            Home
          </button>

          <button
            type="button"
            onClick={() => navigate("/upload")}
          >
            <span>↑</span>
            Upload Marksheet
          </button>

          <button
            type="button"
            onClick={() => navigate("/verify")}
          >
            <span>✓</span>
            Verify Marksheet
          </button>

          <button
            type="button"
            className="admin-nav-active"
            onClick={() => navigate("/admin")}
          >
            <span>♙</span>
            Admin
          </button>

        </nav>

        <div className="admin-sidebar-bottom">

          <div className="admin-security-mini">

            <div className="mini-lock">
              🔒
            </div>

            <div>
              <strong>Secure System</strong>
              <span>Blockchain Protected</span>
            </div>

          </div>

          <div className="admin-trust">
            Secure&nbsp; • &nbsp;Transparent&nbsp; • &nbsp;Trusted
          </div>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="admin-main">

        {/* TOP BAR */}

        <header className="admin-topbar">

          <div></div>

          <div className="admin-profile">

            <div className="admin-avatar">
              A
            </div>

            <div>
              <strong>Admin</strong>
              <span>Administrator</span>
            </div>

            <span className="admin-arrow">
              ⌄
            </span>

          </div>

        </header>

        {/* ================= CONTENT ================= */}

        <section className="admin-content">

          {/* HEADING */}

          <div className="admin-heading">

            <span className="admin-badge">
              ADMIN PANEL
            </span>

            <h1>
              Verification Overview
            </h1>

            <p>
              Monitor marksheet verification activity and blockchain records.
            </p>

          </div>

          {/* ================= STATISTICS ================= */}

          <div className="admin-stat-grid">

            {/* TOTAL */}

            <div className="admin-stat-card blue-card">

              <div className="stat-symbol">
                ✓
              </div>

              <div>
                <span>
                  Total Verifications
                </span>

                <strong>
                  {loading ? "..." : stats.totalVerifications}
                </strong>

                <small>
                  Blockchain records
                </small>
              </div>

            </div>

            {/* ORIGINAL */}

            <div className="admin-stat-card green-card">

              <div className="stat-symbol">
                ✓
              </div>

              <div>
                <span>
                  Original Marksheets
                </span>

                <strong>
                  {loading ? "..." : stats.originalMarksheets}
                </strong>

                <small>
                  AI verified records
                </small>
              </div>

            </div>

            {/* FAKE */}

            <div className="admin-stat-card red-card">

              <div className="stat-symbol">
                !
              </div>

              <div>
                <span>
                  Fake Marksheets
                </span>

                <strong>
                  {loading ? "..." : stats.fakeMarksheets}
                </strong>

                <small>
                  AI detected records
                </small>
              </div>

            </div>

            {/* BLOCKCHAIN */}

            <div className="admin-stat-card purple-card">

              <div className="stat-symbol">
                #
              </div>

              <div>
                <span>
                  Blockchain Blocks
                </span>

                <strong>
                  {loading ? "..." : stats.blockchainBlocks}
                </strong>

                <small>
                  Hash-chain records
                </small>
              </div>

            </div>

          </div>

          {/* ================= MAIN GRID ================= */}

          <div className="admin-main-grid">

            {/* ACTIVITY CARD */}

            <div className="admin-activity-card">

              <div className="card-top">

                <div>
                  <h2>
                    Recent Verification Activity
                  </h2>

                  <p>
                    Latest marksheet verification records
                  </p>
                </div>

                <span className="active-pill">
                  ● System Active
                </span>

              </div>

              <div className="blockchain-panel">

                <div className="chain-icon">
                  ⛓
                </div>

                <div>

                  <h3>
                    Blockchain Records
                  </h3>

                  <p>
                    Verification records are securely maintained using
                    SHA-256 hashing and blockchain technology.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/verify")}
                  >
                    Verify New Marksheet
                    <span>→</span>
                  </button>

                </div>

              </div>

            </div>

            {/* SECURITY LAYERS */}

            <div className="system-summary">

              <div className="summary-header">

                <h2>
                  Security Layers
                </h2>

                <span>
                  3 Layers
                </span>

              </div>

              <div className="summary-item">

                <div>
                  🔐
                </div>

                <span>
                  <strong>
                    SHA-256
                  </strong>

                  Unique document fingerprint
                </span>

              </div>

              <div className="summary-item">

                <div>
                  ⛓
                </div>

                <span>
                  <strong>
                    Blockchain
                  </strong>

                  Tamper-evident records
                </span>

              </div>

              <div className="summary-item">

                <div>
                  🤖
                </div>

                <span>
                  <strong>
                    YOLO AI
                  </strong>

                  Certificate classification
                </span>

              </div>

            </div>

          </div>

          {/* ================= SYSTEM STATUS ================= */}

          <div className="admin-status-card">

            <div className="status-left">

              <div className="status-check">
                ✓
              </div>

              <div>

                <strong>
                  Verification System Active
                </strong>

                <span>
                  AI detection, SHA-256 hashing and blockchain services are ready.
                </span>

              </div>

            </div>

            <button
              type="button"
              onClick={() => navigate("/upload")}
            >
              Upload New Marksheet
              <span>→</span>
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;