import Header from "./components/Header";
import MarketStat from "./components/MarketStat";
import RecentTransaction from "./components/RecentTransaction";
import SearchItems from "./components/SearchItems";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8">
        <Header />
        <MarketStat />
        <SearchItems />
        <RecentTransaction />
      </section>
    </main>
  );
}
