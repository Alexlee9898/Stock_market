import type { CalendarEvent } from "../types";

/** 离线回退用精简日历（与线上「美国核心宏观 + 龙头财报」思路一致） */
export const upcomingEvents: CalendarEvent[] = [
  {
    id: "e1",
    date: "2026-05-20",
    time: "美东盘后",
    title: "沃尔玛（WMT）财报",
    category: "earnings",
    symbol: "WMT",
  },
  {
    id: "e2",
    date: "2026-05-21",
    time: "美东 14:00",
    title: "FOMC 会议纪要公布",
    category: "fed",
  },
  {
    id: "e3",
    date: "2026-05-23",
    time: "美东盘后",
    title: "英伟达（NVDA）财报",
    category: "earnings",
    symbol: "NVDA",
  },
  {
    id: "e4",
    date: "2026-05-27",
    time: "美东 08:30",
    title: "美国 PCE 物价指数",
    category: "macro",
  },
  {
    id: "e5",
    date: "2026-06-04",
    time: "美东 08:30",
    title: "美国非农就业（NFP）",
    category: "macro",
  },
  {
    id: "e6",
    date: "2026-06-10",
    time: "美东 08:30",
    title: "美国 CPI",
    category: "macro",
  },
  {
    id: "e7",
    date: "2026-06-11",
    time: "美东 14:00",
    title: "美联储利率决议 + 经济预测摘要",
    category: "fed",
  },
];

export const categoryLabels: Record<CalendarEvent["category"], string> = {
  macro: "宏观数据",
  earnings: "公司财报",
  ipo: "IPO",
  fed: "美联储",
  other: "其他",
};
