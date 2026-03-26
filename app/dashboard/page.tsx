"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("https://ai-automation-agent.onrender.com/dashboard")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) {
    return <div className="text-white p-10">Loading dashboard...</div>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center text-white grid-background">

      <div className="w-full max-w-4xl p-10 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-2xl">

        <h1 className="text-3xl font-bold mb-6 text-center">
          📊 AI Agent Dashboard
        </h1>

        <div className="mb-6 text-center">
          <p>Total Users: {data.total_users}</p>
        </div>

        <div className="space-y-6 max-h-[500px] overflow-y-auto">

          {data.users.map((user: any, i: number) => (
            <div
              key={i}
              className="p-4 border border-white/10 rounded-lg bg-black/40"
            >
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Source:</strong> {user.source}</p>
              <p><strong>Persona:</strong> {user.persona}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>High Intent:</strong> {user.is_high_intent ? "Yes" : "No"}</p>

              {/* ✅ FEEDBACK DISPLAY */}
              {user.feedback?.length > 0 && (
                <div className="mt-3">
                  <p className="font-semibold">Feedback:</p>
                  {user.feedback.map((f: any, idx: number) => (
                    <div key={idx} className="text-sm text-gray-300">
                      • {f.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

        </div>

      </div>

    </main>
  );
}