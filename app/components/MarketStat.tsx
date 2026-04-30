import React from "react";

const MarketStat = () => {
  const marketStats = [
    {
      label: "Active Orders",
      value: "—",
      helper: "From your account",
    },
    {
      label: "Tracked Items",
      value: "—",
      helper: "Items you searched recently",
    },
    {
      label: "Recent Trades",
      value: "—",
      helper: "Latest transaction data",
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {marketStats.map((stat) => (
        <article
          key={stat.label}
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
        >
          <p className="text-sm text-zinc-400">{stat.label}</p>
          <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
          <p className="mt-2 text-xs text-zinc-500">{stat.helper}</p>
        </article>
      ))}
    </section>
  );
};

export default MarketStat;
