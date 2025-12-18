// const express = require("express");
// const axios = require("axios");

// const router = express.Router();

// router.post("/chat", async (req, res) => {
//   const { query, persona } = req.body;

//   try {
//     const response = await axios.post("http://127.0.0.1:6000/ask", {
//       query,
//       persona
//     });

//     res.json(response.data);
//   } catch (error) {
//     console.error("Python AI error:", error.message);
//     res.status(500).json({ error: "AI service unavailable" });
//   }
// });

// module.exports = router;





//*

// const express = require("express");
// const axios = require("axios");

// const router = express.Router();

// router.post("/chat", async (req, res) => {
//   const { query } = req.body;

//   try {
//     const response = await axios.post(
//       "http://127.0.0.1:6000/ask",
//       { query }
//     );

//     res.json(response.data);
//   } catch (error) {
//     console.error("Python AI error:", error.message);
//     res.status(500).json({ error: "AI service unavailable" });
//   }
// });

// module.exports = router;




// const express = require("express");
// const axios = require("axios");

// const router = express.Router();

// router.post("/chat", async (req, res) => {
//   const { query } = req.body;

//   try {
//     const response = await axios.post(
//       "http://127.0.0.1:6000/ask",
//       { query }
//     );

//     res.json(response.data);
//   } catch (error) {
//     console.error("Python AI error:", error.message);
//     res.status(500).json({ error: "AI service unavailable" });
//   }
// });

// module.exports = router;



// const express = require("express");
// const axios = require("axios");

// const router = express.Router();

/**
 * POST /api/chat
 * Body: { query: string, persona?: string }
 */
const express = require("express");
const axios = require("axios");
const Chat = require("../models/chat");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const chat = await Chat.findOne({ userId: req.user.userId });
  res.json(chat || { conversations: [] });
});

router.post("/chat", async (req, res) => {
  try {
    const { query, persona, language } = req.body;

    if (!query) {
      return res.status(400).json({
        error: "Query is required",
      });
    }
     await Chat.findOneAndUpdate(
    { userId: req.user.userId },
    { conversations: req.body.conversations },
    { upsert: true }
  );
  res.json({ success: true });
    // Call Python AI server
    const response = await axios.post(
      "http://127.0.0.1:8000/ai",
      {
        query: query,
        persona: persona || "tourism",
        language,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // important
      }
    );

    return res.json({
      reply: response.data.reply,
    });
  } catch (error) {
    // 🔴 THIS LOG IS IMPORTANT
    console.error("AI SERVER ERROR:", error.message);

    return res.status(503).json({
      error: "AI service unavailable",
    });
  }
});


module.exports = router;