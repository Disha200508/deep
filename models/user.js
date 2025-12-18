const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const ChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messages: [
    {
      from: String,   // "user" | "bot"
      text: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

module.exports =
  mongoose.models.Chat || mongoose.model("Chat", ChatSchema,UserSchema);
