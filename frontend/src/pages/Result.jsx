import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Result.css";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const result =
    location.state ||
    JSON.parse(localStorage.getItem("verificationResult") || "null");

  if (!result) {
    return (
      <div className="result-empty">
        <h2>No Verification Result</h2>
        <p>Please upload and verify a marksheet first.</p>

        <button onClick={() => navigate("/upload")}>
          Upload Marksheet →
        </button>
      </div>
    );
  }

  const prediction = String(
    result.prediction ||
    result.verificationStatus ||
    "Unknown"
  ).toLowerCase();

  const isOriginal =
    prediction.includes("original") ||
    prediction.includes("true");

  const resultText = isOriginal ? "ORIGINAL" : "FAKE";

  let confidence = Number(result.confidence || 0);

  if (confidence <= 1) {
    confidence = confidence * 100;
  }

  confidence = Math.min(100, Math.max(0, confidence));

  const fileName =
    result.fileName ||
    result.certificate ||
    "Marksheet";

 const fileUrl =
  result.fileUrl ||
  result.rawResponse?.fileUrl ||
  result.rawResponse?.file_url ||
  "";

  const fileHash =
    result.sha256 ||
    result.fileHash ||
    result.hash ||
    "Not available";

  const blockchainHash =
    result.blockchainHash ||
    result.hash ||
    "Not available";

  const previousHash =
    result.previousHash ||
    "Genesis Block";

  const blockIndex =
    result.blockIndex ??
    result.index ??
    "N/A";

  return (
    <div className="result-layout">

      {/* ================= SIDEBAR ================= */}

      <aside className="result-sidebar">

        <div className="result-brand">

          <div className="result-brand-icon">
            ✓
          </div>

          <div>
            <strong>Blockchain</strong>
            <span>Certificate Validator</span>
          </div>

        </div>

        <nav className="result-nav">

          <button onClick={() => navigate("/")}>
            <span>⌂</span>
            Home
          </button>

          <button onClick={() => navigate("/upload")}>
            <span>⇧</span>
            Upload Marksheet
          </button>

          <button
            className="result-active"
            onClick={() => navigate("/verify")}
          >
            <span>◇</span>
            Verify Marksheet
          </button>

          <button onClick={() => navigate("/admin")}>
            <span>♙</span>
            Admin
          </button>

        </nav>

        <div className="result-sidebar-bottom">

          <div>
            Secure&nbsp; • &nbsp;Transparent&nbsp; • &nbsp;Trusted
          </div>

          <div className="result-cubes">
            <span>◆</span>
            <span>◆</span>
            <span>◆</span>
            <span>◆</span>
          </div>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="result-main">

        {/* TOPBAR */}

        <header className="result-topbar">

          <div></div>

          <div className="result-admin">

            <div className="result-admin-avatar">
              A
            </div>

            <strong>Admin</strong>

            <span>⌄</span>

          </div>

        </header>

        {/* CONTENT */}

        <section className="result-content">

          {/* HEADING */}

          <div className="result-heading">

            <div className="result-label">
              VERIFICATION RESULT
            </div>

            <h1>
              Marksheet Verification
            </h1>

            <p>
              View the result of your marksheet verification with AI and Blockchain.
            </p>

          </div>

          {/* ================= RESULT TOP ================= */}

          <div className="result-top-grid">

            {/* MARKSHEET PREVIEW */}

            <div className="marksheet-preview-card">

              <div className="preview-header">
                <strong>Uploaded Marksheet</strong>
                <span>Document Preview</span>
              </div>

              <div className="marksheet-preview">

                {fileUrl ? (
                  <img
                    src={fileUrl}
                    alt="Uploaded marksheet"
                  />
                ) : (
                  <div className="preview-placeholder">

                    <div>📄</div>

                    <strong>
                      {fileName}
                    </strong>

                    <span>
                      Marksheet uploaded successfully
                    </span>

                  </div>
                )}

              </div>

              <div className="preview-file-name">
                {fileName}
              </div>

            </div>

            {/* RESULT DETAILS */}

            <div className="result-details-card">

              <div
                className={
                  isOriginal
                    ? "result-status original"
                    : "result-status fake"
                }
              >

                <div className="status-icon">
                  {isOriginal ? "✓" : "!"}
                </div>

                <div>
                  <span>VERIFICATION RESULT</span>
                  <strong>{resultText}</strong>
                </div>

              </div>

              {/* CONFIDENCE */}

              <div className="confidence-section">

                <div className="confidence-header">

                  <span>
                    Confidence Score
                  </span>

                  <strong>
                    {confidence.toFixed(2)}%
                  </strong>

                </div>

                <div className="confidence-bar">

                  <div
                    style={{
                      width: `${confidence}%`,
                    }}
                  ></div>

                </div>

              </div>

              {/* DETAILS */}

              <div className="certificate-details">

                <div>
                  <span>Student Name</span>
                  <strong>
                    {result.studentName || "Not available"}
                  </strong>
                </div>

                <div>
                  <span>Document Type</span>
                  <strong>Marksheet</strong>
                </div>

                <div>
                  <span>File Name</span>
                  <strong>{fileName}</strong>
                </div>

                <div>
                  <span>Verification</span>
                  <strong>
                    AI + Blockchain
                  </strong>
                </div>

              </div>

              {/* BLOCKCHAIN */}

              <div className="blockchain-box">

                <div className="blockchain-box-header">

                  <div className="blockchain-icon">
                    ⛓
                  </div>

                  <div>
                    <strong>
                      Blockchain Verification
                    </strong>

                    <span>
                      Verification record securely stored.
                    </span>
                  </div>

                </div>

                <div className="hash-row">

                  <span>SHA-256</span>

                  <code>
                    {fileHash}
                  </code>

                </div>

                <div className="hash-row">

                  <span>Block Index</span>

                  <code>
                    {blockIndex}
                  </code>

                </div>

                <div className="hash-row">

                  <span>Blockchain Hash</span>

                  <code>
                    {blockchainHash}
                  </code>

                </div>

                <div className="hash-row">

                  <span>Previous Hash</span>

                  <code>
                    {previousHash}
                  </code>

                </div>

              </div>

            </div>

          </div>

          {/* ================= RECENT ================= */}

          <div className="recent-records-card">

            <div className="recent-header">

              <div>
                <h2>
                  Recent Verification Records
                </h2>

                <p>
                  Latest marksheet verification activity.
                </p>
              </div>

              <span className="record-status">
                ● Verified
              </span>

            </div>

            <div className="records-table">

              <div className="table-head">

                <span>#</span>
                <span>Student Name</span>
                <span>Result</span>
                <span>Confidence</span>
                <span>Block</span>
                <span>Action</span>

              </div>

              <div className="table-row">

                <span>1</span>

                <span>
                  {result.studentName || "Student"}
                </span>

                <span>

                  <b
                    className={
                      isOriginal
                        ? "table-result original-result"
                        : "table-result fake-result"
                    }
                  >
                    ● {resultText}
                  </b>

                </span>

                <span>
                  {confidence.toFixed(2)}%
                </span>

                <span>
                  #{blockIndex}
                </span>

                <span>
                  <button
                    onClick={() =>
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      })
                    }
                  >
                    View
                  </button>
                </span>

              </div>

            </div>

          </div>

          {/* ================= ACTIONS ================= */}

          <div className="result-actions">

            <button
              className="result-secondary-btn"
              onClick={() => navigate("/upload")}
            >
              ⇧ &nbsp; Verify Another Marksheet
            </button>

            <button
              className="result-primary-btn"
              onClick={() => navigate("/admin")}
            >
              ◇ &nbsp; View Admin Dashboard
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Result;