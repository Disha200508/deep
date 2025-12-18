import React from "react";
import "./sidebar.css";

export default function Sidebar({
  conversations,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  language,
  text,
}) {
  return (
    <div className="ds-sidebar">
      {/* Header */}
      <div className="ds-sidebar-header">
        <h3>{text.appName}</h3>

        <button className="new-chat-btn" onClick={onNewChat}>
          {text.newChat}
        </button>
      </div>
<button
  className="bookmark-nav-btn"
  onClick={() => window.location.href = "/bookmarks"}
>
  ⭐ Bookmarks
</button>

      {/* Chat list */}
      <div className="ds-chat-list">
        {conversations.map((c, index) => (
          <div
            key={c.id}
            className="ds-chat-item"
            onClick={() => onSelectConversation(c.id)}
          >
            <span className="chat-title">
              {text.chat} {conversations.length - index}
            </span>

            {/* Delete button */}
            <span
              className="delete-chat"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteConversation(c.id);
              }}
            >
              ✕
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
