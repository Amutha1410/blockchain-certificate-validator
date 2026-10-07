import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VerifyCertificate.css";

function VerifyCertificate() {
  const location = useLocation();
  const navigate = useNavigate();

  const uploadedFile = location.state?.uploadedFile || null;
  const uploadedFileName = location.state?.uploadedFileName || "";
  const previousStudentName = location.state?.studentName || "";

  const [studentName, setStudentName] = useState(previousStudentName);
  const [certificate, setCertificate] = useState(uploadedFile);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(""); 
  useEffect(() => {
  if (!certificate) {
    setPreviewUrl("");
    return;
  }

  const url = URL.createObjectURL(certificate);
  setPreviewUrl(url);

  return () => URL.revokeObjectURL(url);
}, [certificate]); 
  const validateFile = (file) => {
    if (!file) return false;

   const allowedTypes = [
     "image/jpeg",
      "image/png",
   ];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload JPG or PNG file.");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB.");
      return false;
    }

    setError("");
    return true;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && validateFile(file)) {
      setCertificate(file);
    }
  };

  const removeFile = () => {
    setCertificate(null);
    setError("");
  };

  const verifyMarksheet = async () => {
    if (!studentName.trim()) {
      setError("Please enter student name.");
      return;
    }

    if (!certificate) {
      setError("Please select a marksheet.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("certificate", certificate);
      formData.append("studentName", studentName.trim());

      const response = await fetch(
        "http://127.0.0.1:5000/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message || "Certificate verification failed."
        );
      }

      const resultData = {
        studentName: studentName.trim(),
        fileUrl: previewUrl,

        fileName:
          data.fileName ||
          data.filename ||
          certificate.name ||
          uploadedFileName,

        certificate:
          data.certificate ||
          certificate.name ||
          uploadedFileName,

        prediction:
          data.prediction ||
          data.result ||
          data.classification ||
          "Unknown",

        confidence:
          data.confidence ??
          data.accuracy ??
          0,

        fakeDetections:
          data.fakeDetections ??
          data.fake_detections ??
          0,

        originalDetections:
          data.originalDetections ??
          data.original_detections ??
          0,

        trueDetections:
          data.trueDetections ??
          data.true_detections ??
          0,

        verificationStatus:
          data.verificationStatus ||
          data.verification_status ||
          data.status ||
          data.prediction ||
          "Verified",

        fileHash:
          data.fileHash ||
          data.file_hash ||
          data.sha256 ||
          data.hash ||
          "",

        sha256:
          data.sha256 ||
          data.fileHash ||
          data.file_hash ||
          data.hash ||
          "",

        blockchainHash:
          data.blockchainHash ||
          data.blockchain_hash ||
          data.hash ||
          "",

        previousHash:
          data.previousHash ||
          data.previous_hash ||
          "",

        blockIndex:
          data.blockIndex ??
          data.block_index ??
          data.index ??
          "",

        index:
          data.index ??
          data.blockIndex ??
          data.block_index ??
          "",

        hash:
          data.hash ||
          data.blockchainHash ||
          data.blockchain_hash ||
          "",

        rawResponse: data,
      };

      localStorage.setItem(
        "verificationResult",
        JSON.stringify(resultData)
      );

      navigate("/result", {
        state: resultData,
      });
    } catch (err) {
      console.error(err);

      setError(
        "Verification server is not reachable. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-layout">

      {/* SIDEBAR */}
      <aside className="verify-sidebar">

        <div className="verify-brand">
          <div className="verify-brand-icon">✓</div>

          <div>
            <strong>Blockchain</strong>
            <span>Certificate Validator</span>
          </div>
        </div>

        <nav className="verify-nav">

          <button onClick={() => navigate("/")}>
            <span>⌂</span>
            Home
          </button>

          <button onClick={() => navigate("/upload")}>
            <span>⇧</span>
            Upload Marksheet
          </button>

          <button className="verify-active">
            <span>◇</span>
            Verify Marksheet
          </button>

          <button onClick={() => navigate("/admin")}>
            <span>♙</span>
            Admin
          </button>

        </nav>

        <div className="verify-sidebar-bottom">
          <div>
            Secure&nbsp; • &nbsp;Transparent&nbsp; • &nbsp;Trusted
          </div>

          <div className="verify-cubes">
            <span>◆</span>
            <span>◆</span>
            <span>◆</span>
            <span>◆</span>
          </div>
        </div>

      </aside>

      {/* MAIN */}
      <main className="verify-main">

        <header className="verify-topbar">

          <div></div>

          <div className="verify-admin">
            <div>A</div>
            <strong>Admin</strong>
            <span>⌄</span>
          </div>

        </header>

        <section className="verify-content">

          {/* PAGE HEADING */}
          <div className="verify-heading">

            <div>CERTIFICATE VERIFICATION</div>

            <h1>Verify Marksheet</h1>

            <p>
              Review the uploaded marksheet and start secure AI verification.
            </p>

          </div>

          <div className="verify-grid">

            {/* LEFT CARD */}
            <div className="verify-main-card">

              <div className="verify-card-heading">

                <div className="verify-check">
                  ✓
                </div>

                <div>
                  <h2>Ready for Verification</h2>

                  <p>
                    Your marksheet is ready to be analyzed.
                  </p>
                </div>

              </div>

              {/* STUDENT NAME */}
              <div className="verify-name-section">

                <label>STUDENT NAME</label>

                <input
                  type="text"
                  placeholder="Enter student name"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    setError("");
                  }}
                />

              </div>

              {/* SELECTED FILE */}
              <div className="verify-selected-file">

              <div className="verify-file-icon">
                                         {previewUrl ? (
                                          <img
                                                  src={previewUrl}
                                                  alt="Uploaded Marksheet"
                                                   style={{
                                                       width: "70px",
                                                        height: "90px",
                                                         objectFit: "cover",
                                                           borderRadius: "8px",
                                                       }}
                                                   />
                                                ) : (
                                                   "📄"
                                                  )}
                                    </div>

                <div className="verify-file-details">

                  <label>SELECTED MARKSHEET</label>

                  <strong>
                    {certificate
                      ? certificate.name
                      : "No marksheet selected"}
                  </strong>

                  {certificate && (
                    <span>
                      {(certificate.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  )}

                </div>

                {certificate && (
                  <button
                    onClick={removeFile}
                    type="button"
                  >
                    ×
                  </button>
                )}

              </div>

              {/* CHANGE FILE */}
              <label className="change-file-btn">

                ⇧ &nbsp; Change Marksheet

                <input
                                             type="file"
                                              accept=".jpg,.jpeg,.png"
                                               onChange={handleFileChange}
                                      />
              </label>

              {/* VERIFICATION PROCESS */}
              <h3 className="process-title">
                Verification Process
              </h3>

              <div className="verification-process">

                <div className="process-item">

                  <div className="process-number">
                    01
                  </div>

                  <div>
                    <strong>
                                                      ResNet18 AI Detection
                     </strong>

                    <span>
                      Analyze the marksheet and detect original or fake.
                    </span>
                  </div>

                </div>

                <div className="process-item">

                  <div className="process-number">
                    02
                  </div>

                  <div>
                    <strong>
                      SHA-256 Hashing
                    </strong>

                    <span>
                      Generate a unique digital fingerprint.
                    </span>
                  </div>

                </div>

                <div className="process-item">

                  <div className="process-number">
                    03
                  </div>

                  <div>
                    <strong>
                      Blockchain Verification
                    </strong>

                    <span>
                      Store the verification record securely.
                    </span>
                  </div>

                </div>

              </div>

              {/* ERROR */}
              {error && (
                <div className="verify-error">
                  {error}
                </div>
              )}

              {/* VERIFY BUTTON */}
              <button
                className="verify-button"
                onClick={verifyMarksheet}
                disabled={loading}
              >
                {loading
                  ? "Verifying..."
                  : "✓ Verify Marksheet →"}
              </button>

            </div>

            {/* RIGHT CARD */}
            <div className="verify-guide-card">

              <div className="guide-image">
                📄
                <span>✓</span>
              </div>

              <h2>
                Verification Guide
              </h2>

              <p>
                Our system checks your marksheet through
                three security layers.
              </p>

              <div className="guide-item">

                <div>01</div>

                <section>
                  <strong>
                    AI Analysis
                  </strong>

                  <span>
                     ResNet18 model checks document authenticity.
                  </span>
                </section>

              </div>

              <div className="guide-item">

                <div>02</div>

                <section>
                  <strong>
                    Digital Hash
                  </strong>

                  <span>
                    SHA-256 protects the document fingerprint.
                  </span>
                </section>

              </div>

              <div className="guide-item">

                <div>03</div>

                <section>
                  <strong>
                    Blockchain Record
                  </strong>

                  <span>
                    Verification details become tamper-evident.
                  </span>
                </section>

              </div>

              <div className="guide-security">

                🔐 <strong>
                  Secure Verification
                </strong>

                <span>
                  AI + SHA-256 + Blockchain
                </span>

              </div>

            </div>

          </div>

          {/* SECURITY STRIP */}
          <div className="verify-security-strip">

            <div>
              <strong>
                🤖 AI Powered
              </strong>

              <span>
                 ResNet18 certificate classification
              </span>
            </div>

            <div>
              <strong>
                🔐 SHA-256 Secure
              </strong>

              <span>
                Unique document fingerprint
              </span>
            </div>

            <div>
              <strong>
                ⛓ Blockchain Stored
              </strong>

              <span>
                Tamper-evident verification record
              </span>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default VerifyCertificate;