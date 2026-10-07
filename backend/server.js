require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("dns");

const certificateRoutes = require("./routes/certificateRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/certificates", certificateRoutes);

// DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Home Route
app.get("/", (req, res) => {
  res.send("Blockchain Certificate Validator Backend Running");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});