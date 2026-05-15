import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { FinnhubQuote } from "../api/finnhub";
import { formatPercent, formatUsd } from "../api/finnhub";
import type { HotStock } from "../types";

interface Props {
  stock: HotStock;
  quote?: FinnhubQuote | null;
  quoteLoading?: boolean;
}

export function StockCard({ stock, quote, quoteLoading }: Props) {
  const to = `/stock/${encodeURIComponent(stock.symbol)}`;
  const live = quote && quote.c > 0;

  return (
    <Link to={to} className="stock-card" style={{ "--accent": stock.accent } as CSSProperties}>
      <div className="stock-card-top">
        <span className="stock-card-symbol">{stock.symbol}</span>
        <span className="stock-card-chevron" aria-hidden>
          →
        </span>
      </div>
      <h3 className="stock-card-name">{stock.nameZh}</h3>
      <p className="stock-card-en">{stock.name}</p>
      <p className="stock-card-tag">{stock.tagline}</p>
      <div className="stock-card-live" aria-live="polite">
        {quoteLoading && !live ? <span className="stock-card-live-muted">报价加载中…</span> : null}
        {live ? (
          <>
            <span className="stock-card-price">{formatUsd(quote.c)}</span>
            {quote.dp != null ? (
              <span className={"stock-card-change" + (quote.dp < 0 ? " stock-card-change--down" : "")}>
                {formatPercent(quote.dp)}
              </span>
            ) : null}
          </>
        ) : null}
        {!quoteLoading && !live ? <span className="stock-card-live-muted">演示卡片 · 点进详情</span> : null}
      </div>
    </Link>
  );
}
