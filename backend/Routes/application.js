const express = require("express");
const router = express.Router();
const application = require("../Model/Application");
const Subscription = require("../Model/Subscription");

const validStatusUpdaterRoles = new Set(["company", "recruiter"]);

const getEffectiveApplicationStatus = (applicationData = {}) => {
  const normalizedStatus =
    applicationData.status?.toLowerCase() === "approved"
      ? "accepted"
      : applicationData.status?.toLowerCase() || "pending";

  if (!["accepted", "pending", "rejected"].includes(normalizedStatus)) {
    return "pending";
  }

  if (normalizedStatus === "pending") {
    return "pending";
  }

  const updatedByRole = applicationData.statusUpdatedByRole?.toLowerCase() || "";

  return validStatusUpdaterRoles.has(updatedByRole)
    ? normalizedStatus
    : "pending";
};

const toReadonlyApplication = (applicationData) => {
  const plainApplication =
    typeof applicationData.toObject === "function"
      ? applicationData.toObject()
      : applicationData;

  return {
    ...plainApplication,
    status: getEffectiveApplicationStatus(plainApplication),
  };
};

router.post("/", async (req, res) => {
  try {
    const userEmail = req.body?.user?.email;

    if (!userEmail) {
      return res
        .status(400)
        .json({ error: "User email is required to submit an application" });
    }

    const subscription =
      (await Subscription.findOne({ userEmail, active: true })) || {
        applicationLimit: 1,
      };

    if (Number.isFinite(subscription.applicationLimit)) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const monthlyApplications = await application.countDocuments({
        "user.email": userEmail,
        createdAt: { $gte: startOfMonth },
      });

      if (monthlyApplications >= subscription.applicationLimit) {
        return res.status(403).json({
          error: "Your current subscription application limit has been reached",
        });
      }
    }

    const applicationData = await application.create({
      company: req.body.company,
      category: req.body.category,
      coverLetter: req.body.coverLetter,
      user: req.body.user,
      Application: req.body.Application,
      availability: req.body.availability,
      status: "pending",
    });

    return res.status(201).json(toReadonlyApplication(applicationData));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
});
router.get("/", async (req, res) => {
  try {
    const data = await application.find();
    return res.status(200).json(data.map(toReadonlyApplication));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await application.findById(id);
    if (!data) {
      return res.status(404).json({ error: "application not found" });
    }
    return res.status(200).json(toReadonlyApplication(data));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
});
router.put("/:id", async (req, res) => {
  return res.status(403).json({
    error:
      "Application status cannot be changed from the platform admin panel",
  });
});
module.exports = router;
