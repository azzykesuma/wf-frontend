import React from "react";

const RecentTransaction = () => {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Recent Market Activity</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Recent transactions can be displayed here using
            <code className="mx-1 rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-300">
              GET /api/transactions/recent
            </code>
            .
          </p>
        </div>

        <button className="mt-3 rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-cyan-400/60 hover:text-cyan-200 md:mt-0">
          Refresh
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-zinc-700 bg-zinc-950/50 p-8 text-center">
        <p className="text-sm text-zinc-500">No recent activity loaded yet.</p>
      </div>
    </section>
  );
};

export default RecentTransaction;
