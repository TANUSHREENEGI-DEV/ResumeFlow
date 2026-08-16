const express = require("express");
const router = express.Router();
const controller = require("../controllers/shareController");
const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken);
router.get("/", controller.list);
router.post("/", controller.create);
router.delete("/:id", controller.remove);

module.exports = router;