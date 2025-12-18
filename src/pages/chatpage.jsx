import { sendMessage } from "../services/chatService";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import ChatInput from "../components/chatinput";
import MessageBubble from "../components/messagebubble";
import "./chatpage.css";
import axios from "axios";



/* ---------- TEXT DICTIONARY ---------- */

const TEXT = {
  en: {
    appName: "DeepShiva",
    newChat: "+ New Chat",
    chat: "Chat",
    title: "DeepShiva Chat",
    subtitle: "Spiritual tourism assistant",
    greeting: "🙏 Namaste, I am DeepShiva. How can I assist you?",
    placeholder: "Ask about temples, meditation, yoga, or your spiritual journey...",
    serverError: "Server error",
    typing: "DeepShiva is typing...",
  },

  hi: {
    appName: "दीपशिवा",
    newChat: "+ नया चैट",
    chat: "चैट",
    title: "दीपशिवा चैट",
    subtitle: "आध्यात्मिक पर्यटन सहायक",
    greeting: "🙏 नमस्ते, मैं दीपशिवा हूँ। मैं आपकी कैसे सहायता कर सकता हूँ?",
    placeholder: "मंदिर, ध्यान, योग या आध्यात्मिक यात्रा के बारे में पूछें...",
    serverError: "सर्वर से कनेक्शन नहीं हो पाया",
    typing: "दीपशिवा लिख रहा है...",
  },

  bn: {
    appName: "দীপশিবা",
    newChat: "+ নতুন চ্যাট",
    chat: "চ্যাট",
    title: "দীপশিবা চ্যাট",
    subtitle: "আধ্যাত্মিক পর্যটন সহকারী",
    greeting: "🙏 নমস্কার, আমি দীপশিবা। আমি কীভাবে আপনাকে সাহায্য করতে পারি?",
    placeholder: "মন্দির, ধ্যান, যোগ বা আধ্যাত্মিক যাত্রা সম্পর্কে জিজ্ঞাসা করুন...",
    serverError: "সার্ভারের সাথে সংযোগ ব্যর্থ হয়েছে",
    typing: "দীপশিবা টাইপ করছে...",
  },

  mr: {
    appName: "दीपशिवा",
    newChat: "+ नवीन चॅट",
    chat: "चॅट",
    title: "दीपशिवा चॅट",
    subtitle: "आध्यात्मिक पर्यटन सहाय्यक",
    greeting: "🙏 नमस्कार, मी दीपशिवा आहे. मी तुम्हाला कशी मदत करू शकतो?",
    placeholder: "मंदिरे, ध्यान, योग किंवा आध्यात्मिक प्रवासाबद्दल विचारा...",
    serverError: "सर्व्हरशी कनेक्शन अयशस्वी",
    typing: "दीपशिवा टाइप करत आहे...",
  },
};


/* ---------- SUGGESTED QUESTIONS ---------- */
const SUGGESTIONS = {
  en: [
    "Tell me about Kedarnath temple",
    "Guide me a short meditation",
    "Best spiritual places in Uttarakhand",
    "Explain Mahashivratri",
  ],
  hi: [
    "केदारनाथ मंदिर के बारे में बताइए",
    "एक छोटा ध्यान अभ्यास बताइए",
    "उत्तराखंड के प्रमुख तीर्थ स्थल",
    "महाशिवरात्रि का महत्व समझाइए",
  ],
  bn:[
    "নিকটবর্তী শিব মন্দির",
    "ধ্যানের উপকারিতা",
    "যোগ আসন",
    "উত্তম তীর্থযাত্রার সময়",
  ],
  mr:[
    "जवळची शिव मंदिरे",
    "ध्यानाचे फायदे",
    "योग आसने",
    "तीर्थयात्रेसाठी सर्वोत्तम वेळ",
  ]
};


export default function ChatPage() {
  const [language, setLanguage] = useState("en");
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const [bookmarks, setBookmarks] = useState(
    JSON.parse(localStorage.getItem("ds_bookmarks")) || []
  );
  
const deleteBookmark = (id) => {
  setBookmarks((prev) => prev.filter((b) => b.id !== id));
};
<div className="bookmark-list">
  {bookmarks.map((bookmark) => (
    <div key={bookmark.id} className="bookmark-card">
      <p className="bookmark-q">
        <strong>Q:</strong> {bookmark.question}
      </p>

      <p className="bookmark-a">
        <strong>A:</strong> {bookmark.answer}
      </p>

      <button
        className="delete-btn"
        onClick={() => deleteBookmark(bookmark.id)}
      >
        🗑️ Delete
      </button>
    </div>
  ))}
</div>

  useEffect(() => {
    localStorage.setItem("ds_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // const addBookmark = (msg) => {
  //   setBookmarks((prev) => [...prev, msg]);
  // };
const toggleBookmark = async (botMessage, index) => {

  if (!botMessage?.text) return;
const active = conversations.find((c) => c.id === activeId);
if (!active) return;
const bookmarkId = `${activeId}_${index}`;

if (bookmarks.some((b) => b.id === bookmarkId)) {
    setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
    return;
  }

  const exists = bookmarks.find((b) => b.id === bookmarkId);

  // ❌ REMOVE bookmark
  if (exists) {
    setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
    return;
  }
    const userMsg = active.messages[index - 1]?.text || "";

    const bookmark = {
      id: bookmarkId,
      chatId: activeId,
      question: conversations
        .find((c) => c.id === activeId)
        ?.messages[index - 1]?.text || "",
      answer: botMessage.text,
      createdAt: new Date().toISOString(),
    };

    // Save locally
    setBookmarks((prev) => [...prev, bookmark]);


  /* 2️⃣ If logged in → sync to MongoDB */
  const token = localStorage.getItem("token");

  if (token) {
    try {
      await axios.post(
        "http://localhost:5000/api/bookmarks",
        bookmark,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Bookmark sync failed:", err.message);
    }
  }
};


  const t =TEXT[language]||TEXT["en"];
  const token = localStorage.getItem("token");
useEffect(() => {
  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}, []);

// themes

  /* ---------- LOAD CHATS ---------- */
  useEffect(() => {
    if (token) {
      // Logged-in user → load from backend
      fetch("http://localhost:5000/api/chats/load", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setConversations(data);
            setActiveId(data[0].id);
          } else {
            createFirstChat();
          }
        })
        .catch(createFirstChat);
    } else {
      // Guest → load from localStorage
      const local = JSON.parse(localStorage.getItem("guest_chats") || "[]");
      if (local.length > 0) {
        setConversations(local);
        setActiveId(local[0].id);
      } else {
        createFirstChat();
      }
    }
    // eslint-disable-next-line
  }, []);

  /* ---------- SAVE CHATS ---------- */
  useEffect(() => {
    if (conversations.length === 0) return;

    if (token) {
      fetch("http://localhost:5000/api/chats/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ conversations }),
      });
    } else {
      localStorage.setItem("guest_chats", JSON.stringify(conversations));
    }
  }, [conversations, token]);

  /* ---------- HELPERS ---------- */
  const createFirstChat = () => {
    const id = Date.now().toString();
    const chat = {
      id,
      title: "Chat 1",
      messages: [{ from: "bot", text: t.greeting }],
    };
    setConversations([chat]);
    setActiveId(id);
  };

  const createNewChat = () => {
    const id = Date.now().toString();
    const chat = {
      id,
      title: `Chat ${conversations.length + 1}`,
      messages: [{ from: "bot", text: t.greeting }],
    };
    setConversations((prev) => [chat, ...prev]);
    setActiveId(id);
  };

  const deleteConversation = (id) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (id === activeId && conversations.length > 1) {
      setActiveId(conversations[1].id);
    }
  };

  const updateMessages = (msgs) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, messages: msgs } : c))
    );
  };
 

 //helper
  const generateTitle = (text) => {
  return text.split(" ").slice(0, 5).join(" ") + "...";
};
  /* ---------- SEND MESSAGE ---------- */
  const sendToBackend = async (text) => {
    const active = conversations.find((c) => c.id === activeId);
    const newMsgs = [...active.messages, { from: "user", text }];

setConversations((prev) =>
  prev.map((c) =>
    c.id === activeId && c.title.startsWith("Chat")
      ? { ...c, title: generateTitle(text) }
      : c
  )
);

    updateMessages(newMsgs);

    setIsTyping(true);
    try {
      const data = await sendMessage(text, language);
      updateMessages([...newMsgs, { from: "bot", text: data.reply }]);
    } catch {
      updateMessages([...newMsgs, { from: "bot", text: t.serverError }]);
    } finally {
      setIsTyping(false);
    }
  };

  const activeConversation = conversations.find((c) => c.id === activeId);

  return (
    
    <div className={`ds-layout`}>
      <Sidebar
        conversations={conversations}
        onSelectConversation={setActiveId}
        onNewChat={createNewChat}
        onDeleteConversation={deleteConversation}
        language={language}
        text={TEXT[language]}
      />

      <div className="ds-chat">
        <div className="ds-chat-header">
          <div>
            <h2>{t.title}</h2>
            <p>{t.subtitle}</p>
          </div>

          <select
            className="lang-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="bn">Bengali</option>
            <option value="mr">Marathi</option>
          </select>
        </div>

        <div className="ds-chat-messages">
          {activeConversation?.messages.map((m, i) => (
<MessageBubble
  key={i}
  message={m}
  language={language}
  isBookmarked={bookmarks.some(
    (b) => b.id === `${activeId}_${i}`
  )}
  onBookmark={() => toggleBookmark(m, i)}
/>
          ))}
          {isTyping && <div className="typing-indicator">{t.typing}</div>}
        </div>

        {activeConversation?.messages.length === 1 && (
          <div className="suggestions">
            {SUGGESTIONS[language].map((q, i) => (
              <button
                key={i}
                className="suggestion-btn"
                onClick={() => sendToBackend(q)}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <ChatInput
          onSend={sendToBackend}
          placeholder={t.placeholder}
          language={language}
        />
      </div>
    </div>
  );
}
