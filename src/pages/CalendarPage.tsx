import { useEffect, useMemo, useState } from "react";
import { EventRow } from "../components/EventRow";
import { categoryLabels } from "../data/events";
import { fetchMergedCalendar, getFallbackCalendarEvents } from "../api/calendarFromFinnhub";
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
  const [events, setEvents] = useState<CalendarEvent[]>(() => getFallbackCalendarEvents());

  useEffect(() => {
    let cancelled = false;

    const from = formatLocalDate(new Date());
    const end = new Date();
    end.setDate(end.getDate() + 38);
    const to = formatLocalDate(end);

    (async () => {
      try {
        const merged = await fetchMergedCalendar({ from, to });
        if (cancelled) return;
        setEvents(merged);
      } catch {
        if (cancelled) return;
        setEvents(getFallbackCalendarEvents());
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
      <section className="hero hero--compact">
        <h1 className="hero-title">财经日历</h1>
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
