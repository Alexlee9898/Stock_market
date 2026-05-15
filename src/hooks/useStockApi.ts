import { useEffect, useState } from "react";
import type {
  FinnhubEpsHistoryRow,
  FinnhubMetric,
  FinnhubProfile,
  FinnhubQuote,
  ParsedQuarterFinancials,
} from "../api/finnhub";
import { getEarningsHistory, getIncomeStatementQuarterly, getMetric, getProfile, getQuote } from "../api/finnhub";

export interface StockApiState {
  loading: boolean;
  error: string | null;
  quote: FinnhubQuote | null;
  profile: FinnhubProfile | null;
  metric: FinnhubMetric | null;
  epsHistory: FinnhubEpsHistoryRow[];
  incomeQuarters: ParsedQuarterFinancials[];
}

export function useStockApi(symbol: string): StockApiState {
  const [state, setState] = useState<StockApiState>({
    loading: true,
    error: null,
    quote: null,
    profile: null,
    metric: null,
    epsHistory: [],
    incomeQuarters: [],
  });

  useEffect(() => {
    let cancelled = false;
    setState({
      loading: true,
      error: null,
      quote: null,
      profile: null,
      metric: null,
      epsHistory: [],
      incomeQuarters: [],
    });

    (async () => {
      try {
        const [quote, profile, metric, epsHistory, incomeQuarters] = await Promise.all([
          getQuote(symbol),
          getProfile(symbol),
          getMetric(symbol).catch(() => ({ metric: undefined })),
          getEarningsHistory(symbol, 12),
          getIncomeStatementQuarterly(symbol).catch(() => [] as ParsedQuarterFinancials[]),
        ]);
        if (cancelled) return;
        setState({ loading: false, error: null, quote, profile, metric, epsHistory, incomeQuarters });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (cancelled) return;
        setState({
          loading: false,
          error: msg,
          quote: null,
          profile: null,
          metric: null,
          epsHistory: [],
          incomeQuarters: [],
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [symbol]);

  return state;
}
