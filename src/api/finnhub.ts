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
  /** 单季营收，Finnhub 常见为「百万美元」；大数时也可能为「美元」 */
  revenueActual?: number | null;
  revenueEstimate?: number | null;
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

/** 从 metric=all 中尝试多个市盈率字段（新股/亏损股字段可能不齐） */
export function metricPeTtmBest(m: FinnhubMetric | undefined): number | undefined {
  const keys = [
    "peTTM",
    "peBasicExclExtraTTM",
    "peNormalizedAnnual",
    "peAnnual",
    "trailingPE",
    "peInclExtraTTM",
    "peExclExtraTTM",
  ];
  for (const k of keys) {
    const v = metricNumber(m, k);
    if (v != null && Number.isFinite(v) && Math.abs(v) < 1e6) return v;
  }
  return undefined;
}

/** 股息率（小数形式，如 0.02 表示 2%） */
export function metricDividendYieldFraction(m: FinnhubMetric | undefined): number | undefined {
  const keys = ["dividendYieldIndicatedAnnual", "dividendYieldTTM", "dividendYieldIndicatedAnnualDiluted"];
  for (const k of keys) {
    const v = metricNumber(m, k);
    if (v != null && Number.isFinite(v) && v >= 0 && v < 0.5) return v;
  }
  return undefined;
}

/**
 * Finnhub profile2：`shareOutstanding` 为百万股，`marketCapitalization` 为百万美元。
 * 用 股价×流通股 与 API 市值比对，偏差过大时以前者为准（修正部分标的 API 市值陈旧/错误）。
 */
export function formatMarketCapResolved(profile: FinnhubProfile | undefined, quote: FinnhubQuote | null | undefined): string {
  const apiMil = profile?.marketCapitalization;
  const p = quote && quote.c > 0 ? quote.c : undefined;
  const sharesMil = profile?.shareOutstanding;
  let computedMil: number | undefined;
  if (p != null && sharesMil != null && Number.isFinite(sharesMil) && sharesMil > 0) {
    computedMil = p * sharesMil;
  }
  if (computedMil != null && apiMil != null && apiMil > 0) {
    const hi = Math.max(computedMil, apiMil);
    const lo = Math.min(computedMil, apiMil);
    if (hi / lo > 4) {
      return formatMarketCapFromFinnhubMillionUsd(computedMil);
    }
    return formatMarketCapFromFinnhubMillionUsd(apiMil);
  }
  if (apiMil != null) return formatMarketCapFromFinnhubMillionUsd(apiMil);
  if (computedMil != null) return formatMarketCapFromFinnhubMillionUsd(computedMil);
  return "—";
}

/**
 * 52 周高低若与现价严重脱节（常见为数据源串线），返回 null 以提示用户核对。
 */
export function safe52WeekHighLow(
  high: number | undefined,
  low: number | undefined,
  lastUsd: number | undefined,
): { high: number; low: number } | null {
  if (high == null || low == null || lastUsd == null) return null;
  if (!Number.isFinite(high) || !Number.isFinite(low) || !Number.isFinite(lastUsd)) return null;
  if (lastUsd <= 0 || low <= 0 || high < low) return null;
  if (high / lastUsd > 4 || lastUsd / low > 4) return null;
  return { high, low };
}

/**
 * Finnhub 财报日历与 earnings 历史中的 year/quarter 为财年/财季（fiscal），非自然年。
 * 例如 NVDA 在 2026 年 5 月披露的是 FY2027 Q1（财年截至约 2026 年 4 月）。
 */
export function formatFiscalQuarterLabel(year: number, quarter: number): string {
  const yy = year >= 2000 ? String(year).slice(-2) : String(year);
  return `FY${yy} Q${quarter}`;
}

/** Finnhub /stock/earnings 的 revenueActual → 十亿美元（启发式） */
export function revenueActualToBillionsUsd(revenue: number | null | undefined): number | undefined {
  if (revenue == null || !Number.isFinite(revenue) || revenue <= 0) return undefined;
  if (revenue >= 1e8) return revenue / 1e9;
  return revenue / 1000;
}

/** 标准化利润表单季（已换算为十亿美元） */
export interface ParsedQuarterFinancials {
  period: string;
  revenueBillions: number;
  grossProfitBillions?: number;
  operatingIncomeBillions?: number;
  netIncomeBillions?: number;
  grossMarginPercent?: number;
  operatingMarginPercent?: number;
  netMarginPercent?: number;
}

const IC_REVENUE_KEYS = ["revenue", "totalRevenue", "salesRevenue", "revenues"];
const IC_GROSS_KEYS = ["grossProfit", "grossIncome"];
const IC_OPERATING_KEYS = ["operatingIncome", "operatingIncomeLoss", "ebit", "operatingProfit"];
const IC_NET_KEYS = ["netIncome", "netIncomeLoss", "netIncomeApplicableToCommonShares"];

function icRowAmount(row: Record<string, unknown>, keys: string[]): number | undefined {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "number" && Number.isFinite(v) && v !== 0) return v;
  }
  return undefined;
}

/** 标准化利润表金额 → 十亿美元（≥1e8 视为美元，否则视为百万美元） */
export function financialAmountToBillionsUsd(amount: number | undefined): number | undefined {
  if (amount == null || !Number.isFinite(amount) || amount <= 0) return undefined;
  if (amount >= 1e8) return amount / 1e9;
  return amount / 1000;
}

function marginFromParts(numerator: number | undefined, revenue: number | undefined): number | undefined {
  if (numerator == null || revenue == null || revenue <= 0) return undefined;
  return (numerator / revenue) * 100;
}

export function parseIncomeStatementFinancials(data: unknown): ParsedQuarterFinancials[] {
  const rows = Array.isArray((data as { financials?: unknown })?.financials)
    ? ((data as { financials: unknown[] }).financials ?? [])
    : [];
  const out: ParsedQuarterFinancials[] = [];

  for (const raw of rows) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const period = typeof r.period === "string" ? r.period.trim() : "";
    const revRaw = icRowAmount(r, IC_REVENUE_KEYS);
    if (!period || revRaw == null || revRaw <= 0) continue;

    const revenueBillions = financialAmountToBillionsUsd(revRaw);
    if (revenueBillions == null) continue;

    const gpRaw = icRowAmount(r, IC_GROSS_KEYS);
    const oiRaw = icRowAmount(r, IC_OPERATING_KEYS);
    const niRaw = icRowAmount(r, IC_NET_KEYS);

    out.push({
      period,
      revenueBillions,
      grossProfitBillions: financialAmountToBillionsUsd(gpRaw),
      operatingIncomeBillions: financialAmountToBillionsUsd(oiRaw),
      netIncomeBillions: financialAmountToBillionsUsd(niRaw),
      grossMarginPercent: marginFromParts(gpRaw, revRaw),
      operatingMarginPercent: marginFromParts(oiRaw, revRaw),
      netMarginPercent: marginFromParts(niRaw, revRaw),
    });
  }

  out.sort((a, b) => b.period.localeCompare(a.period));
  return out;
}

export function computeRevenueYoyPercent(
  latest: ParsedQuarterFinancials,
  all: ParsedQuarterFinancials[],
): number | undefined {
  const t = Date.parse(latest.period.slice(0, 10));
  if (Number.isNaN(t)) return undefined;
  const target = t - 365.25 * 86400000;
  let prior: ParsedQuarterFinancials | undefined;
  let bestDiff = Infinity;
  for (const q of all) {
    if (q.period === latest.period) continue;
    const qt = Date.parse(q.period.slice(0, 10));
    if (Number.isNaN(qt)) continue;
    const diff = Math.abs(qt - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      prior = q;
    }
  }
  if (!prior || bestDiff > 50 * 86400000 || prior.revenueBillions <= 0) return undefined;
  return ((latest.revenueBillions - prior.revenueBillions) / prior.revenueBillions) * 100;
}

/** metric 中的利润率：可能是 0–1 小数或已为百分数 */
export function metricMarginPercent(m: FinnhubMetric | undefined, keys: string[]): number | undefined {
  for (const k of keys) {
    const v = metricNumber(m, k);
    if (v == null || !Number.isFinite(v)) continue;
    if (v > 0 && v <= 1) return v * 100;
    if (v > 1 && v <= 100) return v;
  }
  return undefined;
}

export async function getIncomeStatementQuarterly(symbol: string): Promise<ParsedQuarterFinancials[]> {
  const data = await finnhubFetch(
    `/stock/financials?symbol=${encodeURIComponent(symbol)}&statement=ic&freq=quarterly`,
  );
  return parseIncomeStatementFinancials(data);
}
