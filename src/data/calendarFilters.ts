/**
 * 财经日历过滤：减少噪音，仅保留对用户研究价值较高的事件。
 * （底层仍来自同一日历接口，此处为展示层筛选。）
 */

import type { FinnhubEarningsCalendarRow, FinnhubEconomicCalendarRow, FinnhubIpoCalendarRow } from "../api/finnhub";

/** 财报日历：仅展示知名度高或近期关注度高的美股（可按需增删） */
export const EARNINGS_WATCHLIST = new Set(
  [
    "AAPL",
    "MSFT",
    "GOOGL",
    "GOOG",
    "META",
    "AMZN",
    "NVDA",
    "TSLA",
    "AMD",
    "NFLX",
    "AVGO",
    "CRM",
    "ORCL",
    "ADBE",
    "INTC",
    "MU",
    "QCOM",
    "TXN",
    "AMAT",
    "NOW",
    "PANW",
    "SNOW",
    "PLTR",
    "MSTR",
    "COIN",
    "HOOD",
    "SOFI",
    "JPM",
    "BAC",
    "GS",
    "MS",
    "C",
    "WFC",
    "BLK",
    "SCHW",
    "XOM",
    "CVX",
    "COP",
    "WMT",
    "COST",
    "HD",
    "TGT",
    "MCD",
    "SBUX",
    "NKE",
    "DIS",
    "JNJ",
    "UNH",
    "LLY",
    "ABBV",
    "MRK",
    "PFE",
    "PG",
    "KO",
    "PEP",
    "V",
    "MA",
    "AXP",
    "BA",
    "CAT",
    "UPS",
    "FDX",
    "LMT",
    "RTX",
    "NOC",
    "IBM",
    "GE",
    "SPGI",
    "ISRG",
    "DELL",
    "HPE",
    "SHOP",
    "UBER",
    "ABNB",
    "BKNG",
    "MAR",
    "PYPL",
    "BRK.B",
    "BRK.A",
  ].map((s) => s.toUpperCase()),
);

const US = "US";

/** 美联储 / 议息相关（标题匹配） */
export function isFedRelatedTitle(title: string) {
  return /fomc|federal reserve|fed funds|interest rate decision|powell|美联储|联储|点阵图|经济预测摘要|纪要|press conference|summary of economic projections|dot plot|beige book/i.test(
    title,
  );
}

/**
 * 美国宏观：排除中小经济体；仅保留美联储 / 议息 / CPI·PCE·非农·GDP 等市场高度关注的指标。
 */
export function passesUsMajorMacro(row: FinnhubEconomicCalendarRow): boolean {
  const country = (row.country ?? "").trim().toUpperCase();
  if (country !== US) return false;

  const title = (row.event ?? "").trim();
  if (!title) return false;
  if (isFedRelatedTitle(title)) return true;

  const t = title.toLowerCase();
  /** 仅保留对利率与风险偏好影响最大的几类美国数据，避免 ISM、地产细分等刷屏 */
  return /consumer price|\bcpi\b|core cpi|pce|core pce|non[- ]?farm|nonfarm|payrolls|employment situation|job(s)? report|^gdp|advance gdp|preliminary gdp|final gdp|gross domestic|retail sales|initial claims|jobless claims/i.test(
    t,
  );
}

export function passesEarningsWatchlist(row: FinnhubEarningsCalendarRow): boolean {
  const sym = row.symbol?.trim().toUpperCase();
  return Boolean(sym && EARNINGS_WATCHLIST.has(sym));
}

/** IPO：仅美国主要交易所，减少小众市场噪音 */
export function passesUsMajorIpo(row: FinnhubIpoCalendarRow): boolean {
  const ex = (row.exchange ?? "").toUpperCase();
  return /NASDAQ|NYSE|AMEX|ARCA|BATS/.test(ex);
}
