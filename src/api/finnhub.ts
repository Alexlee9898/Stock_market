/**
 * Finnhub REST（经 Vite 代理 /api/finnhub → https://finnhub.io/api/v1）
 *
 * 其他可选 API（可自行替换数据源）：
 * - Financial Modeling Prep：财报/日历较全，免费档约 250 次/天，需 apikey。
 * - Polygon（现品牌 Massive）：行情与 aggregates 强，免费档请求频率低。
 * - Alpha Vantage：适合入门，免费档额度紧、限速严。
 * - 宏观日历：TradingEconomics 等有独立套餐；Finnhub 已含 economic calendar。
 * - IPO：Finnhub /calendar/ipo；Renaissance Capital 另有免费档 IPO 日期接口（需单独注册）。
 */

const PREFIX = "/api/finnhub";

async function finnhubFetch(pathWithQuery: string): Promise<unknown> {
  const path = pathWithQuery.startsWith("/") ? pathWithQuery : `/${pathWithQuery}`;
  const res = await fetch(`${PREFIX}${path}`);
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("text/html")) {
    throw new Error("Finnhub 代理返回了 HTML 而非 JSON，多为部署里 /api 被错误重写到首页；请检查 vercel.json 是否排除 /api。");
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Finnhub HTTP ${res.status} ${text}`.slice(0, 200));
  }
  return res.json() as Promise<unknown>;
}

export interface FinnhubQuote {
  c: number;
  d: number | null;
  dp: number | null;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

export interface FinnhubProfile {
  country?: string;
  currency?: string;
  exchange?: string;
  finnhubIndustry?: string;
  ipo?: string;
  logo?: string;
  marketCapitalization?: number;
  name?: string;
  phone?: string;
  shareOutstanding?: number;
  ticker?: string;
  weburl?: string;
}

export interface FinnhubMetric {
  metric?: Record<string, number | string | null | undefined>;
}

export interface FinnhubEpsHistoryRow {
  actual?: number | null;
  estimate?: number | null;
  period?: string;
  quarter?: number;
  surprise?: number | null;
  symbol?: string;
  year?: number;
}

export interface FinnhubEarningsCalendarRow {
  date?: string;
  epsActual?: number | null;
  epsEstimate?: number | null;
  hour?: string;
  quarter?: number;
  revenueActual?: number | null;
  revenueEstimate?: number | null;
  symbol?: string;
  year?: number;
}

export interface FinnhubEconomicCalendarRow {
  actual?: number | null;
  country?: string;
  date?: string;
  estimate?: number | null;
  event?: string;
  impact?: string;
  prev?: number | null;
  time?: string;
  unit?: string;
}

export interface FinnhubIpoCalendarRow {
  date?: string;
  exchange?: string;
  name?: string;
  numberOfShares?: number | null;
  price?: string | number | null;
  status?: string;
  totalSharesValue?: number | null;
}

export function getQuote(symbol: string) {
  return finnhubFetch(`/quote?symbol=${encodeURIComponent(symbol)}`) as Promise<FinnhubQuote>;
}

export function getProfile(symbol: string) {
  return finnhubFetch(`/stock/profile2?symbol=${encodeURIComponent(symbol)}`) as Promise<FinnhubProfile>;
}

export function getMetric(symbol: string) {
  return finnhubFetch(`/stock/metric?symbol=${encodeURIComponent(symbol)}&metric=all`) as Promise<FinnhubMetric>;
}

/** 历史 EPS 惊喜（数组根） */
export async function getEarningsHistory(symbol: string, limit = 12) {
  const data = await finnhubFetch(`/stock/earnings?symbol=${encodeURIComponent(symbol)}&limit=${limit}`);
  return Array.isArray(data) ? (data as FinnhubEpsHistoryRow[]) : [];
}

export interface CalendarRange {
  from: string;
  to: string;
}

export async function getEarningsCalendar(range: CalendarRange) {
  const q = `from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}`;
  const data = (await finnhubFetch(`/calendar/earnings?${q}`)) as { earningsCalendar?: FinnhubEarningsCalendarRow[] };
  return data.earningsCalendar ?? [];
}

export async function getEconomicCalendar(range: CalendarRange) {
  const q = `from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}`;
  const data = (await finnhubFetch(`/calendar/economic?${q}`)) as { economicCalendar?: FinnhubEconomicCalendarRow[] };
  return data.economicCalendar ?? [];
}

export async function getIpoCalendar(range: CalendarRange) {
  const q = `from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}`;
  const raw = (await finnhubFetch(`/calendar/ipo?${q}`)) as { ipoCalendar?: FinnhubIpoCalendarRow[] } | FinnhubIpoCalendarRow[];
  if (Array.isArray(raw)) return raw;
  return raw.ipoCalendar ?? [];
}

export function formatUsd(n: number, digits = 2) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: digits }).format(n);
}

export function formatPercent(n: number, digits = 2) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function formatBillionsUsdFromFinnhubMarketCap(billions: number | undefined) {
  if (billions == null || Number.isNaN(billions)) return "—";
  if (billions >= 1000) return `约 ${(billions / 1000).toFixed(2)} 万亿美元`;
  return `约 ${billions.toFixed(1)} 亿美元`;
}

export function metricNumber(m: FinnhubMetric | undefined, key: string): number | undefined {
  const v = m?.metric?.[key];
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}
