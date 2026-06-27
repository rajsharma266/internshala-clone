const express = require("express");
const router = express.Router();
const Internship = require("../Model/Internship");

router.post("/", async (req, res) => {
  try {
    const internshipData = await Internship.create({
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      category: req.body.category,
      aboutCompany: req.body.aboutCompany,
      aboutInternship: req.body.aboutInternship,
      whoCanApply: req.body.whoCanApply,
      perks: req.body.perks,
      numberOfOpening: req.body.numberOfOpening,
      stipend: req.body.stipend,
      startDate: req.body.startDate,
      additionalInfo: req.body.additionalInfo,
    });

    return res.status(201).json(internshipData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
});
router.get("/", async (req, res) => {
  try {
    const data = await Internship.find();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Internship.findById(id);
    if (!data) {
      return res.status(404).json({ error: "internship not found" });
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
    const updatedInternship = await Internship.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        category: req.body.category,
        aboutCompany: req.body.aboutCompany,
        aboutInternship: req.body.aboutInternship,
        whoCanApply: req.body.whoCanApply,
        perks: req.body.perks,
        numberOfOpening: req.body.numberOfOpening,
        stipend: req.body.stipend,
        startDate: req.body.startDate,
        additionalInfo: req.body.additionalInfo,
      },
      { new: true, runValidators: true }
    );

    if (!updatedInternship) {
      return res.status(404).json({ error: "internship not found" });
    }

    return res.status(200).json(updatedInternship);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedInternship = await Internship.findByIdAndDelete(id);

    if (!deletedInternship) {
      return res.status(404).json({ error: "internship not found" });
    }

    return res.status(200).json({ message: "internship deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
});
module.exports = router;
