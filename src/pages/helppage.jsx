import React from "react";
import { useNavigate } from "react-router-dom";
import "./helppage.css";

export default function HelpPage() {
  const navigate = useNavigate();

  return (
    <div className="help-container">
      <h1>How DeepShiva Helps You</h1>
      <p className="help-subtitle">
        An AI-powered assistant for spiritual tourism, guidance, and cultural
        exploration
      </p>

      {/* ALL FEATURES IN SAME GRID */}
      <div className="help-grid">
        <div className="help-card">🕉️ Spiritual guidance & temple information</div>
        <div className="help-card">🌄 Tourism assistance for Himalayan regions</div>
        <div className="help-card">📍 Nearby temples & sacred places</div>
        <div className="help-card">🏨 Hotel & stay recommendations</div>
        <div className="help-card">🚻 Toilet & public facility information</div>
        <div className="help-card">🧘 Guided meditation & mindfulness</div>
        <div className="help-card">📜 Festivals, rituals & cultural knowledge</div>
        <div className="help-card">🎧 Audio guidance & chants</div>
        <div className="help-card">🎤 Voice-based interaction</div>
        <div className="help-card">🌐 Multilingual support (English & Hindi)</div>
        <div className="help-card">🗺️ Travel tips & local insights</div>
        <div className="help-card">🕰️ Best time to visit spiritual places</div>

        {/* START CHAT AS A BOX */}
        <div className="help-card-wrapper">
  <div
    className="help-card help-card-cta"
    onClick={() => navigate("/chat")}
  >
    💬 Start Chat with DeepShiva
  </div>
</div>

      </div>

      <div className="help-footer">
        <p>
          DeepShiva is designed to make spiritual journeys easier, meaningful,
          and accessible for everyone.
        </p>
      </div>
    </div>
  );
}
