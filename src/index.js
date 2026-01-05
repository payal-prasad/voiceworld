require("dotenv").config();
const express = require("express");
const { sequelize } = require("./config/database");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger');

const app = express();
app.use(express.json());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/meetings", require("./routes/meetingRoutes"));

// swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("Voice World backend running");
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

       await sequelize.sync({ alter: true });
      console.log('Database synced');

    app.listen(process.env.PORT || 3000, () => {
      console.log("Server started on port 3000");
    });
  } catch (err) {
    console.error("Server startup failed:", err.message);
  }
})();
