const express = require("express");
const router = express.Router();

const Job = require("../Model/Job");

router.post("/", async (req, res) => {
  try {
    const jobData = await Job.create({
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      Experience: req.body.Experience || req.body.experience || "",
      category: req.body.category,
      aboutCompany: req.body.aboutCompany,
      aboutJob: req.body.aboutJob,
      whoCanApply: req.body.whoCanApply,
      perks: req.body.perks,
      AdditionalInfo: req.body.AdditionalInfo || req.body.additionalInfo,
      CTC: req.body.CTC,
      StartDate: req.body.StartDate || req.body.startDate,
      startDate: req.body.startDate || req.body.StartDate,
      numberOfOpening: req.body.numberOfOpening,
    });

    return res.status(201).json(jobData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await Job.find().sort({ createAt: -1 });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Job.findById(id);
    if (!data) {
      return res.status(404).json({ error: "Jobs not found" });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
});
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        Experience: req.body.Experience || req.body.experience || "",
        category: req.body.category,
        aboutCompany: req.body.aboutCompany,
        aboutJob: req.body.aboutJob,
        whoCanApply: req.body.whoCanApply,
        perks: req.body.perks,
        AdditionalInfo: req.body.AdditionalInfo || req.body.additionalInfo,
        CTC: req.body.CTC,
        StartDate: req.body.StartDate || req.body.startDate,
        startDate: req.body.startDate || req.body.StartDate,
        numberOfOpening: req.body.numberOfOpening || req.body.openings,
      },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ error: "Jobs not found" });
    }

    return res.status(200).json(updatedJob);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({ error: "Jobs not found" });
    }

    return res.status(200).json({ message: "job deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
});
module.exports=router
