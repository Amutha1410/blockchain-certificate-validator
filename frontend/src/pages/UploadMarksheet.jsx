import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UploadMarksheet.css";

function UploadMarksheet() {
  const navigate = useNavigate();

  const [studentName, setStudentName] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------
  // FILE VALIDATION
  // -----------------------------
  const validateFile = (file) => {
    if (!file) return false;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload JPG, PNG or PDF file.");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB.");
      return false;
    }

    setError("");
    return true;
  };

  // -----------------------------
  // HANDLE FILE
  // -----------------------------
  const handleFile = (file) => {
    if (validateFile(file)) {
      setCertificate(file);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      handleFile(file);
    }
  };

  // -----------------------------
  // DRAG & DROP
  // -----------------------------
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files[0];

    if (file) {
      handleFile(file);
    }
  };

  // -----------------------------
  // REMOVE FILE
  // -----------------------------
  const removeFile = () => {
    setCertificate(null);
    setError("");
  };

  // -----------------------------
  // CONTINUE TO VERIFY
  // -----------------------------
  const continueToVerify = () => {
    if (!studentName.trim()) {
      setError("Please enter student name.");
      return;
    }

    if (!certificate) {
      setError("Please select a marksheet.");
      return;
    }

    navigate("/verify", {
      state: {
        uploadedFile: certificate,
        uploadedFileName: certificate.name,
        studentName: studentName.trim(),
      },
    });
  };

  return (
    <div className="ref-upload-layout">

      {/* =====================================
          SIDEBAR
      ====================================== */}
      <aside className="ref-upload-sidebar">

        {/* BRAND */}
        <div className="ref-brand">

          <div className="ref-brand-icon">
            ✓
          </div>

          <div>
            <strong>Blockchain</strong>
            <span>Certificate Validator</span>
          </div>

        </div>


        {/* NAVIGATION */}
        <nav className="ref-sidebar-nav">

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            <span>⌂</span>
            Home
          </button>


          <button
            type="button"
            className="ref-active"
            onClick={() => navigate("/upload")}
          >
            <span>⇧</span>
            Upload Marksheet
          </button>


          <button
            type="button"
            onClick={() => navigate("/verify")}
          >
            <span>◇</span>
            Verify Marksheet
          </button>


          <button
            type="button"
            onClick={() => navigate("/admin")}
          >
            <span>♙</span>
            Admin
          </button>

        </nav>


        {/* SIDEBAR BOTTOM */}
        <div className="ref-sidebar-bottom">

          <div>
            Secure&nbsp; • &nbsp;Transparent&nbsp; • &nbsp;Trusted
          </div>

          <div className="ref-cubes">
            <span>◆</span>
            <span>◆</span>
            <span>◆</span>
          </div>

        </div>

      </aside>


      {/* =====================================
          MAIN CONTENT
      ====================================== */}
      <main className="ref-upload-main">


        {/* TOP BAR */}
        <header className="ref-topbar">

          <div></div>

          <div className="ref-admin">

            <div className="ref-admin-avatar">
              A
            </div>

            <strong>Admin</strong>

            <span>⌄</span>

          </div>

        </header>


        {/* PAGE CONTENT */}
        <section className="ref-upload-content">


          {/* =================================
              PAGE HEADING
          ================================= */}
          <div className="ref-upload-heading">

            <div className="ref-small-title">
              MARKSHEET UPLOAD
            </div>

            <h1>
              Upload Marksheet
            </h1>

            <p>
              Select and upload your marksheet for secure AI-powered verification.
            </p>

          </div>


          {/* =================================
              TWO COLUMN LAYOUT
          ================================= */}
          <div className="ref-upload-grid">


            {/* =================================
                LEFT - UPLOAD CARD
            ================================= */}
            <div className="ref-upload-card">


              {/* CARD HEADER */}
              <div className="ref-card-heading">

                <div>

                  <h2>
                    Upload Marksheet
                  </h2>

                  <p>
                    Select and upload your marksheet image or PDF.
                  </p>

                </div>


                <div className="ref-upload-icon">
                  ⇧
                </div>

              </div>


              {/* STUDENT NAME */}
              <div className="ref-name-field">

                <label>
                  STUDENT NAME
                </label>

                <input
                  type="text"
                  placeholder="Enter student name"
                  value={studentName}
                  onChange={(event) => {
                    setStudentName(event.target.value);
                    setError("");
                  }}
                />

              </div>


              {/* =================================
                  DROP AREA
              ================================= */}
              <label
                className={
                  dragActive
                    ? "ref-drop-area ref-drag-active"
                    : "ref-drop-area"
                }
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                />


                <div className="ref-cloud-icon">
                  ☁
                </div>


                <h3>
                  Drag &amp; drop your marksheet here
                </h3>


                <span>
                  or
                </span>


                <strong>
                  Choose File
                </strong>


                <small>
                  Supported formats: JPG, PNG, PDF &nbsp; | &nbsp; Max size: 5MB
                </small>

              </label>


              {/* =================================
                  SELECTED FILE
              ================================= */}
              {certificate && (

                <div className="ref-selected-file">

                  <div className="ref-file-preview">
                    📄
                  </div>


                  <div className="ref-file-info">

                    <strong>
                      {certificate.name}
                    </strong>

                    <span>
                      {(certificate.size / (1024 * 1024)).toFixed(2)} MB
                    </span>

                  </div>


                  <button
                    type="button"
                    onClick={removeFile}
                    title="Remove file"
                  >
                    ×
                  </button>

                </div>

              )}


              {/* ERROR */}
              {error && (

                <div className="ref-upload-error">
                  {error}
                </div>

              )}


              {/* =================================
                  UPLOAD BUTTON
              ================================= */}
              <button
                type="button"
                className="ref-upload-button"
                onClick={continueToVerify}
              >
                Upload &amp; Verify&nbsp; →
              </button>

            </div>


            {/* =================================
                RIGHT - TIPS CARD
            ================================= */}
            <div className="ref-tips-card">


              {/* VISUAL */}
              <div className="ref-tips-image">

                <div className="ref-document-art">
                  📄
                </div>

                <div className="ref-arrow-art">
                  ↑
                </div>

              </div>


              <h2>
                Tips for Best Results
              </h2>


              {/* TIP 1 */}
              <div className="ref-tip">

                <b>✓</b>

                <span>
                  Use clear and high-resolution
                  <br />
                  marksheet images.
                </span>

              </div>


              {/* TIP 2 */}
              <div className="ref-tip">

                <b>✓</b>

                <span>
                  Make sure the full document
                  <br />
                  is visible.
                </span>

              </div>


              {/* TIP 3 */}
              <div className="ref-tip">

                <b>✓</b>

                <span>
                  Supported formats: JPG, PNG
                  <br />
                  and PDF.
                </span>

              </div>


              {/* TIP 4 */}
              <div className="ref-tip">

                <b>✓</b>

                <span>
                  File size should be less
                  <br />
                  than 5MB.
                </span>

              </div>

            </div>

          </div>


          {/* =================================
              SECURITY STRIP
          ================================= */}
          <div className="ref-upload-security">

            <div>

              <b>
                01 &nbsp; Upload
              </b>

              <span>
                Select your marksheet
              </span>

            </div>


            <div>

              <b>
                02 &nbsp; YOLO AI
              </b>

              <span>
                Analyze document authenticity
              </span>

            </div>


            <div>

              <b>
                03 &nbsp; SHA-256
              </b>

              <span>
                Create secure document hash
              </span>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default UploadMarksheet;