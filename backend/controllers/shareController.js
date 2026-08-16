const shareModel = require("../models/shareModel");
const documentModel = require("../models/documentModel");
const db = require("../db");

function list(req, res) {
  res.status(200).json(shareModel.findAllByUser(req.user.id));
}

function create(req, res) {
  const documentId = req.body.documentId;

  if (!documentId) {
    return res.status(400).json({ error: "documentId is required" });
  }

  const doc = documentModel.findById(documentId, req.user.id);
  if (!doc) {
    return res.status(404).json({ error: "document not found" });
  }

  const slug = doc.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + db.makeId("").slice(1, 7);

  const newShare = shareModel.create({
    userId: req.user.id,
    documentId: doc.id,
    documentTitle: doc.title,
    slug: slug
  });

  res.status(201).json(newShare);
}

function remove(req, res) {
  const removed = shareModel.remove(req.params.id, req.user.id);
  if (!removed) {
    return res.status(404).json({ error: "share not found" });
  }
  res.status(204).send();
}

module.exports = { list, create, remove };