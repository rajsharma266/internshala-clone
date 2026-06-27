const path = require("path");
const bodyparser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const { connect } = require("./db");
const router = require("./Routes/index");
require("dotenv").config({
  path: path.resolve(__dirname, "../internarea/.env"),
});
require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
});
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyparser.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello this is internshala backend");
});
app.use("/api", router);

const startServer = async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`Server is running on the port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error.message);
    process.exit(1);
  }
};

startServer();
