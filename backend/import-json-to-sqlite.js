// Run this script ONCE to import inventory.json data into SQLite (with price)
// Usage: node import-json-to-sqlite.js

const fs = require("fs");
const Database = require("better-sqlite3");
const db = new Database("inventory.db");

const data = JSON.parse(fs.readFileSync("inventory.json", "utf8"));

const insert = db.prepare(
  "INSERT OR IGNORE INTO inventory (id, name, type, location, description, quantity, price) VALUES (?, ?, ?, ?, ?, ?, ?)"
);

db.transaction(() => {
  for (const item of data) {
    insert.run(
      item.id,
      item.name,
      item.type,
      item.location,
      item.description,
      item.quantity,
      item.price
    );
  }
})();

console.log("Import complete!");
