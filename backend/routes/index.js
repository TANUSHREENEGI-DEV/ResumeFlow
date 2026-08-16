const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/users", require("./users"));
router.use("/documents", require("./documents"));
router.use("/templates", require("./templates"));
router.use("/ai", require("./ai"));
router.use("/applications", require("./applications"));
router.use("/dashboard", require("./dashboard"));
router.use("/shares", require("./shares"));
module.exports = router;
