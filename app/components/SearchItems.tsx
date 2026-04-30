import React from "react";

const SearchItems = () => {
  const quickActions = [
    {
      title: "Browse Items",
      description: "Search all tradable Warframe items.",
      href: "/items",
    },
    {
      title: "My Orders",
      description: "Manage your active buy and sell orders.",
      href: "/orders/my",
    },
    {
      title: "Create Order",
      description: "Post a new buy or sell listing.",
      href: "/orders/new",
    },
    {
      title: "Recent Transactions",
      description: "Check recent market activity.",
      href: "/transactions",
    },
  ];
  return (
    <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Find an item</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Start by searching for a Prime part, mod, arcane, relic, or other
              tradable item.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search item name..."
            className="min-h-11 flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-400"
          />

          <button className="min-h-11 rounded-xl bg-cyan-400 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-300">
            Search Market
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {quickActions.map((action) => (
            <a
              key={action.title}
              href={action.href}
              className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 transition hover:border-cyan-400/50 hover:bg-zinc-950"
            >
              <h3 className="font-medium text-zinc-100">{action.title}</h3>
              <p className="mt-2 text-sm leading-5 text-zinc-500">
                {action.description}
              </p>
            </a>
          ))}
        </div>
      </div>

      <aside className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-xl font-semibold">My Orders</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Your active listings will appear here once connected to
          <code className="mx-1 rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-300">
            GET /api/orders/my
          </code>
          .
        </p>

        <div className="mt-6 space-y-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Sell Orders</p>
              <span className="text-sm text-zinc-500">—</span>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Buy Orders</p>
              <span className="text-sm text-zinc-500">—</span>
            </div>
          </div>
        </div>

        <a
          href="/orders/my"
          className="mt-6 inline-flex min-h-10 w-full items-center justify-center rounded-xl border border-zinc-700 text-sm font-medium text-zinc-200 transition hover:border-cyan-400/60 hover:text-cyan-200"
        >
          View My Orders
        </a>
      </aside>
    </section>
  );
};

export default SearchItems;
