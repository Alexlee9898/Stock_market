import { useEffect, useMemo, useState } from "react";
import type { FinnhubQuote } from "../api/finnhub";
import { getQuote } from "../api/finnhub";
import { DataSourceNote } from "../components/DataSourceNote";
import { StockCard } from "../components/StockCard";
import { hotStocks } from "../data/stocks";

export function Home() {
  const [quotes, setQuotes] = useState<Record<string, FinnhubQuote | null>>({});
  const [noteVariant, setNoteVariant] = useState<"demo" | "live" | "loading" | "error">("loading");
  const [noteDetail, setNoteDetail] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    setNoteVariant("loading");
    setNoteDetail(undefined);

    (async () => {
      const results = await Promise.allSettled(hotStocks.map((s) => getQuote(s.symbol)));
      if (cancelled) return;

      const next: Record<string, FinnhubQuote | null> = {};
      let anyLive = false;
      const errors: string[] = [];

      results.forEach((r, i) => {
        const sym = hotStocks[i].symbol;
        if (r.status === "fulfilled" && r.value.c > 0) {
          next[sym] = r.value;
          anyLive = true;
        } else {
          next[sym] = null;
          if (r.status === "rejected") errors.push(r.reason instanceof Error ? r.reason.message : String(r.reason));
        }
      });

      setQuotes(next);
      if (anyLive) {
        setNoteVariant("live");
        setNoteDetail(undefined);
      } else if (errors.length) {
        setNoteVariant("error");
        setNoteDetail(errors[0]);
      } else {
        setNoteVariant("demo");
        setNoteDetail(undefined);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const sortedStocks = useMemo(() => hotStocks, []);

  return (
    <main className="page">
      <DataSourceNote variant={noteVariant} detail={noteDetail} />

      <section className="hero">
        <p className="hero-eyebrow">学习 · 观察 · 不做投资建议</p>
        <h1 className="hero-title">
          用清晰界面，
          <br />
          走近美股公司与财经日程。
        </h1>
        <p className="hero-sub">
          首页展示热门标的；配置 Finnhub 密钥后，卡片上可显示最新报价（延迟依数据源规则）。中文解读仍以本地教学稿为主。
        </p>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">热门美股</h2>
          <p className="section-desc">点击卡片查看公司信息、关键指标与财报相关字段（并与 Finnhub 数据合并展示）。</p>
        </div>
        <div className="stock-grid">
          {sortedStocks.map((s) => (
            <StockCard key={s.symbol} stock={s} quote={quotes[s.symbol]} quoteLoading={noteVariant === "loading"} />
          ))}
        </div>
      </section>
    </main>
  );
}
