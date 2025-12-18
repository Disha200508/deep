const express = require("express");
const Chat = require("../models/chat");
const auth = require("../middleware/auth");

const router = express.Router();

/* SAVE CHAT */
router.post("/save", auth, async (req, res) => {
  const { messages } = req.body;

  const chat = await Chat.findOneAndUpdate(
    { userId: req.user.userId },
    { messages },
    { upsert: true, new: true }
  );

  res.json(chat);
});

/* LOAD CHAT */
router.get("/load", auth, async (req, res) => {
  const chat = await Chat.findOne({ userId: req.user.userId });
  res.json(chat || { messages: [] });
});

module.exports = router;
