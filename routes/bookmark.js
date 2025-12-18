const express = require("express");
const Bookmark = require("../models/bookmark");
const auth = require("../middleware/auth");

const router = express.Router();

/* SAVE BOOKMARK */
router.post("/", auth, async (req, res) => {
  const { question, answer } = req.body;

  const bookmark = await Bookmark.create({
    userId: req.user.userId,
    question,
    answer,
  });

  res.json(bookmark);
});

/* GET USER BOOKMARKS */
router.get("/", auth, async (req, res) => {
  const bookmarks = await Bookmark.find({
    userId: req.user.userId,
  }).sort({ createdAt: -1 });

  res.json(bookmarks);
});

module.exports = router;
