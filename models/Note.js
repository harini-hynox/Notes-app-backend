const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    content: { type: String, required: true },
    color: { type: String, default: "bg-yellow-200" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", NoteSchema);
