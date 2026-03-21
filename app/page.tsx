"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {

  const [messages, setMessages] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);

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

  async function saveEmail() {

    if (!email || !userId) return;

    await fetch(
      "https://ai-automation-agent.onrender.com/capture-email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          email: email
        })
      }
    );

    setEmailSaved(true);
  }

  return (
    <main className="min-h-screen flex items-center justify-center text-white grid-background">

      <div className="w-full max-w-2xl p-10 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-2xl">

        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
          Hilary's AI Career Assistant
        </h1>

        <p className="text-center text-gray-300 mb-6">
          Explore Hilary’s AI systems, projects, and engineering experience.
        </p>

        {/* EMAIL CAPTURE */}
        {!emailSaved && (
          <div className="mb-6 p-4 border border-white/10 rounded-lg bg-white/5">

            <p className="text-sm text-gray-300 mb-2">
              Want a deeper walkthrough or follow-up?
            </p>

            <div className="flex gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />

              <button
                onClick={saveEmail}
                className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg"
              >
                Save
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-2">
              Only used to follow up about Hilary’s AI systems. No spam.
            </p>

          </div>
        )}

        {emailSaved && (
          <div className="mb-6 text-green-400 text-sm text-center">
            ✅ Thanks — I’ll follow up with more details.
          </div>
        )}

        {/* CHAT */}
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

          <div ref={bottomRef}></div>

        </div>

        {/* INPUT */}
        <div className="flex gap-2 mb-4">
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask about Hilary’s AI work..."
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
          />

          <button
            onClick={() => sendMessage(userInput)}
            className="px-6 py-3 bg-white/10 border border-white/10 rounded-lg"
          >
            Ask
          </button>
        </div>

      </div>
    </main>
  );
}