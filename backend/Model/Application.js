const mongoose = require("mongoose");
const Applicationipschema = new mongoose.Schema({
  company: String,
  category: String,
  coverLetter: String,
  user: Object,
  availability: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["accepted", "pending", "rejected"],
    default: "pending",
  },
  statusUpdatedByRole: {
    type: String,
    enum: ["company", "recruiter"],
    required: false,
  },
  statusUpdatedAt: {
    type: Date,
    required: false,
  },
  Application: Object,
});
module.exports = mongoose.model("Application", Applicationipschema);
