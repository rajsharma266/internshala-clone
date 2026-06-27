const express = require("express");
const router = express.Router();
const adminuser = "admin";
const adminpass = "admin";

router.post("/adminlogin", (req, res) => {
  const { username, password } = req.body;
  if (username === adminuser && password === adminpass) {
    return res.status(200).json({
      message: "admin is here",
      admin: {
        username: username || adminuser,
        role: "admin",
      },
    });
  } else {
    return res.status(401).json({ message: "unauthorized" });
  }
});
module.exports = router;
