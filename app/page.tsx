"use client";

import { useState, useRef } from "react";

export default function Home() {

  const [response, setResponse] = useState("");
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const responseRef = useRef<HTMLDivElement>(null);

  async function sendMessage(message: string) {

    setLoading(true);

    const res = await fetch("http://127.0.0.1:8001/automate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    setTimeout(() => {

      setResponse(data.message);
      setActions(data.actions || []);
      setLoading(false);

      // smooth scroll to response

      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

    }, 700);
  }

  return (
    <main className="min-h-screen flex items-center justify-center text-white grid-background">

      <div className="w-full max-w-2xl p-10 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-2xl">

        {/* TITLE */}

        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
          Hilary's AI Career Agent
        </h1>

        <p className="text-center text-gray-300 mb-10">
          Hi — I'm Hilary's AI Career Agent. I can help you learn about Hilary's AI systems, view her portfolio, share her CV, or schedule a call.
        </p>


        {/* BUTTON GRID */}

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

        </div>


        {/* TYPING ANIMATION */}

        {loading && (
          <div className="mt-8 text-gray-400 animate-pulse text-center">
            Hilary AI Career Agent is typing...
          </div>
        )}


        {/* RESPONSE SECTION */}

        {response && !loading && (

          <div ref={responseRef}>

            {/* Divider Glow */}

            <div className="w-full flex justify-center mt-8">
              <div className="w-[300px] h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"/>
            </div>

            {/* Response Box */}

            <div className="mt-8 p-6 rounded-lg bg-black/40 border border-white/10 whitespace-pre-line text-gray-200">
              {response}
            </div>

          </div>

        )}


        {/* ACTION BUTTONS */}

        {actions.length > 0 && !loading && (

          <div className="flex flex-wrap gap-4 mt-6 justify-center">

            {actions.map((action, index) => (

              action.url ? (

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