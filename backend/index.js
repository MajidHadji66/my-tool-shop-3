const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;
const db = new Database("inventory.db");

app.use(cors());
app.use(express.json());

// Create table if it doesn't exist (now includes price)
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    location TEXT,
    description TEXT,
    quantity INTEGER,
    price REAL
  )
  `
).run();

// Get all inventory items
app.get("/api/inventory", (req, res) => {
  const items = db.prepare("SELECT * FROM inventory").all();
  res.json(items);
});

// Get a single item by id
app.get("/api/inventory/:id", (req, res) => {
  const item = db
    .prepare("SELECT * FROM inventory WHERE id = ?")
    .get(req.params.id);
  if (!item) return res.status(404).json({ error: "Item not found" });
  res.json(item);
});

// Add a new item
app.post("/api/inventory", (req, res) => {
  const { name, type, location, description, quantity, price } = req.body;
  const stmt = db.prepare(
    "INSERT INTO inventory (name, type, location, description, quantity, price) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const info = stmt.run(name, type, location, description, quantity, price);
  const newItem = {
    id: info.lastInsertRowid,
    name,
    type,
    location,
    description,
    quantity,
    price,
  };
  res.status(201).json(newItem);
});

// Update an item
app.put("/api/inventory/:id", (req, res) => {
  const { name, type, location, description, quantity, price } = req.body;
  const stmt = db.prepare(
    "UPDATE inventory SET name=?, type=?, location=?, description=?, quantity=?, price=? WHERE id=?"
  );
  const info = stmt.run(
    name,
    type,
    location,
    description,
    quantity,
    price,
    req.params.id
  );
  if (info.changes === 0)
    return res.status(404).json({ error: "Item not found" });
  const updatedItem = db
    .prepare("SELECT * FROM inventory WHERE id = ?")
    .get(req.params.id);
  res.json(updatedItem);
});

// Delete an item
app.delete("/api/inventory/:id", (req, res) => {
  const stmt = db.prepare("DELETE FROM inventory WHERE id=?");
  const info = stmt.run(req.params.id);
  if (info.changes === 0)
    return res.status(404).json({ error: "Item not found" });
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
