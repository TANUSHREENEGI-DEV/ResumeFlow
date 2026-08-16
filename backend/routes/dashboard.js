const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const dashboardController = require("../controllers/dashboardController");

router.use(verifyToken);
router.get("/", dashboardController.getSummary);

module.exports = router;