import { upcomingEvents } from "../data/events";
import {
  isFedRelatedTitle,
  passesEarningsWatchlist,
  passesUsMajorIpo,
  passesUsMajorMacro,
} from "../data/calendarFilters";
import type { CalendarEvent } from "../types";
import type {
  FinnhubEarningsCalendarRow,
  FinnhubEconomicCalendarRow,
  FinnhubIpoCalendarRow,
} from "./finnhub";
import {
  formatFiscalQuarterLabel,
  getEarningsCalendar,
  getEconomicCalendar,
  getIpoCalendar,
  type CalendarRange,
} from "./finnhub";

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
  const fed = isFedRelatedTitle(title);
  return {
    id: `fh-eco-${date}-${idx}-${title.slice(0, 40)}`,
    date,
    time: row.time && row.time.length > 10 ? `UTC ${row.time.replace("T", " ").slice(11, 19)}` : undefined,
    title,
    category: fed ? "fed" : "macro",
  };
}

function mapEarningsRow(row: FinnhubEarningsCalendarRow, idx: number): CalendarEvent | null {
  const sym = row.symbol?.trim();
  const date = row.date?.trim();
  if (!sym || !date) return null;
  const hasFq = row.quarter != null && row.year != null;
  const fq = hasFq ? formatFiscalQuarterLabel(row.year!, row.quarter!) : null;
  const title = fq ? `${sym} 财报（${fq}）` : `${sym} 财报`;
  const time = hourLabel(row.hour);
  return {
    id: `fh-earn-${date}-${sym}-${idx}`,
    date,
    time,
    title,
    detail: fq ? "财年/财季口径（与自然年可能不一致，如 2026 年 5 月披露 FY27 Q1）" : undefined,
    category: "earnings",
    symbol: sym,
  };
}

function mapIpoRow(row: FinnhubIpoCalendarRow, idx: number): CalendarEvent | null {
  const name = row.name?.trim();
  const date = row.date?.trim();
  if (!name || !date) return null;
  return {
    id: `fh-ipo-${date}-${idx}-${name.slice(0, 24)}`,
    date,
    title: `IPO：${name}`,
    category: "ipo",
  };
}

const MAX_IPO = 12;

export async function fetchMergedCalendar(range: CalendarRange): Promise<CalendarEvent[]> {
  const [eco, earn, ipo] = await Promise.all([
    getEconomicCalendar(range),
    getEarningsCalendar(range),
    getIpoCalendar(range),
  ]);

  const mappedEco = eco.filter(passesUsMajorMacro).map(mapEconomicRow).filter(Boolean) as CalendarEvent[];
  const mappedEarn = earn.filter(passesEarningsWatchlist).map(mapEarningsRow).filter(Boolean) as CalendarEvent[];
  const mappedIpo = ipo
    .filter(passesUsMajorIpo)
    .map(mapIpoRow)
    .filter(Boolean)
    .slice(0, MAX_IPO) as CalendarEvent[];

  return [...mappedEco, ...mappedEarn, ...mappedIpo].sort(
    (a, b) => a.date.localeCompare(b.date) || (a.time ?? "").localeCompare(b.time ?? ""),
  );
}

/** 接口失败时回退的精简演示日历（条数少，与线上过滤思路一致） */
export function getFallbackCalendarEvents(): CalendarEvent[] {
  return [...upcomingEvents].sort(
    (a, b) => a.date.localeCompare(b.date) || (a.time ?? "").localeCompare(b.time ?? ""),
  );
}
