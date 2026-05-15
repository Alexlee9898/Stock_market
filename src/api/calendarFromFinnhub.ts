import { upcomingEvents } from "../data/events";
import type { CalendarEvent } from "../types";
import type {
  FinnhubEarningsCalendarRow,
  FinnhubEconomicCalendarRow,
  FinnhubIpoCalendarRow,
} from "./finnhub";
import { getEarningsCalendar, getEconomicCalendar, getIpoCalendar, type CalendarRange } from "./finnhub";

function isFedEvent(text: string) {
  return /fomc|federal reserve|fed funds|interest rate decision|powell|美联储|联储议息/i.test(text);
}

function hourLabel(hour: string | undefined) {
  if (!hour) return undefined;
  const h = hour.toLowerCase();
  if (h === "bmo" || h === "am") return "美东盘前";
  if (h === "amc" || h === "pm") return "美东盘后";
  if (h === "dmh") return "美东盘中";
  return `美东 ${hour}`;
}

function economicEventDate(row: FinnhubEconomicCalendarRow): string | undefined {
  if (row.time && row.time.length >= 10) return row.time.slice(0, 10);
  if (row.date && row.date.length >= 10) return row.date.slice(0, 10);
  return undefined;
}

function mapEconomicRow(row: FinnhubEconomicCalendarRow, idx: number): CalendarEvent | null {
  const title = row.event?.trim();
  if (!title) return null;
  const date = economicEventDate(row);
  if (!date) return null;
  const fed = isFedEvent(title);
  const impact = row.impact ? `影响：${row.impact}` : "";
  const country = row.country ? `国家/地区：${row.country}` : "";
  const parts = [country, impact].filter(Boolean);
  return {
    id: `fh-eco-${date}-${idx}-${title.slice(0, 40)}`,
    date,
    time: row.time && row.time.length > 10 ? `UTC ${row.time.replace("T", " ").slice(11, 19)}` : undefined,
    title,
    category: fed ? "fed" : "macro",
    detail: parts.length ? parts.join(" · ") : undefined,
  };
}

function formatRevenueUsd(v: number) {
  const abs = Math.abs(v);
  if (abs >= 1e12) return `${(v / 1e12).toFixed(2)}T 美元`;
  if (abs >= 1e9) return `${(v / 1e9).toFixed(2)}B 美元`;
  if (abs >= 1e6) return `${(v / 1e6).toFixed(1)}M 美元`;
  return `${v.toFixed(0)} 美元`;
}

function mapEarningsRow(row: FinnhubEarningsCalendarRow, idx: number): CalendarEvent | null {
  const sym = row.symbol?.trim();
  const date = row.date?.trim();
  if (!sym || !date) return null;
  const q = row.quarter != null && row.year != null ? `${row.year} Q${row.quarter}` : "财报";
  const title = `${sym} 财报（${q}）`;
  const eps =
    row.epsEstimate != null
      ? `EPS 预期约 ${row.epsEstimate.toFixed(2)}${row.epsActual != null ? `，公布 ${row.epsActual.toFixed(2)}` : ""}`
      : undefined;
  const rev =
    row.revenueEstimate != null
      ? `营收预期约 ${formatRevenueUsd(row.revenueEstimate)}${
          row.revenueActual != null ? `，公布 ${formatRevenueUsd(row.revenueActual)}` : ""
        }`
      : undefined;
  const detail = [eps, rev].filter(Boolean).join(" · ") || undefined;
  return {
    id: `fh-earn-${date}-${sym}-${idx}`,
    date,
    time: hourLabel(row.hour),
    title,
    category: "earnings",
    symbol: sym,
    detail,
  };
}

function mapIpoRow(row: FinnhubIpoCalendarRow, idx: number): CalendarEvent | null {
  const name = row.name?.trim();
  const date = row.date?.trim();
  if (!name || !date) return null;
  const ex = row.exchange ? `交易所：${row.exchange}` : "";
  const price = row.price != null && row.price !== "" ? `招股价区间/定价：${row.price}` : "";
  const status = row.status ? `状态：${row.status}` : "";
  const detail = [ex, price, status].filter(Boolean).join(" · ") || undefined;
  return {
    id: `fh-ipo-${date}-${idx}-${name.slice(0, 24)}`,
    date,
    title: `IPO：${name}`,
    category: "ipo",
    detail,
  };
}

export async function fetchMergedCalendar(range: CalendarRange): Promise<CalendarEvent[]> {
  const [eco, earn, ipo] = await Promise.all([
    getEconomicCalendar(range),
    getEarningsCalendar(range),
    getIpoCalendar(range),
  ]);

  const mappedEco = eco.map(mapEconomicRow).filter(Boolean) as CalendarEvent[];
  const mappedEarn = earn.map(mapEarningsRow).filter(Boolean) as CalendarEvent[];
  const mappedIpo = ipo.map(mapIpoRow).filter(Boolean) as CalendarEvent[];

  const staticOther = upcomingEvents.filter((e) => e.category === "other");

  return [...mappedEco, ...mappedEarn, ...mappedIpo, ...staticOther].sort(
    (a, b) => a.date.localeCompare(b.date) || (a.time ?? "").localeCompare(b.time ?? ""),
  );
}
