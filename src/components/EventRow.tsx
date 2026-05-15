import { Link } from "react-router-dom";
import type { CalendarEvent } from "../types";
import { categoryLabels } from "../data/events";

interface Props {
  event: CalendarEvent;
}

const categoryClass: Record<CalendarEvent["category"], string> = {
  macro: "pill--macro",
  earnings: "pill--earnings",
  ipo: "pill--ipo",
  fed: "pill--fed",
  other: "pill--other",
};

export function EventRow({ event }: Props) {
  const stockTo = event.symbol ? `/stock/${encodeURIComponent(event.symbol)}` : null;

  return (
    <article className="event-row">
      <div className="event-row-date">
        <time dateTime={event.date}>
          {formatDate(event.date)}
          {event.time ? <span className="event-row-time">{event.time}</span> : null}
        </time>
      </div>
      <div className="event-row-body">
        <div className="event-row-head">
          <span className={"pill " + categoryClass[event.category]}>{categoryLabels[event.category]}</span>
          {event.symbol && stockTo ? (
            <Link to={stockTo} className="event-row-symbol event-row-symbol--link">
              {event.symbol}
            </Link>
          ) : null}
        </div>
        <h3 className="event-row-title">{event.title}</h3>
        {event.detail ? <p className="event-row-detail">{event.detail}</p> : null}
      </div>
    </article>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "short" });
}
