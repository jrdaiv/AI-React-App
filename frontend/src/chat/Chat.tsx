import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

// Define message type
interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        message: input,
      });
      const botMessage: Message = {
        role: "assistant",
        content: response.data.reply,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-4">
      <div className="w-full max-w-3xl h-[800px] rounded-lg flex flex-col bg-black">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`p-3 max-w-[75%] rounded-lg ${
                  message.role === "user"
                    ? "bg-black border border-gray-300 text-gray-200 rounded-bl-none" // User message (left)
                    : "bg-black border border-gray-300 text-gray-200 rounded-br-none" // AI message (right)
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="flex items-center p-4 border rounded-2xl border-gray-300 bg-transparent ">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 p-2 bg-black text-white border border-gray-400 rounded-md outline-none focus:ring focus:ring-gray-300"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="ml-2 p-2 bg-black text-white rounded-lg border cursor-pointer border-gray-400 transition "
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
