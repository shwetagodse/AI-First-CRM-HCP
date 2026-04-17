import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addChatMessage, setProcessing, bulkUpdateForm } from "../store/interactionSlice";
import { Send, Bot } from "lucide-react";

const AIAssistant = () => {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const chatHistory = useSelector((state) => state.interaction.chatHistory);
  const isProcessing = useSelector(
    (state) => state.interaction.isProcessingText,
  );

  const handleSend = async () => {
    if (!input.trim()) return;

    dispatch(addChatMessage({ role: "user", content: input }));
    setInput("");
    dispatch(setProcessing(true));

    // 2. TODO: Call FastAPI LangGraph endpoint here
    // Example: const response = await fetch('/api/chat', { body: JSON.stringify({ message: input }) });
    // const data = await response.json();

    // 2. Call FastAPI LangGraph endpoint

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Sending chat history to the backend!
        body: JSON.stringify({ message: input, chat_history: chatHistory }),
      });

      const data = await response.json();

      // 3. Update UI with Agent response
      dispatch(
        addChatMessage({
          role: "ai",
          content: data.reply || "Done! I've updated the form.",
        }),
      );

      if (
        data.extractedEntities &&
        Object.keys(data.extractedEntities).length > 0
      ) {
        dispatch(bulkUpdateForm(data.extractedEntities));
      }
    } catch (error) {
      console.error("Error communicating with backend:", error);
      dispatch(
        addChatMessage({
          role: "ai",
          content:
            "Sorry, I couldn't connect to the backend server. Is FastAPI running?",
        }),
      );
    } finally {
      dispatch(setProcessing(false));
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-2 bg-blue-50/50 rounded-t-lg">
        <Bot className="text-blue-600 w-5 h-5" />
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">AI Assistant</h3>
          <p className="text-xs text-gray-500">Log interaction via chat</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 shadow-sm"}`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 text-gray-500 p-3 rounded-lg text-sm shadow-sm flex items-center gap-2">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse delay-100">●</span>
              <span className="animate-pulse delay-200">●</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white rounded-b-lg">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Describe interaction..."
            className="flex-1 border p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-100 text-sm text-gray-700"
          />
          <button
            onClick={handleSend}
            disabled={isProcessing}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm transition disabled:opacity-50"
          >
            Log <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
