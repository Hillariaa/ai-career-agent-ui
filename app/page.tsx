"use client";

import { useState } from "react";

export default function Home() {

  const [messages, setMessages] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");

  async function sendMessage(message: string) {

    const newMessages = [
      ...messages,
      { role: "user", content: message }
    ];

    setMessages(newMessages);
    setUserInput("");
    setLoading(true);
    setActions([]);

    try {

      const res = await fetch(
        "https://ai-automation-agent.onrender.com/automate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message })
        }
      );

      const data = await res.json();

      setMessages([
        ...newMessages,
        { role: "assistant", content: data.message }
      ]);

      setActions(data.actions || []);

    } catch (error) {

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "The AI agent is waking up. Please try again in a moment."
        }
      ]);

    }

    setLoading(false);
  }

  function handleAsk() {
    if (!userInput.trim()) return;
    sendMessage(userInput);
  }

  return (
    <main className="min-h-screen flex items-center justify-center text-white grid-background">

      <div className="w-full max-w-2xl p-10 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-2xl">

        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
          Hilary's AI Career Assistant
        </h1>

        <p className="text-center text-gray-300 mb-6">
          Ask about Hilary's AI systems, projects, or experience.
        </p>

        {/* Chat messages */}

        <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">

          {messages.map((msg, i) => (

            <div
              key={i}
              className={`p-4 rounded-lg border border-white/10 ${
                msg.role === "user"
                  ? "bg-white/10 text-right"
                  : "bg-black/40"
              }`}
            >
              <div className="whitespace-pre-line">
                {msg.content}
                </div>
            </div>

          ))}

          {loading && (
            <div className="text-gray-400 animate-pulse">
              Assistant is typing...
            </div>
          )}

        </div>

        {/* Input */}

        <div className="flex gap-2 mb-4">

          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask about Hilary's AI work..."
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm text-white placeholder-gray-400"
          />

          <button
            onClick={handleAsk}
            className="px-6 py-3 bg-white/10 border border-white/10 rounded-lg hover:bg-white/20 transition"
          >
            Ask
          </button>

        </div>

        {/* Quick buttons */}

        <div className="grid grid-cols-2 gap-4 mb-4">

          <button
            onClick={() => sendMessage("What AI systems has Hilary built?")}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
          >
            AI Systems
          </button>

          <button
            onClick={() => sendMessage("What tech stack does Hilary use?")}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
          >
            Tech Stack
          </button>

          <button
            onClick={() => sendMessage("portfolio")}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
          >
            Portfolio
          </button>

          <button
            onClick={() => sendMessage("schedule")}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
          >
            Schedule Call
          </button>

          <button
          onClick={() => sendMessage("audio")}
          className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition col-span-2"
          >
            ▶ Hear Hilary Introduce Herself 
            </button>

        </div>

        {/* Actions returned from API */}

        {actions.length > 0 && (

          <div className="flex flex-wrap gap-4 justify-center">

            {actions.map((action, index) => (

              action.url && action.url.includes(".mp3") ? (

                <audio key={index} controls>
                  <source src={action.url} type="audio/mpeg" />
                </audio>

              ) : action.url ? (

                <a
                  key={index}
                  href={action.url}
                  target="_blank"
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
                >
                  {action.label}
                </a>

              ) : (

                <button
                  key={index}
                  onClick={() => sendMessage(action.message)}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
                >
                  {action.label}
                </button>

              )

            ))}

          </div>

        )}

      </div>

    </main>
  );
}