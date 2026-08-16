const fs = require("fs");
const path = require("path");
const DATA_FILE = path.join(__dirname, "data.json");

function load() {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

let data = load();
let saveQueue = Promise.resolve();

function save() {
  saveQueue = saveQueue.then(function () {
    return new Promise(function (resolve, reject) {
      fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8", function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
  return saveQueue;
}

function makeId(prefix) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

module.exports = {
  get data() {
    return data;
  },
  save,
  makeId
};