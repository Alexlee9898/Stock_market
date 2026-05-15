import { useEffect, useState } from "react";
import type { FinnhubEpsHistoryRow, FinnhubMetric, FinnhubProfile, FinnhubQuote } from "../api/finnhub";
import { getEarningsHistory, getMetric, getProfile, getQuote } from "../api/finnhub";

export interface StockApiState {
  loading: boolean;
  error: string | null;
  quote: FinnhubQuote | null;
  profile: FinnhubProfile | null;
  metric: FinnhubMetric | null;
  epsHistory: FinnhubEpsHistoryRow[];
}

export function useStockApi(symbol: string): StockApiState {
  const [state, setState] = useState<StockApiState>({
    loading: true,
    error: null,
    quote: null,
    profile: null,
    metric: null,
    epsHistory: [],
  });

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, error: null, quote: null, profile: null, metric: null, epsHistory: [] });

    (async () => {
      try {
        const [quote, profile, metric, epsHistory] = await Promise.all([
          getQuote(symbol),
          getProfile(symbol),
          getMetric(symbol).catch(() => ({ metric: undefined })),
          getEarningsHistory(symbol, 12),
        ]);
        if (cancelled) return;
        setState({ loading: false, error: null, quote, profile, metric, epsHistory });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (cancelled) return;
        setState({ loading: false, error: msg, quote: null, profile: null, metric: null, epsHistory: [] });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [symbol]);

  return state;
}
