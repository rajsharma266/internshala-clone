const mongoose = require("mongoose");
const Internshipschema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  category: String,
  aboutCompany: String,
  aboutInternship: String,
  whoCanApply: String,
  perks: mongoose.Schema.Types.Mixed,
  numberOfOpening: String,
  stipend: String,
  startDate: String,
  additionalInfo: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports=mongoose.model("Internship",Internshipschema)
