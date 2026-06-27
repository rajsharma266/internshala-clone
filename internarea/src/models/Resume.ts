import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    name: String,
    qualification: String,
    experience: String,
    personalInfo: String,
    photo: String,
    resumeUrl: String,
  },
  { timestamps: true }
);

export default mongoose.models.Resume ||
  mongoose.model("Resume", ResumeSchema);