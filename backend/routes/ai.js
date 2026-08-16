// routes/ai.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/aiController");
const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken);

router.post("/bullets", controller.improve);
router.post("/summary", controller.improve);
router.post("/rewrite", controller.improve);
router.post("/prompt", controller.improve);

module.exports = router;
