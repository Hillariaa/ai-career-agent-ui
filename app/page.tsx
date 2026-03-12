"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [response, setResponse] = useState("");
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");

  const responseRef = useRef<HTMLDivElement>(null);

  async function sendMessage(message: string) {
    try {
      setLoading(true);
      setResponse("");
      setActions([]);

      const res = await fetch(
        "https://ai-automation-agent.onrender.com/automate",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      if (!res.ok) {
        throw new Error("API request failed");
      }

      const data = await res.json();

      setResponse(data.message || "No response received.");
      setActions(data.actions || []);
    } catch (error) {
      console.error(error);

      setResponse(
        "The AI agent is waking up. Please try again in a moment."
      );
    } finally {
      setLoading(false);

      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }

  function handleAsk() {
    if (!userInput.trim()) return;
    sendMessage(userInput);
    setUserInput("");
  }

  return (
    <main className="min-h-screen flex items-center justify-center text-white grid-background">
      <div className="w-full max-w-2xl p-10 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-2xl">

        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
          Hilary's AI Career Assistant
        </h1>

        <p className="text-center text-gray-300 mb-10">
          Hi — I'm Hilary's AI Career Assistant. I can help you learn about Hilary's AI systems, view her portfolio, share her CV, or schedule a call.
        </p>

        <div className="grid grid-cols-2 gap-4">

          <button
            onClick={() => sendMessage("yes")}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition backdrop-blur-sm"
          >
            Learn About Hilary
          </button>

          <button
            onClick={() => sendMessage("portfolio")}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition backdrop-blur-sm"
          >
            View Portfolio
          </button>

          <button
            onClick={() => sendMessage("cv")}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition backdrop-blur-sm"
          >
            Get CV
          </button>

          <button
            onClick={() => sendMessage("schedule")}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition backdrop-blur-sm"
          >
            Schedule Call
          </button>

          <button
            onClick={() => sendMessage("audio")}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition backdrop-blur-sm col-span-2"
          >
            ▶ Hear Hilary Introduce Herself
          </button>

        </div>

        <div className="mt-6 flex gap-2">

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

        {loading && (
          <div className="mt-8 text-gray-400 animate-pulse text-center">
            Hilary AI Career Assistant is typing...
          </div>
        )}

        {response && !loading && (
          <div ref={responseRef}>

            <div className="w-full flex justify-center mt-8">
              <div className="w-[300px] h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"/>
            </div>

            <div className="mt-8 p-6 rounded-lg bg-black/40 border border-white/10 whitespace-pre-line text-gray-200">
              {response}
            </div>

          </div>
        )}

        {actions.length > 0 && !loading && (
          <div className="flex flex-wrap gap-4 mt-6 justify-center">

            {actions.map((action, index) => (
              
              action.url && action.url.includes(".mp3") ? (

                <audio key={index} controls className="mt-4">
                  <source src={action.url} type="audio/mpeg" />
                </audio>

              ) : action.url ? (

                <a
                  key={index}
                  href={action.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition backdrop-blur-sm"
                >
                  {action.label}
                </a>

              ) : (

                <button
                  key={index}
                  onClick={() => sendMessage(action.message)}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition backdrop-blur-sm"
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