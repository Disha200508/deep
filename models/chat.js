const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userId: String,
  conversations: Array,
});

module.exports =
  mongoose.models.Chat || mongoose.model("Chat", chatSchema);
