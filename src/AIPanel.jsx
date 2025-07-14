import React, { useState } from "react";

export default function AIPanel() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 有什麼想問模型的嗎？" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    // 加入使用者訊息
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    // 模擬 AI 回覆
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "（這裡會顯示 AI 的回答）" },
      ]);
    }, 800);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* 訊息區 */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "8px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "16px",
                backgroundColor:
                  msg.sender === "user" ? "#DCF8C6" : "#E6E6E6",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      {/* 輸入區 */}
      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="輸入訊息..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: "8px",
            padding: "10px 16px",
            backgroundColor: "#6528D7",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          發送
        </button>
      </div>
    </div>
  );
}
