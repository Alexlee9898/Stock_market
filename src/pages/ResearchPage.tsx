import { useMemo, useState } from "react";
import { researchFirms, researchReports } from "../data/research";
import type { ResearchRating } from "../types";

type FirmFilter = "all" | string;
type RatingFilter = "all" | ResearchRating;

const ratingClass: Record<ResearchRating, string> = {
  买入: "rating--buy",
  增持: "rating--accumulate",
  中性: "rating--neutral",
  减持: "rating--reduce",
  卖出: "rating--sell",
};

export function ResearchPage() {
  const [firm, setFirm] = useState<FirmFilter>("all");
  const [rating, setRating] = useState<RatingFilter>("all");

  const filtered = useMemo(() => {
    let list = [...researchReports];
    if (firm !== "all") {
      list = list.filter((r) => r.firmCode === firm);
    }
    if (rating !== "all") {
      list = list.filter((r) => r.rating === rating);
    }
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return list;
  }, [firm, rating]);

  const firmCounts = useMemo(() => {
    const map: Record<string, number> = { all: researchReports.length };
    researchFirms.forEach((f) => {
      map[f.code] = researchReports.filter((r) => r.firmCode === f.code).length;
    });
    return map;
  }, []);

  const ratingCounts = useMemo(() => {
    const map: Record<string, number> = { all: researchReports.length };
    const ratings: ResearchRating[] = ["买入", "增持", "中性", "减持", "卖出"];
    ratings.forEach((r) => {
      map[r] = researchReports.filter((rep) => rep.rating === r).length;
    });
    return map;
  }, []);

  return (
    <main className="page">
      <section className="hero hero--compact">
        <p className="hero-eyebrow">Institutional Research</p>
        <h1 className="hero-title">机构研报</h1>
        <p className="hero-sub">
          汇总华尔街主流投行与研究机构对热门美股的最新观点，涵盖评级、目标价与核心逻辑。点击卡片可跳转至 Yahoo Finance 分析师页面查看详情。
        </p>
      </section>

      <div className="filter-bar" role="tablist" aria-label="机构筛选">
        <button
          type="button"
          role="tab"
          aria-selected={firm === "all"}
          className={"filter-chip" + (firm === "all" ? " filter-chip--active" : "")}
          onClick={() => setFirm("all")}
        >
          全部机构
        </button>
        {researchFirms.map((f) => (
          <button
            key={f.code}
            type="button"
            role="tab"
            aria-selected={firm === f.code}
            className={"filter-chip" + (firm === f.code ? " filter-chip--active" : "")}
            onClick={() => setFirm(f.code)}
          >
            {f.name}
            <span style={{ marginLeft: 6, opacity: 0.6, fontSize: 11 }}>{firmCounts[f.code]}</span>
          </button>
        ))}
      </div>

      <div className="filter-bar" role="tablist" aria-label="评级筛选" style={{ marginTop: -12 }}>
        {(
          [
            ["all", "全部评级"] as const,
            ["买入", "买入"] as const,
            ["增持", "增持"] as const,
            ["中性", "中性"] as const,
            ["减持", "减持"] as const,
            ["卖出", "卖出"] as const,
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={rating === key}
            className={"filter-chip" + (rating === key ? " filter-chip--active" : "")}
            onClick={() => setRating(key as RatingFilter)}
          >
            {label}
            <span style={{ marginLeft: 6, opacity: 0.6, fontSize: 11 }}>{ratingCounts[key]}</span>
          </button>
        ))}
      </div>

      <div className="research-list">
        {filtered.length === 0 ? (
          <p className="muted">当前筛选条件下暂无研报。</p>
        ) : (
          filtered.map((r) => (
            <a
              key={r.id}
              href={r.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="research-card"
            >
              <div className="research-card-top">
                <div className="research-card-meta">
                  <span className="research-card-firm">{r.firm}</span>
                  <span className="research-card-date" aria-label={`发布日期 ${r.date}`}>
                    {r.date}
                  </span>
                </div>
                <span className={"research-rating " + ratingClass[r.rating]}>{r.rating}</span>
              </div>

              <h3 className="research-card-title">
                <span className="research-card-symbol">{r.symbol}</span>
                <span className="research-card-name">{r.nameZh}</span>
                {r.targetPrice ? (
                  <span className="research-card-target">
                    目标价 ${r.targetPrice.toFixed(2)}
                  </span>
                ) : null}
              </h3>

              <p className="research-card-headline">{r.title}</p>
              <p className="research-card-summary">{r.summary}</p>

              <div className="research-card-foot">
                <span className="research-card-source">查看来源 ↗</span>
              </div>
            </a>
          ))
        )}
      </div>

      <p className="disclaimer">
        以上研报数据基于公开市场信息整理，仅供参考，不构成投资建议。点击卡片将跳转至 Yahoo Finance 分析师页面。
      </p>
    </main>
  );
}
