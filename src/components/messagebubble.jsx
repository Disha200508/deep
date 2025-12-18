import React, { useEffect, useRef, useState } from "react";
import "./messagebubble.css";

const LANG_MAP = {
  en: "en-US",
  hi: "hi-IN",
  bn: "bn-IN",
  mr: "mr-IN",
};


export default function MessageBubble({ message, language, onBookmark, isBookmarked}) {
  const isUser = message.from === "user";
  const synthRef = useRef(window.speechSynthesis);
  const [voices, setVoices] = useState([]);

  /* ---------- SAFETY CHECK ---------- */
  if (!message || typeof message.text !== "string") {
    return null;
  }

  /* ---------- LOAD VOICES (important fix) ---------- */
  // useEffect(() => {
  //   if (!synthRef.current) return;

  //   const loadVoices = () => {
  //     setVoices(synthRef.current.getVoices());
  //   };

  //   loadVoices();
  //   synthRef.current.onvoiceschanged = loadVoices;

  //   return () => {
  //     synthRef.current.onvoiceschanged = null;
  //   };
  // }, []);

  /* ---------- SPEAK ---------- */
  const speakText = (text) => {
    if (!synthRef.current) {
      alert("Text-to-speech not supported");
      return;
    }

    const synth = synthRef.current;
    const voices = synth.getVoices();

    const langCode = LANG_MAP[language] || "en-US";

    const voice =
      voices.find((v) => v.lang === langCode) ||
      voices.find((v) => v.lang.startsWith(langCode.split("-")[0]));

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    if (voice) utterance.voice = voice;

    synth.cancel(); // stop any previous speech
    synth.speak(utterance);
  };

  /* ---------- STOP ---------- */
  const stopSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  return (
    
    <div className={`bubble-row ${isUser ? "user-row" : "bot-row"}`}>
      <div className={`bubble ${isUser ? "user" : "bot"}`}>
        <div className="bubble-text">{message.text}</div>

        {/* ⭐ Bookmark (bot only) */}
        {!isUser && onBookmark && (
          <button
            className={`bookmark-btn ${isBookmarked ? "active" : ""}`}
            onClick={() => onBookmark(message)}
    title={isBookmarked ? "Remove bookmark" : "Save response"}
          >
            ⭐
          </button>
        )}

        {/* 🔊 TTS controls (bot only) */}
        {!isUser && (
          <div className="tts-controls">
            <button
              className="tts-btn"
              onClick={() => speakText(message.text)}
              title="Listen"
            >
              🔊
            </button>

            <button
              className="tts-btn stop"
              onClick={stopSpeech}
              title="Stop"
            >
              ⏹️
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
