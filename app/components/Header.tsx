import React from "react";

const Header = () => {
  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl shadow-black/20 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
          Warframe Market
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Market Workspace
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          Search items, inspect live orders, track recent transactions, and
          manage your personal market listings from one authenticated dashboard.
        </p>
      </div>

      <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-200">
        <p className="font-medium">Authenticated</p>
        <p className="mt-1 text-xs text-cyan-100/70">
          Private workspace enabled
        </p>
      </div>
    </header>
  );
};

export default Header;
