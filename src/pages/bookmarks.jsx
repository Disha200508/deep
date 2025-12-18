import React from "react";
import "./bookmarks.css";

export default function Bookmarks() {
  const bookmarks =
    JSON.parse(localStorage.getItem("ds_bookmarks")) || [];

  return (
    <div className="bookmark-page">
      <h2>⭐ Saved Responses</h2>

      {bookmarks.length === 0 && (
        <p>No bookmarks saved yet.</p>
      )}

      {bookmarks.map((b, i) => (
        <div className="bookmark-card" key={i}>
          <p className="bookmark-a">🕉️ {b.text}</p>
          <span className="bookmark-time">
            {new Date(b.createdAt).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
