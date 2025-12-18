require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const chatStorageRoutes = require("./routes/chats");
const bookmarkRoutes = require("./routes/bookmark");
const app = express();
/* middleware */
app.use(cors());
app.use(express.json());

/* routes */
app.use("/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/chats", chatStorageRoutes);
app.use("/api/bookmarks",bookmarkRoutes);
app.get("/health", (req, res) => {
  res.json({ status: "Backend is running fine ✅" });
});

app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});

/* MongoDB */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err.message));

/* server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
