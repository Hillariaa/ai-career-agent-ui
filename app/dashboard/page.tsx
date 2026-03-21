"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("https://ai-automation-agent.onrender.com/dashboard");
      const json = await res.json();
      setData(json);
    }

    fetchData();
  }, []);

  if (!data) {
    return <div className="text-white p-10">Loading dashboard...</div>;
  }

  const users = data.users || [];

  return (
    <main className="min-h-screen text-white p-10 bg-black">

      <h1 className="text-3xl font-bold mb-6">
        📊 AI Agent Dashboard
      </h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="p-6 bg-white/5 rounded-xl">
          <h2>Total Users</h2>
          <p className="text-2xl font-bold">{data.total_users}</p>
        </div>

        <div className="p-6 bg-white/5 rounded-xl">
          <h2>High Intent</h2>
          <p className="text-2xl font-bold">
            {users.filter((u: any) => u.is_high_intent).length}
          </p>
        </div>

        <div className="p-6 bg-white/5 rounded-xl">
          <h2>Recruiters</h2>
          <p className="text-2xl font-bold">
            {users.filter((u: any) => u.source === "outreach").length}
          </p>
        </div>

      </div>

      {/* USERS TABLE */}
      <div className="bg-white/5 p-6 rounded-xl">

        <h2 className="mb-4 text-xl font-semibold">Users</h2>

        <div className="space-y-4">

          {users.map((user: any, i: number) => (

            <div key={i} className="p-4 border border-white/10 rounded-lg">

              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Source:</strong> {user.source}</p>
              <p><strong>Persona:</strong> {user.persona}</p>
              <p><strong>High Intent:</strong> {user.is_high_intent ? "🔥 Yes" : "No"}</p>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}