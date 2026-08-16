const db = require("../db");

function findAllByUser(userId) {
  return db.data.shares.filter(function (s) {
    return s.userId === userId;
  });
}

function findBySlug(slug) {
  return db.data.shares.find(function (s) {
    return s.slug === slug;
  });
}

function findById(id, userId) {
  return db.data.shares.find(function (s) {
    return s.id === id && s.userId === userId;
  });
}

function create(shareData) {
  const now = new Date().toISOString();
  const newShare = {
    id: db.makeId("share"),
    createdAt: now,
    ...shareData
  };
  db.data.shares.push(newShare);
  db.save();
  return newShare;
}

function remove(id, userId) {
  const before = db.data.shares.length;
  db.data.shares = db.data.shares.filter(function (s) {
    return !(s.id === id && s.userId === userId);
  });
  return db.data.shares.length !== before;
}

module.exports = { findAllByUser, findBySlug, findById, create, remove };