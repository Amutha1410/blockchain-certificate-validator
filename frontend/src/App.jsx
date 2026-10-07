import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import UploadMarksheet from "./pages/UploadMarksheet";
import VerifyCertificate from "./pages/VerifyCertificate";
import Result from "./pages/Result";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/upload"
          element={<UploadMarksheet />}
        />

        <Route
          path="/verify"
          element={<VerifyCertificate />}
        />

        <Route
          path="/result"
          element={<Result />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;