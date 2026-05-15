import { Link, useParams } from "react-router-dom";
import {
  formatMarketCapResolved,
  formatPercent,
  formatUsd,
  metricDividendYieldFraction,
  metricNumber,
  metricPeTtmBest,
  revenueActualToBillionsUsd,
  safe52WeekHighLow,
  type FinnhubEpsHistoryRow,
  type FinnhubProfile,
} from "../api/finnhub";
import { useStockApi } from "../hooks/useStockApi";
import { getStockDetail } from "../data/stocks";
import { MEGA_FALLBACK_CARD_META } from "../data/megaCapFallback";
import type { EarningsReport, StockDetail } from "../types";

export function StockDetail() {
  const { symbol: raw } = useParams();
  const symbol = raw ? decodeURIComponent(raw) : "";
  const base = symbol ? getStockDetail(symbol) : undefined;
  const api = useStockApi(symbol);

  if (!symbol) {
    return null;
  }

  const profileName = api.profile?.name?.trim();
  const hasApiIdentity = Boolean(profileName);
  const showNotFound = !base && !api.loading && (api.error || !hasApiIdentity);

  if (showNotFound) {
    return (
      <main className="page page--narrow">
        <p className="muted">未找到该公司资料（本地演示与线上数据均未返回有效结果）。</p>
        <Link to="/" className="text-link">
          返回首页
        </Link>
      </main>
    );
  }

  const merged = mergeDetail(base, symbol, api);

  const e = merged.latestEarnings;
  const beat =
    e.epsActual != null && e.epsEstimate != null ? e.epsActual >= e.epsEstimate : null;

  return (
    <main className="page page--detail">
      <div className="breadcrumb">
        <Link to="/" className="text-link">
          热门公司
        </Link>
        <span className="breadcrumb-sep" aria-hidden>
          /
        </span>
        <span>{merged.symbol}</span>
      </div>

      <header className="detail-hero">
        <p className="detail-sector">{merged.sector}</p>
        <h1 className="detail-title">{merged.nameZh}</h1>
        <p className="detail-sub">{merged.name}</p>
        <div className="detail-price-row">
          <span className="detail-price">{merged.priceDisplay}</span>
          <span
            className={
              "detail-change" + (merged.changePercentDisplay.trim().startsWith("-") ? " detail-change--down" : "")
            }
          >
            {merged.changePercentDisplay}
          </span>
        </div>
        {api.profile?.weburl ? (
          <p className="detail-web">
            <a href={api.profile.weburl} className="text-link" target="_blank" rel="noreferrer">
              公司官网
            </a>
          </p>
        ) : null}
      </header>

      <section className="detail-grid">
        <div className="panel">
          <h2 className="panel-title">公司简介</h2>
          <p className="panel-prose">{merged.description}</p>
        </div>

        <div className="panel">
          <h2 className="panel-title">关键指标</h2>
          <dl className="stat-list">
            <div className="stat-row">
              <dt>市值</dt>
              <dd>{merged.marketCapDisplay}</dd>
            </div>
            <div className="stat-row">
              <dt>市盈率</dt>
              <dd>{merged.peDisplay}</dd>
            </div>
            <div className="stat-row">
              <dt>股息率</dt>
              <dd>{merged.dividendYieldDisplay}</dd>
            </div>
            <div className="stat-row">
              <dt>52 周高 / 低</dt>
              <dd>
                {merged.week52High} / {merged.week52Low} 美元
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="panel panel--earnings">
        <div className="earnings-head">
          <h2 className="panel-title">财报与 EPS</h2>
          <span className="pill pill--earnings">{e.quarter}</span>
        </div>
        <p className="earnings-meta">报告期参考：{e.reportDate}</p>
        <div className="earnings-stats">
          <div className="earnings-stat">
            <span className="earnings-label">营收（公开接口）</span>
            <strong>{e.revenueBillions > 0 ? `${e.revenueBillions.toFixed(1)}B 美元` : "—"}</strong>
            <span className="earnings-sub">
              {e.revenueYoyPercent !== 0
                ? `同比 ${e.revenueYoyPercent >= 0 ? "+" : ""}${e.revenueYoyPercent.toFixed(1)}%`
                : "同比数据见公司完整财报"}
            </span>
          </div>
          <div className="earnings-stat">
            <span className="earnings-label">每股收益 EPS</span>
            <strong>
              {e.epsActual != null ? e.epsActual.toFixed(2) : "—"}
              {e.epsEstimate != null ? <span className="earnings-vs"> vs 预期 {e.epsEstimate.toFixed(2)}</span> : null}
            </strong>
            {beat === true ? <span className="badge badge--ok">高于或等于预期</span> : null}
            {beat === false ? <span className="badge badge--warn">低于预期</span> : null}
          </div>
        </div>
        <p className="panel-prose earnings-summary">{e.summary}</p>
      </section>

      <section className="detail-two">
        <div className="panel">
          <h2 className="panel-title">看点</h2>
          {merged.highlights.length ? (
            <ul className="bullet-list">
              {merged.highlights.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          ) : (
            <p className="panel-prose">暂无本地解读，建议阅读公司投资者关系材料与 10-Q / 10-K。</p>
          )}
        </div>
        <div className="panel">
          <h2 className="panel-title">风险与不确定因素</h2>
          {merged.riskNotes.length ? (
            <ul className="bullet-list bullet-list--muted">
              {merged.riskNotes.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          ) : (
            <p className="panel-prose">暂无本地列举。行业与个股风险请自行评估。</p>
          )}
        </div>
      </section>

      <p className="disclaimer">
        本站内容非投资建议。真实交易前请查阅公司 IR 页面、10-Q / 10-K 及监管披露。
      </p>
    </main>
  );
}

function buildIntroFromFinnhubProfile(p: FinnhubProfile | undefined): string | null {
  if (!p?.name?.trim()) return null;
  const lines: string[] = [];
  const ticker = p.ticker?.trim();
  lines.push(
    `${p.name.trim()}${ticker && ticker !== p.name ? `（${ticker}）` : ""}为在美公开交易证券。公开数据中的行业归类：${p.finnhubIndustry ?? "—"}。`,
  );
  if (p.exchange || p.country) {
    lines.push(`交易所：${p.exchange ?? "—"}${p.country ? `；注册地：${p.country}` : ""}。`);
  }
  if (p.ipo?.trim()) {
    lines.push(`IPO 日期（参考）：${p.ipo.trim()}。`);
  }
  lines.push(
    "以上内容由公开 profile 字段自动整理，非投资建议；战略、财务与风险请以公司 IR 页面及年报、季报（如 10-K / 10-Q、20-F）为准。",
  );
  if (p.weburl?.trim()) {
    lines.push(`官网：${p.weburl.trim()}`);
  }
  return lines.join("\n\n");
}

function mergeDetail(base: StockDetail | undefined, symbol: string, api: ReturnType<typeof useStockApi>): StockDetail {
  const q = api.quote;
  const livePrice = q && q.c > 0;
  const priceDisplay = livePrice ? formatUsd(q.c) : base?.priceDisplay ?? (api.loading ? "加载中…" : "—");
  const changePercentDisplay =
    livePrice && q.dp != null ? formatPercent(q.dp) : base?.changePercentDisplay ?? (api.loading ? "…" : "—");

  const mcap = formatMarketCapResolved(api.profile ?? undefined, q);

  const peRaw = metricPeTtmBest(api.metric ?? undefined);
  const peDisplay =
    peRaw != null && Number.isFinite(peRaw) ? `约 ${peRaw.toFixed(1)}×` : base?.peDisplay ?? "—";

  const divRaw = metricDividendYieldFraction(api.metric ?? undefined);
  const dividendYieldDisplay =
    divRaw != null ? `约 ${(divRaw * 100).toFixed(2)}%` : base?.dividendYieldDisplay ?? "—";

  const h52m = metricNumber(api.metric ?? undefined, "52WeekHigh");
  const l52m = metricNumber(api.metric ?? undefined, "52WeekLow");
  const lastPx = q && q.c > 0 ? q.c : undefined;
  const r52 = safe52WeekHighLow(h52m, l52m, lastPx);
  const week52High = r52 ? r52.high.toFixed(2) : base?.week52High ?? "—";
  const week52Low = r52 ? r52.low.toFixed(2) : base?.week52Low ?? "—";

  const symKey = symbol.trim().toUpperCase();
  const nameHint = MEGA_FALLBACK_CARD_META[symKey];
  const name = base?.name ?? nameHint?.name ?? api.profile?.name ?? symbol;
  const nameZh = base?.nameZh ?? nameHint?.nameZh ?? api.profile?.name ?? symbol;
  const sector = base?.sector ?? (api.profile?.finnhubIndustry ? `${api.profile.finnhubIndustry}（公开分类）` : "—");
  const description =
    base?.description ??
    buildIntroFromFinnhubProfile(api.profile ?? undefined) ??
    `行业分类：${api.profile?.finnhubIndustry ?? "—"}。暂无公开简介字段；请结合官网披露与研报阅读。`;

  const latest = pickLatestEps(api.epsHistory);
  const revB = revenueActualToBillionsUsd(latest?.revenueActual);
  const revLine =
    revB != null
      ? `单季营收约 ${revB.toFixed(2)}B 美元（来自公开 earnings 的 revenueActual，单位已按常见口径估算，以公司正式财报为准）。`
      : "";
  const latestEarnings: EarningsReport = base
    ? {
        ...base.latestEarnings,
        ...(latest
          ? {
              quarter: `${latest.year} Q${latest.quarter}`,
              fiscalYear: latest.year ?? base.latestEarnings.fiscalYear,
              epsActual: latest.actual ?? undefined,
              epsEstimate: latest.estimate ?? undefined,
              reportDate: latest.period ?? base.latestEarnings.reportDate,
              ...(revB != null
                ? {
                    revenueBillions: revB,
                    summary: revLine + (base.latestEarnings.summary?.trim() ? ` ${base.latestEarnings.summary}` : ""),
                  }
                : {}),
            }
          : {}),
      }
    : {
        quarter: latest ? `${latest.year} Q${latest.quarter}` : "最近一季",
        fiscalYear: latest?.year ?? new Date().getFullYear(),
        epsActual: latest?.actual ?? undefined,
        epsEstimate: latest?.estimate ?? undefined,
        revenueBillions: revB ?? 0,
        revenueYoyPercent: 0,
        summary: [revLine, "EPS 与一致预期对比如上；营收同比及其他口径请查阅 10-Q / press release。"]
          .filter(Boolean)
          .join(""),
        reportDate: latest?.period ?? "—",
      };

  return {
    symbol: base?.symbol ?? api.profile?.ticker ?? symbol,
    name,
    nameZh,
    sector,
    description,
    priceDisplay,
    changePercentDisplay,
    marketCapDisplay: mcap,
    peDisplay,
    dividendYieldDisplay,
    week52High,
    week52Low,
    latestEarnings,
    highlights: base?.highlights ?? [],
    riskNotes: base?.riskNotes ?? [],
  };
}

function pickLatestEps(rows: FinnhubEpsHistoryRow[]) {
  const maxFuture = Date.now() + 86400000 * 400;
  const ok = rows.filter((r) => {
    if (r.actual == null || r.year == null || r.quarter == null) return false;
    const y = r.year ?? 0;
    if (y > new Date().getFullYear() + 1) return false;
    const per = r.period;
    if (per && typeof per === "string" && per.length >= 8) {
      const t = Date.parse(per.slice(0, 10));
      if (!Number.isNaN(t) && t > maxFuture) return false;
    }
    return true;
  });
  ok.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || (b.quarter ?? 0) - (a.quarter ?? 0));
  return ok[0];
}
