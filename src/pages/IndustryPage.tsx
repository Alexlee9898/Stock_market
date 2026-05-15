import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, NavLink, useParams } from "react-router-dom";
import { getStockDetail } from "../data/stocks";
import { defaultIndustrySlug, getIndustryBySlug, industries } from "../data/industries";
import type { EquityMarket, IndustryPick } from "../types";

type MarketFilter = "all" | EquityMarket;

const marketLabel: Record<EquityMarket, string> = {
  us: "美股",
  hk: "港股",
  cn: "A股",
};

function countByMarket(picks: IndustryPick[]) {
  return {
    all: picks.length,
    us: picks.filter((p) => p.market === "us").length,
    hk: picks.filter((p) => p.market === "hk").length,
    cn: picks.filter((p) => p.market === "cn").length,
  };
}

export function IndustryPage() {
  const { industrySlug } = useParams();
  const industry = getIndustryBySlug(industrySlug);

  const [market, setMarket] = useState<MarketFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!industry) return [];
    if (market === "all") return industry.picks;
    return industry.picks.filter((p) => p.market === market);
  }, [industry, market]);

  const counts = useMemo(() => (industry ? countByMarket(industry.picks) : { all: 0, us: 0, hk: 0, cn: 0 }), [industry]);

  useEffect(() => {
    setMarket("all");
  }, [industrySlug]);

  useEffect(() => {
    const first = filtered[0]?.id ?? null;
    setSelectedId((prev) => {
      if (prev && filtered.some((p) => p.id === prev)) return prev;
      return first;
    });
  }, [filtered]);

  if (!industrySlug || !industry) {
    return <Navigate to={`/industries/${defaultIndustrySlug}`} replace />;
  }

  const selected = filtered.find((p) => p.id === selectedId) ?? filtered[0];

  return (
    <main className="industry-page page">
      <nav className="industry-nav" aria-label="产业切换">
        <div className="industry-nav-scroll">
          {industries.map((i) => (
            <NavLink
              key={i.slug}
              to={`/industries/${i.slug}`}
              className={({ isActive }) => "industry-pill" + (isActive ? " industry-pill--active" : "")}
            >
              {i.titleZh}
              <span className="industry-pill-en">{i.titleEn}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <header className="industry-header">
        <h1 className="industry-title">
          {industry.titleZh}
          <span className="industry-title-sep">/</span>
          <span className="industry-title-en">{industry.titleEn}</span>
        </h1>
        <p className="industry-coverage">{industry.coverage}</p>

        <div className="market-filter" role="tablist" aria-label="市场筛选">
          {(
            [
              ["all", "全部", counts.all],
              ["us", marketLabel.us, counts.us],
              ["hk", marketLabel.hk, counts.hk],
              ["cn", marketLabel.cn, counts.cn],
            ] as const
          ).map(([key, label, n]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={market === key}
              className={"market-chip" + (market === key ? " market-chip--active" : "")}
              onClick={() => setMarket(key)}
            >
              {label}
              <span className="market-chip-count">{n}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="industry-layout">
        <section className="industry-card industry-list-card" aria-labelledby="core-list-heading">
          <div className="industry-card-head">
            <h2 id="core-list-heading" className="industry-card-title">
              核心买入名单
            </h2>
            <span className="industry-card-meta">{filtered.length} 项</span>
          </div>

          <ul className="industry-pick-list">
            {filtered.map((p, idx) => {
              const active = selected?.id === p.id;
              const stockPage = p.market === "us" && getStockDetail(p.ticker);
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    className={"industry-pick-row" + (active ? " industry-pick-row--active" : "")}
                    onClick={() => setSelectedId(p.id)}
                  >
                    <span className="industry-pick-index" aria-hidden>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="industry-pick-main">
                      <div className="industry-pick-title-row">
                        <span className="industry-pick-name">
                          {p.name}
                          <span className="industry-pick-dot">·</span>
                          <span className="industry-pick-ticker">{p.ticker}</span>
                        </span>
                        <span className="tag-core">核心</span>
                      </div>
                      <p className="industry-pick-summary">{p.summary}</p>
                    </div>
                    <span className="industry-pick-actions">
                      {stockPage ? (
                        <Link
                          to={`/stock/${encodeURIComponent(p.ticker)}`}
                          className="industry-detail-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          详情 →
                        </Link>
                      ) : (
                        <span className="industry-detail-link industry-detail-link--muted" aria-disabled>
                          详情 →
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <aside className="industry-card industry-detail-card" aria-label="研究详情">
          {selected ? (
            <>
              <p className="research-eyebrow">Research detail</p>
              <h2 className="research-title">{selected.name}</h2>
              <div className="research-tags">
                <span className="research-tag">{marketLabel[selected.market]}</span>
                <span className="research-tag">核心买入名单</span>
                <span className="research-tag">{selected.ticker}</span>
              </div>

              <dl className="research-fields">
                <div className="research-field">
                  <dt>股票代码</dt>
                  <dd>{selected.ticker}</dd>
                </div>
                <div className="research-field">
                  <dt>产业位置</dt>
                  <dd>{selected.industryPosition}</dd>
                </div>
                <div className="research-field">
                  <dt>主要环节</dt>
                  <dd>{selected.mainSegments}</dd>
                </div>
                <div className="research-field research-field--block">
                  <dt>公司说明</dt>
                  <dd>{selected.companyDescription}</dd>
                </div>
                <div className="research-field research-field--block">
                  <dt>所属名单核心原因</dt>
                  <dd>
                    <ol className="research-reasons">
                      {selected.coreReasons.map((text, i) => (
                        <li key={i}>
                          <span className="research-reason-idx">{["一", "二", "三", "四", "五"][i] ?? i + 1}</span>
                          {text}
                        </li>
                      ))}
                    </ol>
                  </dd>
                </div>
              </dl>
            </>
          ) : (
            <p className="muted">当前筛选下暂无公司，请切换市场或产业。</p>
          )}

          <p className="industry-footnote">教学演示内容，不构成投资建议。</p>
        </aside>
      </div>
    </main>
  );
}
