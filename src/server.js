const app = require("./app");
const { sequelize, setupAssociations } = require("./models");
const config = require("./config");
const http = require("http");

// Create HTTP server for Express app (REST APIs + Swagger) on port 4000
const httpServer = http.createServer(app);

// sequelize
//   .sync({ force: true })
//   .then(() => {
// Setup associations AFTER sync to avoid FK constraints during table creation
setupAssociations();
httpServer.listen(config.port, () => {
  console.log(
    `🚀 HTTP Server (REST APIs + Swagger) running on http://localhost:${config.port}`
  );
  console.log(`📚 Swagger: http://localhost:${config.port}/api-docs`);
});
// })
// .catch((err) => console.error("DB error:", err));
