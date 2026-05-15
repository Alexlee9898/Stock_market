import { useEffect, useMemo, useRef, useState } from "react";
import type { FinnhubQuote, FinnhubScreenerRow } from "../api/finnhub";
import {
  getQuote,
  formatMarketCapFromFinnhubMillionUsd,
  normalizeTickerSymbol,
  quoteHasDisplayablePrice,
  screenUsStocksByMarketCapMinBillion,
} from "../api/finnhub";
import { StockCard } from "../components/StockCard";
import { StockSearch } from "../components/StockSearch";
import { MEGA_CAP_FALLBACK_TICKERS, MEGA_EXTRA_TICKERS, MEGA_FALLBACK_CARD_META } from "../data/megaCapFallback";
import type { HotStock } from "../types";
import { accentFromSymbol } from "../utils/symbolAccent";

/** 1 万亿美元 = 1000 「十亿美元」档位，与 screenUsStocksByMarketCapMinBillion 参数一致 */
const MEGA_MIN_BILLION = 1000;

function screenerRowToHotStock(row: FinnhubScreenerRow): HotStock | null {
  const symbol = normalizeTickerSymbol(row.symbol);
  if (!symbol) return null;
  const name = (row.description ?? row.name ?? symbol).trim() || symbol;
  const mcap =
    row.marketCapitalization != null && Number.isFinite(row.marketCapitalization)
      ? formatMarketCapFromFinnhubMillionUsd(row.marketCapitalization)
      : null;
  const industry =
    typeof row.finnhubIndustry === "string" && row.finnhubIndustry.trim() ? row.finnhubIndustry.trim() : "";
  const tagline =
    mcap && mcap !== "—"
      ? industry
        ? `${mcap} · ${industry}`
        : `${mcap} · 美股`
      : industry
        ? `${industry} · 美股`
        : "美股 · 总市值 ≥ 1 万亿美元";
  return {
    symbol,
    name,
    nameZh: name,
    tagline,
    accent: accentFromSymbol(symbol),
  };
}

function fallbackToHotStocks(): HotStock[] {
  return MEGA_CAP_FALLBACK_TICKERS.map((symbol) => {
    const meta = MEGA_FALLBACK_CARD_META[symbol];
    return {
      symbol,
      name: meta?.name ?? symbol,
      nameZh: meta?.nameZh ?? symbol,
      tagline: meta?.tagline ?? "美股 · 市值筛选暂不可用（以下为常见万亿市值标的）",
      accent: accentFromSymbol(symbol),
    };
  });
}

function sortMegaCaps(rows: FinnhubScreenerRow[]): FinnhubScreenerRow[] {
  return [...rows].sort((a, b) => (b.marketCapitalization ?? 0) - (a.marketCapitalization ?? 0));
}

/** 将用户指定标的并入列表（去重），用于万亿筛选之外仍展示 Tesla 等 */
function mergeExtraMegaStocks(mapped: HotStock[]): HotStock[] {
  const have = new Set(mapped.map((m) => m.symbol));
  const extra: HotStock[] = [];
  for (const sym of MEGA_EXTRA_TICKERS) {
    if (have.has(sym)) continue;
    const meta = MEGA_FALLBACK_CARD_META[sym];
    extra.push({
      symbol: sym,
      name: meta?.name ?? sym,
      nameZh: meta?.nameZh ?? sym,
      tagline: meta?.tagline ?? "美股",
      accent: accentFromSymbol(sym),
    });
  }
  return [...mapped, ...extra];
}

async function loadQuotesChunked(symbols: string[], chunk = 10): Promise<Record<string, FinnhubQuote | null>> {
  const uniq = [...new Set(symbols.map((s) => normalizeTickerSymbol(s)).filter(Boolean))];
  const out: Record<string, FinnhubQuote | null> = {};
  for (let i = 0; i < uniq.length; i += chunk) {
    const part = uniq.slice(i, i + chunk);
    const settled = await Promise.allSettled(part.map((s) => getQuote(s)));
    settled.forEach((r, j) => {
      const sym = part[j];
      out[sym] = r.status === "fulfilled" && quoteHasDisplayablePrice(r.value) ? r.value : null;
    });
    if (i + chunk < uniq.length) {
      await new Promise((r) => setTimeout(r, 80));
    }
  }
  return out;
}

export function Home() {
  const quoteFetchGen = useRef(0);
  const [megaStocks, setMegaStocks] = useState<HotStock[]>([]);
  const [megaLoading, setMegaLoading] = useState(true);
  const [megaError, setMegaError] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<Record<string, FinnhubQuote | null>>({});
  const [quotesLoading, setQuotesLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setMegaLoading(true);
    setMegaError(null);

    (async () => {
      try {
        const rows = sortMegaCaps(await screenUsStocksByMarketCapMinBillion(MEGA_MIN_BILLION));
        if (cancelled) return;
        const mapped = rows.map(screenerRowToHotStock).filter(Boolean) as HotStock[];
        if (mapped.length > 0) {
          setMegaStocks(mergeExtraMegaStocks(mapped));
          setMegaError(null);
        } else {
          setMegaStocks(fallbackToHotStocks());
          setMegaError("筛选结果为空，已展示备选名单（约 1 万亿美元市值公司）。");
        }
      } catch (e) {
        if (cancelled) return;
        setMegaStocks(fallbackToHotStocks());
        setMegaError(e instanceof Error ? e.message : "加载市值筛选失败");
      } finally {
        if (!cancelled) setMegaLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (megaStocks.length === 0) return;
    const gen = ++quoteFetchGen.current;
    let cancelled = false;
    setQuotesLoading(true);

    (async () => {
      const syms = megaStocks.map((s) => normalizeTickerSymbol(s.symbol)).filter(Boolean);
      const next = await loadQuotesChunked(syms);
      if (cancelled || gen !== quoteFetchGen.current) return;
      setQuotes(next);
      setQuotesLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [megaStocks]);

  const sortedStocks = useMemo(() => {
    return [...megaStocks].sort((a, b) => a.symbol.localeCompare(b.symbol));
  }, [megaStocks]);

  return (
    <main className="page">
      <section className="hero">
        <p className="hero-eyebrow">US Market Terminal</p>
        <h1 className="hero-title">
          美股数据终端
          <br />
          公司 · 财报 · 财经日程
        </h1>
        <p className="hero-sub">实时行情、产业研究、财经日历一体化视图</p>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">热门美股</h2>
          <StockSearch inline />
        </div>

        {megaError ? <p className="stock-mega-hint muted">{megaError}</p> : null}
        {megaLoading ? <p className="muted">正在加载大盘股列表…</p> : null}

        <div className="stock-grid">
          {sortedStocks.map((s) => {
            const qKey = normalizeTickerSymbol(s.symbol);
            return <StockCard key={s.symbol} stock={s} quote={quotes[qKey]} quoteLoading={quotesLoading} />;
          })}
        </div>
      </section>
    </main>
  );
}
