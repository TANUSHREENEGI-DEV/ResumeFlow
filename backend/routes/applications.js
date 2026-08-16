// routes/applications.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/applicationController");
const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken);

router.get("/", controller.list);
router.post("/", controller.create);
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
