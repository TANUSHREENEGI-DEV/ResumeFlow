const db = require("../db");

function mockAuth(req, res, next) {
  const user = db.data.users.find((u) => u.id === "u1");

  if (!user) {
    return res.status(401).json({ error: "seed user not found" });
  }

  req.user = user;
  next();
}

module.exports = mockAuth;
