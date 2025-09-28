require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const notesRouter = require("./routes/notes");
const supabaseAuth = require("./middleware/supabaseAuth"); // ✅ Import middleware

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());

// ✅ Use frontend origin from env
const allowedOrigin = process.env.FRONTEND_URL;
app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Public health check
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Notes API is running 🚀" });
});

// Protected routes (require login)
app.use("/notes", notesRouter);

app.use("/notes", supabaseAuth, notesRouter); // ✅ Added auth middleware here

// Start server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

