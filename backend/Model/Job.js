const mongoose = require("mongoose");
const JobShcema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  Experience: String,
  category: String,
  aboutCompany: String,
  aboutJob: String,
  whoCanApply: String,
  perks: mongoose.Schema.Types.Mixed,
  AdditionalInfo: String,
  CTC: String,
  StartDate: String,
  startDate: String,
  numberOfOpening: String,
  createAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Job", JobShcema);
