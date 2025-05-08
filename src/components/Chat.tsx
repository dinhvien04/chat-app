import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Helper to generate unique IDs
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

interface ChatSession {
    id: string;
    title: string;
    messages: { role: string; content: string }[];
}

const Chat = () => {
    const [chats, setChats] = useState<ChatSession[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<{ username: string } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Check if user is logged in on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Fetch user info
            axios.get('http://localhost:3001/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    setUser(response.data);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    setUser(null);
                });
        }
    }, []);

    // Get current chat
    const currentChat = chats.find((c) => c.id === selectedChatId);

    // Scroll to bottom on messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [currentChat?.messages, loading]);

    // Create new chat
    const handleNewChat = () => {
        const newId = generateId();
        const newChat: ChatSession = {
            id: newId,
            title: "Cuộc trò chuyện mới",
            messages: [],
        };
        setChats([newChat, ...chats]);
        setSelectedChatId(newId);
    };

    // Select chat
    const handleSelectChat = (id: string) => {
        setSelectedChatId(id);
    };

    // Delete chat
    const handleDeleteChat = (id: string) => {
        const filtered = chats.filter((c) => c.id !== id);
        setChats(filtered);
        if (selectedChatId === id) {
            setSelectedChatId(filtered.length > 0 ? filtered[0].id : null);
        }
    };

    // Clear all chats
    const clearAllChats = () => {
        setChats([]);
        setSelectedChatId(null);
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // Handle login
    const handleLogin = () => {
        navigate('/login');
    };

    // Send message in current chat
    const handleSend = async () => {
        if (!input.trim() || !currentChat) return;
        const userMessage = { role: "user", content: input };
        const updatedMessages = [...currentChat.messages, userMessage];
        setInput("");
        setLoading(true);
        // Update chat in chats array
        setChats((prev) =>
            prev.map((c) =>
                c.id === currentChat.id ? { ...c, messages: updatedMessages } : c
            )
        );
        try {
            const res = await axios.post("http://localhost:11434/api/generate", {
                model: "llama3.1:8b",
                prompt:
                    updatedMessages.map((m) => `${m.role}: ${m.content}`).join("\n") +
                    "\nassistant:",
                stream: false,
            });
            const reply = res.data.response;
            // Add assistant reply
            setChats((prev) =>
                prev.map((c) =>
                    c.id === currentChat.id
                        ? { ...c, messages: [...updatedMessages, { role: "assistant", content: reply }] }
                        : c
                )
            );
            // Update title if it's the first message
            if (currentChat.messages.length === 0) {
                setChats((prev) =>
                    prev.map((c) =>
                        c.id === currentChat.id
                            ? { ...c, title: input.slice(0, 30) || "Cuộc trò chuyện mới" }
                            : c
                    )
                );
            }
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-app-layout">
            {/* Sidebar */}
            <div className="chat-sidebar">
                <button className="new-chat-btn" onClick={handleNewChat}>+ Cuộc trò chuyện mới</button>
                <div className="chat-list">
                    {chats.length === 0 && <div className="empty-list">Chưa có cuộc trò chuyện</div>}
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            className={`chat-list-item${chat.id === selectedChatId ? " selected" : ""}`}
                            onClick={() => handleSelectChat(chat.id)}
                        >
                            <span className="chat-title">{chat.title}</span>
                            <button
                                className="delete-chat-btn"
                                onClick={(e) => { e.stopPropagation(); handleDeleteChat(chat.id); }}
                                title="Xóa cuộc trò chuyện"
                            >×</button>
                        </div>
                    ))}
                </div>
                <div className="sidebar-footer">
                    {chats.length > 0 && (
                        <button className="clear-history-btn" onClick={clearAllChats}>
                            Xóa tất cả lịch sử
                        </button>
                    )}
                    {user ? (
                        <>
                            <div className="user-info">
                                <span className="username">{user.username}</span>
                            </div>
                            <button className="logout-btn" onClick={handleLogout}>
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <button className="login-btn" onClick={handleLogin}>
                            Đăng nhập
                        </button>
                    )}
                </div>
            </div>
            {/* Main chat area */}
            <div className="chat-container">
                <div className="chat-content">
                    {/* Header */}
                    <div className="chat-header">
                        <h1>AI Chat Assistant</h1>
                    </div>
                    {/* Messages Container */}
                    <div className="chat-messages">
                        {!currentChat || currentChat.messages.length === 0 ? (
                            <div className="welcome-message">
                                <p>👋 Xin chào! Hãy bắt đầu cuộc trò chuyện</p>
                            </div>
                        ) : (
                            currentChat.messages.map((msg, idx) => (
                                <div key={idx} className={`chat-message ${msg.role}`}>
                                    <div className="chat-bubble">
                                        <div className="message-content">{msg.content}</div>
                                    </div>
                                </div>
                            ))
                        )}
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
                            disabled={!currentChat}
                        />
                        <button onClick={handleSend} className="chat-send" disabled={!currentChat}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat; 