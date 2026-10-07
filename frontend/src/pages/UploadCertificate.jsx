import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function UploadCertificate() {
  const navigate = useNavigate();

  const [studentName, setStudentName] = useState("");
  const [marksheetFile, setMarksheetFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentName.trim()) {
      setMessage("Please enter Student Name.");
      return;
    }

    if (!marksheetFile) {
      setMessage("Please upload a marksheet.");
      return;
    }

    setLoading(true);
    setMessage("Checking Marksheet...");

    const formData = new FormData();

    formData.append("studentName", studentName);
    formData.append("certificate", marksheetFile);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const text = await response.text();

      let data = {};

      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }

      if (response.ok) {
        navigate("/result", {
          state: {
            prediction: data.prediction,
            confidence: data.confidence,
            studentName: studentName,
            fileName: data.fileName,
            fakeDetections: data.fakeDetections || 0,
            trueDetections: data.trueDetections || 0,
            verificationStatus: data.verificationStatus,
            fileHash: data.fileHash,
            blockchainHash: data.blockchainHash,
            previousHash: data.previousHash,
          },
        });
      } else {
        setMessage(
          data.error ||
          data.message ||
          `Marksheet verification failed (${response.status})`
        );
      }
    } catch (error) {
      console.error("Upload Error:", error);

      setMessage(
        "Server Connection Failed. Please make sure the backend is running."
      );
    }

    setLoading(false);
  };

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="logo-shield">🔐</div>

          <div>
            <h2>Blockchain</h2>
            <span>Marksheet Validator</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <button
            className="sidebar-item"
            onClick={() => navigate("/")}
          >
            <span>⌂</span>
            Home
          </button>

          <button
            className="sidebar-item active"
            onClick={() => navigate("/upload")}
          >
            <span>⇧</span>
            Verify Marksheet
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate("/verify")}
          >
            <span>✓</span>
            Verification
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate("/admin")}
          >
            <span>♙</span>
            Admin
          </button>

        </nav>

        <div className="sidebar-bottom">
          <div>Secure</div>
          <span>•</span>
          <div>Transparent</div>
          <span>•</span>
          <div>Trusted</div>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* TOP BAR */}
        <header className="topbar">

          <div>
            <span className="topbar-label">
              MARKSHEET VERIFICATION
            </span>
          </div>

          <div className="admin-profile">
            <span className="profile-icon">●</span>
            <span>Admin</span>
            <span>⌄</span>
          </div>

        </header>

        {/* PAGE CONTENT */}
        <section className="verify-page">

          <div className="verify-heading">

            <span className="hero-badge">
              AI + BLOCKCHAIN
            </span>

            <h1>
              Verify Your
              <br />
              <span>Marksheet</span>
            </h1>

            <p>
              Upload a marksheet and let our AI-assisted
              verification system check its authenticity.
            </p>

          </div>

          <div className="verification-container">

            {/* LEFT INFORMATION CARD */}
            <div className="verification-info">

              <div className="info-icon-large">
                🛡️
              </div>

              <h2>
                Secure Marksheet
                <br />
                Verification
              </h2>

              <p>
                Our system analyzes the uploaded marksheet
                using AI and generates a SHA-256 file hash
                for integrity verification.
              </p>

              <div className="verification-points">

                <div className="verification-point">
                  <span>✓</span>
                  <div>
                    <strong>AI Detection</strong>
                    <small>
                      Original or Fake prediction
                    </small>
                  </div>
                </div>

                <div className="verification-point">
                  <span>✓</span>
                  <div>
                    <strong>SHA-256 Hash</strong>
                    <small>
                      File integrity verification
                    </small>
                  </div>
                </div>

                <div className="verification-point">
                  <span>✓</span>
                  <div>
                    <strong>Blockchain Hash Chain</strong>
                    <small>
                      Tamper-evident record linking
                    </small>
                  </div>
                </div>

              </div>

            </div>

            {/* UPLOAD CARD */}
            <div className="modern-upload-card">

              <div className="upload-card-header">

                <div className="upload-round-icon">
                  📄
                </div>

                <div>
                  <h2>Upload Marksheet</h2>
                  <p>
                    Enter student details and select your
                    marksheet file.
                  </p>
                </div>

              </div>

              <form
                onSubmit={handleSubmit}
                className="modern-marksheet-form"
              >

                {/* STUDENT NAME */}
                <div className="modern-form-group">

                  <label htmlFor="studentName">
                    Student Name
                  </label>

                  <input
                    id="studentName"
                    type="text"
                    placeholder="Enter student name"
                    value={studentName}
                    onChange={(e) =>
                      setStudentName(e.target.value)
                    }
                    disabled={loading}
                  />

                </div>

                {/* FILE UPLOAD */}
                <div className="modern-form-group">

                  <label htmlFor="marksheetFile">
                    Marksheet File
                  </label>

                  <label
                    htmlFor="marksheetFile"
                    className="file-upload-box"
                  >

                    <div className="file-upload-icon">
                      ⇧
                    </div>

                    <div>

                      <strong>
                        Click to upload marksheet
                      </strong>

                      <span>
                        JPG, JPEG or PNG files
                      </span>

                    </div>

                  </label>

                  <input
                    id="marksheetFile"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => {
                      setMarksheetFile(
                        e.target.files[0]
                      );
                      setMessage("");
                    }}
                    disabled={loading}
                    hidden
                  />

                  {marksheetFile && (
                    <div className="selected-file">

                      <span>📄</span>

                      <div>
                        <strong>
                          {marksheetFile.name}
                        </strong>

                        <small>
                          Marksheet selected successfully
                        </small>
                      </div>

                    </div>
                  )}

                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  className="modern-verify-btn"
                  disabled={loading}
                >

                  {loading ? (
                    <>
                      <span className="loading-dot">
                        •
                      </span>
                      Checking Marksheet...
                    </>
                  ) : (
                    <>
                      🔍 Verify Marksheet
                      <span>→</span>
                    </>
                  )}

                </button>

              </form>

              {/* MESSAGE */}
              {message && (
                <div
                  className={
                    message === "Checking Marksheet..."
                      ? "status-message checking"
                      : "status-message"
                  }
                >
                  {message}
                </div>
              )}

              {/* BACK BUTTON */}
              <button
                type="button"
                className="modern-back-btn"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                ← Back to Home
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default UploadCertificate;