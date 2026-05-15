import { useEffect, useMemo, useState } from "react";
import { EventRow } from "../components/EventRow";
import { DataSourceNote } from "../components/DataSourceNote";
import { categoryLabels, upcomingEvents } from "../data/events";
import { fetchMergedCalendar } from "../api/calendarFromFinnhub";
import type { CalendarEvent } from "../types";

type Filter = "all" | CalendarEvent["category"];

function formatLocalDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function CalendarPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    [...upcomingEvents].sort((a, b) => a.date.localeCompare(b.date) || (a.time ?? "").localeCompare(b.time ?? "")),
  );
  const [noteVariant, setNoteVariant] = useState<"demo" | "live" | "loading" | "error">("loading");
  const [noteDetail, setNoteDetail] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    setNoteVariant("loading");
    setNoteDetail(undefined);

    const from = formatLocalDate(new Date());
    const end = new Date();
    end.setDate(end.getDate() + 38);
    const to = formatLocalDate(end);

    (async () => {
      try {
        const merged = await fetchMergedCalendar({ from, to });
        if (cancelled) return;
        setEvents(merged);
        setNoteVariant("live");
        setNoteDetail(undefined);
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : String(e);
        setEvents(
          [...upcomingEvents].sort((a, b) => a.date.localeCompare(b.date) || (a.time ?? "").localeCompare(b.time ?? "")),
        );
        setNoteVariant("error");
        setNoteDetail(msg);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = useMemo(() => events, [events]);

  const filtered = filter === "all" ? sorted : sorted.filter((e) => e.category === filter);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "全部" },
    { id: "macro", label: categoryLabels.macro },
    { id: "fed", label: categoryLabels.fed },
    { id: "earnings", label: categoryLabels.earnings },
    { id: "ipo", label: categoryLabels.ipo },
    { id: "other", label: categoryLabels.other },
  ];

  return (
    <main className="page">
      <DataSourceNote variant={noteVariant} detail={noteDetail} />

      <section className="hero hero--compact">
        <p className="hero-eyebrow">未来约一个月</p>
        <h1 className="hero-title">财经日历</h1>
        <p className="hero-sub">
          宏观数据、美联储相关日程、财报与 IPO 来自 Finnhub 日历接口（范围：今天起约 5 周），并与本地「其他」示例条目合并。
        </p>
      </section>

      <div className="filter-bar" role="tablist" aria-label="事件类型筛选">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            className={"filter-chip" + (filter === f.id ? " filter-chip--active" : "")}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="event-list">
        {filtered.map((ev) => (
          <EventRow key={ev.id} event={ev} />
        ))}
      </div>

      {filtered.length === 0 ? <p className="muted">该分类下暂无事件。</p> : null}
    </main>
  );
}
