const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({

  studentName: {
    type: String,
    required: true,
  },

  courseName: {
    type: String,
    required: true,
  },

  certificateId: {
    type: String,
    required: true,
    unique: true,
  },

  issueDate: {
    type: Date,
    required: true,
  },

  issuer: {
    type: String,
    required: true,
  },

  // Uploaded certificate file path
  certificateFile: {
    type: String,
    required: true,
  },

  // SHA-256 hash value
  certificateHash: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "Valid",
  },

});

module.exports = mongoose.model("Certificate", certificateSchema);