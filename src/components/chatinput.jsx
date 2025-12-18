import React, { useRef, useState } from "react";
import "./chatinput.css";
import QRScanner from "./qrscanner";

export default function ChatInput({ onSend, placeholder, language }) {
  const [text, setText] = useState("");
  const fileInputRef = useRef(null);
  const [showQR, setShowQR] = useState(false);


  /* ---------- SEND MESSAGE ---------- */
  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  /* ---------- FILE UPLOAD ---------- */
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Uploaded: ${file.name}`);
      // later: send to backend
    }
  };

  /* ---------- VOICE INPUT ---------- */
  const handleMic = () => {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Speech recognition not supported");
    return;
  }

  const recognition = new window.webkitSpeechRecognition();

  // 🔥 Language-aware mic
recognition.lang =
  language === "hi"
    ? "hi-IN"
    : language === "bn"
    ? "bn-IN"
    : language === "mr"
    ? "mr-IN"
    : "en-US";

  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onresult = (event) => {
    setText(event.results[0][0].transcript);
  };

  recognition.start();
};
const send = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };


return (
    <>
      {showQR && (
        <QRScanner
          onScan={(data) => {
  if (!data) return;

  // Auto open links
  if (data.startsWith("http://") || data.startsWith("https://")) {
    window.open(data, "_blank");
  } else {
    setText(data);
  }

  setShowQR(false);
}}

          onClose={() => setShowQR(false)}
        />
      )}

      <div className="chat-input-bar">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />

        {/* File */}
        <label className="icon-btn">
          📎
          <input type="file" hidden />
        </label>

        {/* QR */}
        <button className="icon-btn" onClick={() => setShowQR(true)}>
          📷
        </button>

        <button className="send-btn" onClick={send}>
          Send
        </button>
        {/* 🔥 MIC BUTTON (ADDED BACK) */}
      <button
        className="icon-btn"
        onClick={handleMic}
        title="Speak"
      >
        🎤
      </button>
        
      </div>
    </>
  );
}
