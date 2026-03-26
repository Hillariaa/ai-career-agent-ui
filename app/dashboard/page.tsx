"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {

  const [messages, setMessages] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackSaved, setFeedbackSaved] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    async function init() {

      const res = await fetch(
        "https://ai-automation-agent.onrender.com/init",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
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

        <h1 className="text-4xl font-bold text-center mb-4">
          Hilary's AI Career Assistant
        </h1>

        {/* CHAT */}
        <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">

          {messages.map((msg, i) => (
            <div key={i}>{msg.content}</div>
          ))}

          <div ref={bottomRef}></div>

        </div>

        {/* INPUT */}
        <div className="flex gap-2 mb-4">
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="flex-1"
          />
          <button onClick={() => sendMessage(userInput)}>Send</button>
        </div>

        {/* ACTIONS */}
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center mb-6">

            {actions.map((action, index) => (

              action.url && action.url.includes(".mp3") ? (

                <audio key={index} controls>
                  <source src={action.url} type="audio/mpeg" />
                </audio>

              ) : action.url ? (

                <a key={index} href={action.url} target="_blank">
                  {action.label}
                </a>

              ) : (

                <button
                  key={index}
                  onClick={() => sendMessage(action.message)}
                >
                  {action.label}
                </button>

              )

            ))}

          </div>
        )}

        {/*  FEEDBACK (BOTTOM + HIDDEN TOGGLE) */}
        <div className="mt-6 text-center">

          {!feedbackOpen && (
            <button
              onClick={() => setFeedbackOpen(true)}
              className="text-sm text-gray-400 underline"
            >
               Give feedback
            </button>
          )}

          {feedbackOpen && !feedbackSaved && (
            <div className="mt-4">

              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What did you think about this AI assistant?"
                className="w-full p-2 text-black rounded"
              />

              <button
                onClick={submitFeedback}
                className="mt-2 px-4 py-2 bg-white/10 rounded"
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

    </main>
  );
}