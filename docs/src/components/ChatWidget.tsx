import { useState } from "react";
import "./chat.css";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    const currentInput = input;

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      console.log("Sending message:", currentInput);

      const res = await fetch("https://pak-studies-cw4n.vercel.app/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data: { reply?: string; response?: string; message?: string } =
        await res.json();

      console.log("Response received:", data);

      const botReply =
        data.reply || data.response || data.message || "No response from server";

      const botMessage: Message = { sender: "bot", text: botReply };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error("Chat error:", err);

      const errorMsg = err?.message || "Unable to reach server";
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `Error: ${errorMsg}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <button className="chat-button" onClick={() => setOpen(!open)}>
        <span className="chat-button-icon">📚</span>
        <span className="chat-button-text">Ask the Pak Studies Tutor</span>
      </button>

      {open && (
        <div className="chat-box">
          <div className="chat-header">
            <div className="chat-header-main">
              Pakistan Studies Tutor
            </div>
            <div className="chat-header-sub">
              Ask questions about history, geography, constitution, and key events.
            </div>
          </div>

          <div className="chat-body">
            {messages.length === 0 && !loading && (
              <div className="chat-welcome">
                👋 Welcome! This assistant is trained for your
                <br />
                <strong>Pakistan Studies book.</strong>
                <br />
                <br />
                You can ask anything about:
                <br />
                <strong>
                  Chapters, dates, events, maps, MCQs, short & long questions
                </strong>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`bubble ${m.sender}`}>
                {m.text}
              </div>
            ))}

            {loading && (
              <div className="bubble bot">
                <em>Assistant is thinking…</em>
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your question about Pakistan Studies..."
              disabled={loading}
            />

            <button onClick={sendMessage} disabled={loading}>
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
