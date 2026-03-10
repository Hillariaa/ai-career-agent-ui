"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {

  const [messages, setMessages] = useState<any[]>([]);
  const [stage, setStage] = useState("start");

  const bottomRef = useRef<HTMLDivElement>(null);

  async function sendMessage(message: string) {

    // add recruiter message
    setMessages(prev => [...prev, { role: "user", text: message }]);

    const res = await fetch("http://127.0.0.1:8001/automate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        state: stage
      })
    });

    const data = await res.json();

    setStage(data.state);

    // add AI message
    setMessages(prev => [...prev, { role: "assistant", text: data.message }]);

  }

  // auto scroll

  useEffect(() => {

    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages]);

  return (

    <main className="min-h-screen flex items-center justify-center px-6 grid-background">

      <div className="w-full max-w-2xl p-10 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">

        <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
          Hilary AI Career Agent
        </h1>

        <p className="text-center text-gray-300 mb-10">
          Hi — I'm Hilary's AI Career Agent. I can help you learn about Hilary's
          AI systems, view her portfolio, share her CV, or schedule a call.
        </p>

        {/* CHAT */}

        <div className="space-y-4 mb-8 max-h-80 overflow-y-auto">

          {messages.map((m, i) => (

            <div
              key={i}
              className={`p-4 rounded-xl whitespace-pre-line ${
                m.role === "assistant"
                  ? "bg-black/40 border border-white/10 text-gray-200"
                  : "bg-purple-500/20 border border-purple-400/30 text-purple-200 ml-auto max-w-xs"
              }`}
            >
              {m.text}
            </div>

          ))}

          <div ref={bottomRef} />

        </div>

        {/* BUTTONS */}

        <div className="grid grid-cols-2 gap-4">

          {stage === "start" && (

            <button
              onClick={() => sendMessage("start")}
              className="col-span-2 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              Start Conversation
            </button>

          )}

          {stage === "intro" && (

            <>
              <button
                onClick={() => sendMessage("yes")}
                className="py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
              >
                Yes
              </button>

              <button
                onClick={() => sendMessage("no")}
                className="py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
              >
                No
              </button>
            </>

          )}

          {stage === "knowledge" && (

            <button
              onClick={() => sendMessage("schedule")}
              className="col-span-2 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
            >
              Schedule a Call
            </button>

          )}

          {stage !== "start" && (

            <>
              <button
                onClick={() => sendMessage("portfolio")}
                className="py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
              >
                View Portfolio
              </button>

              <button
                onClick={() => sendMessage("cv")}
                className="py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
              >
                Get CV
              </button>
            </>

          )}

        </div>

      </div>

    </main>

  );
}