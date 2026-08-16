const db = require("../db");

function getSummary(req, res) {
  const userId = req.user.id;

  const userDocuments = db.data.documents.filter(function (d) {
    return d.userId === userId;
  });

  const userApplications = db.data.applications.filter(function (a) {
    return a.userId === userId;
  });

  var savedVersionsCount = 0;
  userDocuments.forEach(function (doc) {
    if (doc.versions) {
      savedVersionsCount = savedVersionsCount + doc.versions.length;
    }
  });

  const exportsCount = db.data.exports.filter(function (e) {
    return e.userId === userId;
  }).length;

  const recentDocuments = userDocuments
    .slice()
    .sort(function (a, b) {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    })
    .slice(0, 3);

  const statuses = ["saved", "applied", "interview", "offer", "rejected"];
  const pipeline = statuses.map(function (status) {
    const count = userApplications.filter(function (a) {
      return a.status === status;
    }).length;
    return { status: status, count: count };
  });

  res.status(200).json({
    documents: userDocuments.length,
    applications: userApplications.length,
    savedVersions: savedVersionsCount,
    exports: exportsCount,
    recentDocuments: recentDocuments,
    pipeline: pipeline
  });
}

module.exports = { getSummary };