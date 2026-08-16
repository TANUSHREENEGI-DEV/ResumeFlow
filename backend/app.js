require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("./middleware/logger");
const routes = require("./routes");

const app = express();

// Middleware: runs before every route
app.use(cors({
  origin: "http://localhost:4200",
  credentials: true
}));
app.use(express.json());
app.use(logger);

// All our routes live under /api
app.use("/api", routes);
app.use((req, res) => {
  res.status(404).json({ error: "route not found" });
});

// Global error handler: catches any error thrown in routes/controllers
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "something went wrong" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`resume-api running at http://localhost:${PORT}`);
});

module.exports = app;