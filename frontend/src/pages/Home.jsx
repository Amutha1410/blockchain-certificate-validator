import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="reference-layout">

      {/* SIDEBAR */}
      <aside className="reference-sidebar">

        <div className="brand-box">
          <div className="brand-icon">✓</div>

          <div>
            <strong>Blockchain</strong>
            <span>Certificate Validator</span>
          </div>
        </div>

        <nav className="reference-nav">

          <button
            className="reference-nav-item active"
            onClick={() => navigate("/")}
          >
            <span>⌂</span>
            Home
          </button>

          <button
            className="reference-nav-item"
            onClick={() => navigate("/upload")}
          >
            <span>⇧</span>
            Upload Certificate
          </button>

          <button
            className="reference-nav-item"
            onClick={() => navigate("/verify")}
          >
            <span>◇</span>
            Verify Certificate
          </button>

          <button
            className="reference-nav-item"
            onClick={() => navigate("/admin")}
          >
            <span>♙</span>
            Admin
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="trust-line">
            <span>Secure</span>
            <b>•</b>
            <span>Transparent</span>
            <b>•</b>
            <span>Trusted</span>
          </div>

          <div className="cube-decoration">
            <div>◆</div>
            <div>◆</div>
            <div>◆</div>
            <div>◆</div>
          </div>

        </div>

      </aside>


      {/* MAIN */}
      <main className="reference-main">

        {/* TOPBAR */}
        <header className="reference-topbar">

          <div></div>

          <div className="reference-admin">

            <div className="admin-circle">
              A
            </div>

            <span>Admin</span>

            <span>⌄</span>

          </div>

        </header>


        {/* CONTENT */}
        <section className="reference-content">

          {/* HERO */}
          <div className="home-hero">

            <div className="hero-content">

              <div className="hero-badge">
                Blockchain + AI
              </div>

              <h1>
                Verify Whether a
                <br />

                <span>Certificate is Original</span>

                <br />

                or <span>Fake Using</span>

                <br />

                <span>Blockchain.</span>
              </h1>

              <p>
                Secure your education and career with
                transparent and tamper-proof verification.
              </p>


              {/* FEATURES */}
              <div className="hero-features">

                <div>
                  <span>◉</span>

                  <p>
                    AI Powered
                    <br />
                    Detection
                  </p>
                </div>

                <div>
                  <span>⬡</span>

                  <p>
                    Blockchain
                    <br />
                    Security
                  </p>
                </div>

                <div>
                  <span>✓</span>

                  <p>
                    Tamper Proof
                    <br />
                    Records
                  </p>
                </div>

              </div>


              {/* ACTION BUTTONS */}
              <div className="hero-actions">

                <button
                  className="hero-primary-btn"
                  onClick={() => navigate("/upload")}
                >
                  ⇧ &nbsp; Upload Certificate
                </button>

                <button
                  className="hero-secondary-btn"
                  onClick={() => navigate("/verify")}
                >
                  ◇ &nbsp; Verify Certificate
                </button>

              </div>

            </div>


            {/* CERTIFICATE VISUAL */}
            <div className="hero-visual">

              <div className="certificate-illustration">

                <div className="certificate-paper">

                  <div className="certificate-title">
                    CERTIFICATE
                  </div>

                  <div className="certificate-line"></div>

                  <div className="certificate-line short"></div>

                  <div className="certificate-line"></div>

                  <div className="certificate-seal">
                    ✓
                  </div>

                </div>

                <div className="shield-icon">
                  ✓
                </div>

                <div className="block block-one">
                  ◆
                </div>

                <div className="block block-two">
                  ◆
                </div>

                <div className="block block-three">
                  ◆
                </div>

              </div>

            </div>

          </div>


          {/* STAT CARDS */}
          <div className="home-stat-row">

            <div className="home-stat-card">

              <div className="stat-icon">
                ◇
              </div>

              <div>
                <strong>100%</strong>
                <span>Secure Verification</span>
              </div>

            </div>


            <div className="home-stat-card">

              <div className="stat-icon">
                ⬡
              </div>

              <div>
                <strong>Blockchain Stored</strong>
                <span>Immutable Records</span>
              </div>

            </div>


            <div className="home-stat-card">

              <div className="stat-icon">
                ◉
              </div>

              <div>
                <strong>AI Powered</strong>
                <span>Smart Detection</span>
              </div>

            </div>


            <div className="home-stat-card">

              <div className="stat-icon">
                ✓
              </div>

              <div>
                <strong>Trusted</strong>
                <span>For a Better Tomorrow</span>
              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Home;