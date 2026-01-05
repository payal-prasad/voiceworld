const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const routes = require("./routes");
const swagger = require("./swagger/swagger");
const config = require("./config");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api", routes);
swagger(app);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
