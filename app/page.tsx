"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {

  const [messages, setMessages] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    async function init() {

      const params = new URLSearchParams(window.location.search);

      const source = params.get("source");
      const persona = params.get("persona");
      const campaign = params.get("campaign");

      const res = await fetch(
        "https://ai-automation-agent.onrender.com/init",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source, persona, campaign }),
        }
      );

      const data = await res.json();

      localStorage.setItem("user_id", data.user_id);
      setUserId(data.user_id);

      fetchInitial(data.user_id);
    }

    init();
  }, []);

  async function fetchInitial(id: string) {

    const res = await fetch(
      "https://ai-automation-agent.onrender.com/automate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "start", user_id: id })
      }
    );

    const data = await res.json();

    setMessages([{ role: "assistant", content: data.message }]);
    setActions(data.actions || []);
  }

  async function sendMessage(message: string) {

    const id = userId || localStorage.getItem("user_id");
    if (!id) return;

    const newMessages = [...messages, { role: "user", content: message }];

    setMessages(newMessages);
    setUserInput("");
    setLoading(true);
    setActions([]);

    const res = await fetch(
      "https://ai-automation-agent.onrender.com/automate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, user_id: id })
      }
    );

    const data = await res.json();

    setMessages([
      ...newMessages,
      { role: "assistant", content: data.message }
    ]);

    setActions(data.actions || []);
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
          Ask about Hilary's AI systems or get career help.
        </p>

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

          <div ref={bottomRef}></div>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
          />

          <button
            onClick={handleAsk}
            className="px-6 py-3 bg-white/10 border border-white/10 rounded-lg"
          >
            Ask
          </button>
        </div>

        {/*  QUICK BUTTONS (RESTORED AUDIO BUTTON) */}
        <div className="grid grid-cols-2 gap-4 mb-4">

          <button onClick={() => sendMessage("tech stack")} className="btn">Tech Stack</button>
          <button onClick={() => sendMessage("projects")} className="btn">AI Systems</button>
          <button onClick={() => sendMessage("portfolio")} className="btn">Portfolio</button>
          <button onClick={() => sendMessage("schedule")} className="btn">Schedule Call</button>

          <button
            onClick={() => sendMessage("audio")}
            className="btn col-span-2"
          >
            ▶ Hear Hilary Introduce Herself
          </button>
        </div>

        {/*  ACTIONS */}
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
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg"
                >
                  {action.label}
                </a>

              ) : (

                <button
                  key={index}
                  onClick={() => sendMessage(action.message)}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg"
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