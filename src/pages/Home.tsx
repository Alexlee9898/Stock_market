import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
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
import type { EquityMarket, HotStock } from "../types";
import { accentFromSymbol } from "../utils/symbolAccent";

type HomeMarket = EquityMarket;

const HOME_MARKET_LABEL: Record<HomeMarket, string> = {
  us: "美股",
  cn: "A股",
  hk: "港股",
};

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
  const [market, setMarket] = useState<HomeMarket>("us");
  const [megaStocks, setMegaStocks] = useState<HotStock[]>([]);
  const [megaLoading, setMegaLoading] = useState(true);
  const [quotes, setQuotes] = useState<Record<string, FinnhubQuote | null>>({});
  const [quotesLoading, setQuotesLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setMegaLoading(true);

    (async () => {
      try {
        const rows = sortMegaCaps(await screenUsStocksByMarketCapMinBillion(MEGA_MIN_BILLION));
        if (cancelled) return;
        const mapped = rows.map(screenerRowToHotStock).filter(Boolean) as HotStock[];
        if (mapped.length > 0) {
          setMegaStocks(mergeExtraMegaStocks(mapped));
        } else {
          setMegaStocks(fallbackToHotStocks());
        }
      } catch {
        if (cancelled) return;
        setMegaStocks(fallbackToHotStocks());
      } finally {
        if (!cancelled) setMegaLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (market !== "us" || megaStocks.length === 0) return;
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
  }, [market, megaStocks]);

  const sortedStocks = useMemo(() => {
    return [...megaStocks].sort((a, b) => a.symbol.localeCompare(b.symbol));
  }, [megaStocks]);

  return (
    <main className="page">
      <section className="hero">
        <p className="hero-eyebrow">Stock Learning</p>
        <h1 className="hero-title">
          股票学习
          <br />
          公司 · 财报 · 财经日程
        </h1>
        <p className="hero-sub">覆盖美股、A股、港股；行情与自选列表逐步完善中</p>

        <div className="market-filter home-market-filter" role="tablist" aria-label="市场切换">
          {(["us", "cn", "hk"] as const).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={market === key}
              className={"market-chip" + (market === key ? " market-chip--active" : "")}
              onClick={() => setMarket(key)}
            >
              {HOME_MARKET_LABEL[key]}
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">热门{HOME_MARKET_LABEL[market]}</h2>
          {market === "us" ? <StockSearch inline /> : null}
        </div>

        {market === "us" ? (
          <>
            {megaLoading ? <p className="muted">正在加载大盘股列表…</p> : null}
            <div className="stock-grid">
              {sortedStocks.map((s) => {
                const qKey = normalizeTickerSymbol(s.symbol);
                return <StockCard key={s.symbol} stock={s} quote={quotes[qKey]} quoteLoading={quotesLoading} />;
              })}
            </div>
          </>
        ) : (
          <div className="panel home-market-soon">
            <p className="panel-prose">
              {HOME_MARKET_LABEL[market]}行情、搜索与热门列表即将上线。可先前往
              <Link to="/industries" className="text-link">
                {" "}
                产业研究
              </Link>
              ，在对应板块中按市场筛选查看 {HOME_MARKET_LABEL[market]} 核心标的。
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
