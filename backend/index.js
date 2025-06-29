const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "inventory.json");

app.use(cors());
app.use(express.json());

// Get all inventory items
app.get("/api/inventory", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read data" });
    res.json(JSON.parse(data));
  });
});

// Get a single item by id
app.get("/api/inventory/:id", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read data" });
    const items = JSON.parse(data);
    const item = items.find((i) => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  });
});

// Add a new item
app.post("/api/inventory", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read data" });
    const items = JSON.parse(data);
    const newItem = { ...req.body, id: Date.now() };
    items.push(newItem);
    fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to save data" });
      res.status(201).json(newItem);
    });
  });
});

// Update an item
app.put("/api/inventory/:id", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read data" });
    let items = JSON.parse(data);
    const idx = items.findIndex((i) => i.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: "Item not found" });
    items[idx] = { ...items[idx], ...req.body };
    fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to save data" });
      res.json(items[idx]);
    });
  });
});

// Delete an item
app.delete("/api/inventory/:id", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read data" });
    let items = JSON.parse(data);
    const idx = items.findIndex((i) => i.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: "Item not found" });
    const deleted = items.splice(idx, 1);
    fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to save data" });
      res.json(deleted[0]);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
