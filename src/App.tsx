import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";
const App = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:11434/api/generate", {
        // model: "deepseek-r1:7b",
        model: "llama3.1:8b",
        prompt:
          updatedMessages.map((m) => `${m.role}: ${m.content}`).join("\n") +
          "\nassistant:",
        stream: false,
      });

      const reply = res.data.response;
      setMessages([...updatedMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };
  // ...existing code...
  return (
    <div className="chat-container">
      <div className="chat-content">
        {/* Header */}
        <div className="chat-header">
          <h1>AI Chat Assistant</h1>
        </div>

        {/* Messages Container */}
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="welcome-message">
              <p>👋 Xin chào! Hãy bắt đầu cuộc trò chuyện</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role}`}>
              <div className="chat-bubble">
                <div className="message-content">{msg.content}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="loading-dots">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Container */}
        <div className="chat-input-wrapper">
          <input
            className="chat-input"
            placeholder="Nhập câu hỏi của bạn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} className="chat-send">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
export default App;