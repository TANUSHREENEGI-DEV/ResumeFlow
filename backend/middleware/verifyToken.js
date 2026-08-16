const jwt = require("jsonwebtoken");
const db = require("../db");

const SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "no token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    const user = db.data.users.find(function (u) {
      return u.id === decoded.id;
    });

    if (!user) {
      return res.status(401).json({ error: "user not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "invalid or expired token" });
  }
}

module.exports = verifyToken;