import { useEffect, useMemo, useState } from "react";
import type { FinnhubQuote } from "../api/finnhub";
import { getQuote } from "../api/finnhub";
import { StockCard } from "../components/StockCard";
import { hotStocks } from "../data/stocks";

export function Home() {
  const [quotes, setQuotes] = useState<Record<string, FinnhubQuote | null>>({});
  const [quotesLoading, setQuotesLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setQuotesLoading(true);

    (async () => {
      const results = await Promise.allSettled(hotStocks.map((s) => getQuote(s.symbol)));
      if (cancelled) return;

      const next: Record<string, FinnhubQuote | null> = {};
      results.forEach((r, i) => {
        const sym = hotStocks[i].symbol;
        if (r.status === "fulfilled" && r.value.c > 0) {
          next[sym] = r.value;
        } else {
          next[sym] = null;
        }
      });

      setQuotes(next);
      setQuotesLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const sortedStocks = useMemo(() => hotStocks, []);

  return (
    <main className="page">
      <section className="hero">
        <h1 className="hero-title">
          用清晰界面，
          <br />
          走近美股公司与财经日程。
        </h1>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">热门美股</h2>
          <p className="section-desc">点击卡片查看公司信息、关键指标与财报相关字段（并与 Finnhub 数据合并展示）。</p>
        </div>
        <div className="stock-grid">
          {sortedStocks.map((s) => (
            <StockCard key={s.symbol} stock={s} quote={quotes[s.symbol]} quoteLoading={quotesLoading} />
          ))}
        </div>
      </section>
    </main>
  );
}
