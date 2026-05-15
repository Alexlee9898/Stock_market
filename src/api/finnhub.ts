/**
 * 行情与日历 REST（经同源 /api/fproxy?p=子路径 转发；本地 Vite 与 Vercel Edge 一致）
 *
 * 其他可选数据源（可自行替换）：
 * - Financial Modeling Prep：财报/日历较全，免费档有日调用上限。
 * - Polygon（现品牌 Massive）：K 线与聚合行情。
 * - Alpha Vantage：入门友好，免费档较紧。
 * - 宏观日历：TradingEconomics 等独立服务。
 * - IPO：交易所与财经媒体日历等。
 */

const PREFIX = "/api/fproxy";

async function finnhubFetch(pathWithQuery: string): Promise<unknown> {
  const normalized = pathWithQuery.startsWith("/") ? pathWithQuery.slice(1) : pathWithQuery;
  const qMark = normalized.indexOf("?");
  const pathOnly = qMark === -1 ? normalized : normalized.slice(0, qMark);
  const existingQs = qMark === -1 ? "" : normalized.slice(qMark + 1);
  const params = new URLSearchParams(existingQs);
  params.set("p", pathOnly);
  const res = await fetch(`${PREFIX}?${params.toString()}`);
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("text/html")) {
    throw new Error("数据暂不可用，请稍后重试。");
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let extra = text;
    try {
      const j = JSON.parse(text) as { hint?: string; error?: string };
      if (j.hint) extra = `${j.error ?? ""} — ${j.hint}`;
      else if (j.error) extra = j.error;
    } catch {
      /* keep raw text */
    }
    throw new Error(`行情接口 HTTP ${res.status} ${extra}`.slice(0, 400));
  }
  return res.json() as Promise<unknown>;
}

async function finnhubPostJson(subPath: string, body: Record<string, unknown>): Promise<unknown> {
  const normalized = subPath.replace(/^\/+|\/+$/g, "");
  const params = new URLSearchParams();
  params.set("p", normalized);
  const res = await fetch(`${PREFIX}?${params.toString()}`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("text/html")) {
    throw new Error("数据暂不可用，请稍后重试。");
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let extra = text;
    try {
      const j = JSON.parse(text) as { hint?: string; error?: string };
      if (j.hint) extra = `${j.error ?? ""} — ${j.hint}`;
      else if (j.error) extra = j.error;
    } catch {
      /* keep raw text */
    }
    throw new Error(`行情接口 HTTP ${res.status} ${extra}`.slice(0, 400));
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

/** 去掉「交易所:代码」前缀并统一大小写，便于与 /quote 参数及 React 状态键一致 */
export function normalizeTickerSymbol(raw: string | undefined): string {
  if (!raw) return "";
  let s = raw.trim().toUpperCase();
  const colon = s.lastIndexOf(":");
  if (colon !== -1 && colon < s.length - 1) {
    s = s.slice(colon + 1).trim();
  }
  return s;
}

export function quoteHasDisplayablePrice(q: FinnhubQuote | null | undefined): boolean {
  if (!q) return false;
  const c = q.c;
  const pc = q.pc;
  return (typeof c === "number" && Number.isFinite(c) && c > 0) || (typeof pc === "number" && Number.isFinite(pc) && pc > 0);
}

export function quoteDisplayPrice(q: FinnhubQuote): number | null {
  if (typeof q.c === "number" && Number.isFinite(q.c) && q.c > 0) return q.c;
  if (typeof q.pc === "number" && Number.isFinite(q.pc) && q.pc > 0) return q.pc;
  return null;
}

export function quoteDisplayChangePercent(q: FinnhubQuote): number | null {
  if (q.dp != null && Number.isFinite(q.dp)) return q.dp;
  const price = quoteDisplayPrice(q);
  if (price != null && price > 0 && typeof q.pc === "number" && q.pc > 0) {
    return ((price - q.pc) / q.pc) * 100;
  }
  return null;
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

/** 股票筛选返回行（字段名随上游版本可能略有差异） */
export interface FinnhubScreenerRow {
  symbol?: string;
  name?: string;
  description?: string;
  marketCapitalization?: number;
  finnhubIndustry?: string;
}

export interface FinnhubSearchHit {
  description?: string;
  displaySymbol?: string;
  symbol?: string;
  type?: string;
  currency?: string;
}

function parseScreenerRows(data: unknown): FinnhubScreenerRow[] {
  if (!data || typeof data !== "object") return [];
  if ("error" in data) return [];
  if (Array.isArray(data)) return data as FinnhubScreenerRow[];
  const d = (data as { data?: unknown }).data;
  return Array.isArray(d) ? (d as FinnhubScreenerRow[]) : [];
}

/**
 * 美股市值筛选（Finnhub 筛选条件中市值单位为「百万美元」）。
 * @param minBillionUsd 最低市值，单位：十亿美元（例如 1000 表示 1 万亿美元）
 */
export async function screenUsStocksByMarketCapMinBillion(minBillionUsd: number): Promise<FinnhubScreenerRow[]> {
  const minMillionUsd = minBillionUsd * 1000;
  const primary = { exchange: "US", marketCapitalizationMin: minMillionUsd };
  const data = await finnhubPostJson("stock/screener", primary);
  const rows = parseScreenerRows(data);
  if (rows.length > 0) return rows;
  const alt = await finnhubPostJson("stock/screener", { exchange: "US", minMarketCapitalization: minMillionUsd });
  return parseScreenerRows(alt);
}

function unwrapSearchResults(data: unknown): FinnhubSearchHit[] {
  if (!data || typeof data !== "object") return [];
  if (Array.isArray(data)) return data as FinnhubSearchHit[];
  const o = data as { result?: unknown };
  if (!Array.isArray(o.result)) return [];
  return o.result as FinnhubSearchHit[];
}

function filterSearchHits(raw: FinnhubSearchHit[]): FinnhubSearchHit[] {
  return raw.filter((r) => {
    const sym = normalizeTickerSymbol(r.symbol);
    if (!sym || sym.length > 12) return false;
    const t = (r.type ?? "").toLowerCase();
    if (t.includes("etf") || t.includes("fund") || t.includes("warrant") || t.includes("crypto")) return false;
    const cur = (r.currency ?? "").toUpperCase();
    if (cur && cur !== "USD") return false;
    if (
      t.includes("common") ||
      t.includes("adr") ||
      t.includes("stock") ||
      t.includes("share") ||
      t.includes("equity")
    ) {
      return true;
    }
    if ((cur === "" || cur === "USD") && /^[A-Z][A-Z0-9.]{0,9}$/.test(sym)) return true;
    return false;
  });
}

/**
 * 全市场符号搜索：并行请求 `/search` 与 `/stock/symbol-search`，合并去重（提高可用性）。
 */
export async function searchStockSymbols(query: string): Promise<FinnhubSearchHit[]> {
  const q = query.trim();
  if (q.length < 1) return [];

  const enc = encodeURIComponent(q);
  const [resA, resB] = await Promise.allSettled([
    finnhubFetch(`search?q=${enc}`),
    finnhubFetch(`stock/symbol-search?q=${enc}&exchange=US`),
  ]);

  const a = resA.status === "fulfilled" ? unwrapSearchResults(resA.value) : [];
  const b = resB.status === "fulfilled" ? unwrapSearchResults(resB.value) : [];

  const bySym = new Map<string, FinnhubSearchHit>();
  for (const row of [...a, ...b]) {
    const k = normalizeTickerSymbol(row.symbol);
    if (!k) continue;
    if (!bySym.has(k)) {
      bySym.set(k, { ...row, symbol: k, displaySymbol: row.displaySymbol ?? k });
    }
  }

  const merged = [...bySym.values()];
  const filtered = filterSearchHits(merged);
  const seen = new Set<string>();
  const out: FinnhubSearchHit[] = [];
  for (const hit of filtered) {
    const k = normalizeTickerSymbol(hit.symbol);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push({
      ...hit,
      symbol: k,
      displaySymbol: hit.displaySymbol ?? k,
    });
  }

  if (out.length === 0 && resA.status === "rejected" && resB.status === "rejected") {
    const r = resA.reason;
    throw r instanceof Error ? r : new Error("搜索请求失败");
  }
  return out;
}

export function formatUsd(n: number, digits = 2) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: digits }).format(n);
}

export function formatPercent(n: number, digits = 2) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function formatBillionsUsdFromFinnhubMarketCap(billionsUsd: number | undefined) {
  if (billionsUsd == null || Number.isNaN(billionsUsd)) return "—";
  if (billionsUsd >= 1000) return `约 ${(billionsUsd / 1000).toFixed(2)} 万亿美元`;
  return `约 ${billionsUsd.toFixed(1)} 亿美元`;
}

/**
 * Finnhub `profile2` / 股票筛选等字段里的 `marketCapitalization` 单位为「百万美元」。
 * 先换算为十亿美元再交给 `formatBillionsUsdFromFinnhubMarketCap` 格式化为中文。
 */
export function formatMarketCapFromFinnhubMillionUsd(millionUsd: number | undefined): string {
  if (millionUsd == null || Number.isNaN(millionUsd)) return "—";
  const billionsUsd = millionUsd / 1000;
  return formatBillionsUsdFromFinnhubMarketCap(billionsUsd);
}

export function metricNumber(m: FinnhubMetric | undefined, key: string): number | undefined {
  const v = m?.metric?.[key];
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}
