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

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackSaved, setFeedbackSaved] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // INIT USER
  useEffect(() => {
    async function init() {
      const res = await fetch(
        "https://ai-automation-agent.onrender.com/init",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        }
      );

      const data = await res.json();

      localStorage.setItem("user_id", data.user_id);
      setUserId(data.user_id);

      sendMessage("start", data.user_id);
    }

    init();
  }, []);

  async function sendMessage(message: string, idOverride?: string) {

    const id = idOverride || userId;
    if (!id) return;

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

    } catch (error) {

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "The AI agent is waking up. Please try again."
        }
      ]);

    }

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

  async function submitFeedback() {

    if (!feedback || !userId) return;

    await fetch(
      "https://ai-automation-agent.onrender.com/feedback",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          feedback: feedback
        })
      }
    );

    setFeedbackSaved(true);
  }

  return (
    <main className="min-h-screen flex items-center justify-center text-white grid-background">

      <div className="w-full max-w-2xl p-10 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-2xl">

        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
          Hilary's AI Career Assistant
        </h1>

        <p className="text-center text-gray-300 mb-6">
          Explore Hilary's AI systems, projects, and engineering experience.
        </p>

        {/* EMAIL CAPTURE */}
        {!emailSaved && (
          <div className="mb-6">
            <p className="text-sm text-gray-300 mb-2">
              Want a deeper walkthrough or follow-up?
            </p>
            <div className="flex gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400"
              />
              <button
                onClick={saveEmail}
                className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
              >
                Save
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Only used to follow up about Hilary’s AI systems. No spam.
            </p>
          </div>
        )}

        {emailSaved && (
          <div className="text-green-400 mb-6">
             Thanks — I’ll follow up with more details.
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

          {loading && (
            <div className="text-gray-400 animate-pulse">
              Assistant is typing...
            </div>
          )}

          <div ref={bottomRef}></div>

        </div>

        {/* INPUT */}
        <div className="flex gap-2 mb-4">
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask about Hilary's AI work..."
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
          />

          <button
            onClick={() => sendMessage(userInput)}
            className="px-6 py-3 bg-white/10 border border-white/10 rounded-lg hover:bg-white/20"
          >
            Ask
          </button>
        </div>

        {/* DEFAULT BUTTONS */}
        <div className="grid grid-cols-2 gap-4 mb-4">

          <button onClick={() => sendMessage("AI systems")} className="btn">
            AI Systems
          </button>

          <button onClick={() => sendMessage("tech stack")} className="btn">
            Tech Stack
          </button>

          <button onClick={() => sendMessage("portfolio")} className="btn">
            Portfolio
          </button>

          <button onClick={() => sendMessage("schedule")} className="btn">
            Schedule Call
          </button>

          <button
            onClick={() => sendMessage("audio")}
            className="btn col-span-2"
          >
            ▶ Hear Hilary Introduce Herself
          </button>

        </div>

        {/* RECRUITER BUTTONS */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">

          <button onClick={() => sendMessage("key projects")} className="btn">
            Key Projects
          </button>

          <button onClick={() => sendMessage("why hire hilary")} className="btn">
            Why hire Hilary
          </button>

          <button onClick={() => sendMessage("portfolio")} className="btn">
            View Portfolio
          </button>

          <button onClick={() => sendMessage("cv")} className="btn">
            Download CV
          </button>

          <button onClick={() => sendMessage("schedule")} className="btn">
            Discuss role fit (15 min)
          </button>

        </div>

        {/* ACTIONS (links + audio) */}
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center mb-6">

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
                  className="btn"
                >
                  {action.label}
                </a>

              ) : (

                <button
                  key={index}
                  onClick={() => sendMessage(action.message)}
                  className="btn"
                >
                  {action.label}
                </button>

              )

            ))}

          </div>
        )}

        {/* FEEDBACK */}
        <div className="text-center">

          {!feedbackOpen && (
            <button
              onClick={() => setFeedbackOpen(true)}
              className="text-sm text-gray-400 underline"
            >
              💬 Give feedback
            </button>
          )}

          {feedbackOpen && !feedbackSaved && (
            <div className="mt-4">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What did you think about this AI assistant?"
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400"
              />

              <button
                onClick={submitFeedback}
                className="mt-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
              >
                Submit
              </button>
            </div>
          )}

          {feedbackSaved && (
            <div className="text-green-400 mt-4">
               Thanks for your feedback!
            </div>
          )}

        </div>

      </div>

      <style jsx>{`
        .btn {
          padding: 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          transition: 0.2s;
        }
        .btn:hover {
          background: rgba(255,255,255,0.1);
        }
      `}</style>

    </main>
  );
}