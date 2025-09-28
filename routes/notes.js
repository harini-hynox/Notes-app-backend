const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const supabaseAuth = require("../middleware/supabaseAuth");
const mongoose = require("mongoose");

// Create Note
router.post("/", supabaseAuth, async (req, res) => {
  try {
    const { content, color } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });

    const note = new Note({
      userId: req.user.id,
      content,
      color,
    });

    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all notes for logged-in user
router.get("/", supabaseAuth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update Note
router.put("/:id", supabaseAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { content, color } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid note ID" });
    }

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    if (note.userId !== req.user.id) return res.status(403).json({ error: "Not allowed" });

    if (content !== undefined) note.content = content;
    if (color !== undefined) note.color = color;

    await note.save();
    res.json(note);
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete Note
router.delete("/:id", supabaseAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid note ID" });
    }

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    if (note.userId !== req.user.id) return res.status(403).json({ error: "Not allowed" });

    await note.deleteOne();
    res.json({ success: true, message: "Note deleted successfully" });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
