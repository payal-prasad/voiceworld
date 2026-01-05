const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "64fb9cce-2afc-434a-afc1-838f7c2c99d4";
const SECRET_KEY =
  "56c5562b18d989267582c6a905a569768afbdee058ac5d7b820f879e47a3724c";

app.get("/get-token", (req, res) => {
  const options = {
    expiresIn: "120m",
    algorithm: "HS256",
  };

  const payload = {
    apikey: API_KEY,
    permissions: ["allow_join", "allow_mod"],
  };

  const token = jwt.sign(payload, SECRET_KEY, options);
  res.json({ token });
});

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Auth server is running on http://localhost:${PORT}`);
  console.log(`Token endpoint: http://localhost:${PORT}/get-token`);
});
