import { Link, useParams } from "react-router-dom";
import {
  formatBillionsUsdFromFinnhubMarketCap,
  formatPercent,
  formatUsd,
  metricNumber,
  type FinnhubEpsHistoryRow,
} from "../api/finnhub";
import { DataSourceNote } from "../components/DataSourceNote";
import { useStockApi } from "../hooks/useStockApi";
import { getStockDetail } from "../data/stocks";
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
        <p className="muted">未找到该股票资料（演示库与 Finnhub 均无有效结果）。</p>
        <Link to="/" className="text-link">
          返回首页
        </Link>
      </main>
    );
  }

  const merged = mergeDetail(base, symbol, api);
  const noteVariant: "demo" | "live" | "loading" | "error" = api.loading
    ? "loading"
    : api.error
      ? "error"
      : api.quote && api.quote.c > 0
        ? "live"
        : "demo";

  const e = merged.latestEarnings;
  const beat =
    e.epsActual != null && e.epsEstimate != null ? e.epsActual >= e.epsEstimate : null;

  return (
    <main className="page page--detail">
      <DataSourceNote variant={noteVariant} detail={api.error ?? undefined} />

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
            <span className="earnings-label">营收（演示或 API）</span>
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
        本站内容为教育演示，非投资建议。真实交易前请查阅公司 IR 页面、10-Q / 10-K 及监管披露。
      </p>
    </main>
  );
}

function mergeDetail(base: StockDetail | undefined, symbol: string, api: ReturnType<typeof useStockApi>): StockDetail {
  const q = api.quote;
  const livePrice = q && q.c > 0;
  const priceDisplay = livePrice ? formatUsd(q.c) : base?.priceDisplay ?? (api.loading ? "加载中…" : "—");
  const changePercentDisplay =
    livePrice && q.dp != null ? formatPercent(q.dp) : base?.changePercentDisplay ?? (api.loading ? "…" : "—");

  const mcap =
    api.profile?.marketCapitalization != null
      ? formatBillionsUsdFromFinnhubMarketCap(api.profile.marketCapitalization)
      : base?.marketCapDisplay ?? "—";

  const peRaw =
    metricNumber(api.metric ?? undefined, "peTTM") ??
    metricNumber(api.metric ?? undefined, "peBasicExclExtraTTM") ??
    metricNumber(api.metric ?? undefined, "peNormalizedAnnual");
  const peDisplay = peRaw != null ? `约 ${peRaw.toFixed(1)}×（Finnhub）` : base?.peDisplay ?? "—";

  const divRaw =
    metricNumber(api.metric ?? undefined, "dividendYieldIndicatedAnnual") ??
    metricNumber(api.metric ?? undefined, "dividendYieldTTM");
  const dividendYieldDisplay =
    divRaw != null ? `约 ${(divRaw * 100).toFixed(2)}%（Finnhub）` : base?.dividendYieldDisplay ?? "—";

  const h52 = metricNumber(api.metric ?? undefined, "52WeekHigh");
  const l52 = metricNumber(api.metric ?? undefined, "52WeekLow");
  const week52High = h52 != null ? h52.toFixed(2) : base?.week52High ?? "—";
  const week52Low = l52 != null ? l52.toFixed(2) : base?.week52Low ?? "—";

  const name = base?.name ?? api.profile?.name ?? symbol;
  const nameZh = base?.nameZh ?? api.profile?.name ?? symbol;
  const sector = base?.sector ?? (api.profile?.finnhubIndustry ? `${api.profile.finnhubIndustry}（Finnhub）` : "—");
  const description =
    base?.description ??
    `Finnhub 行业分类：${api.profile?.finnhubIndustry ?? "—"}。暂无中文长简介；请结合官网披露与研报阅读。`;

  const latest = pickLatestEps(api.epsHistory);
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
            }
          : {}),
      }
    : {
        quarter: latest ? `${latest.year} Q${latest.quarter}` : "最近一季",
        fiscalYear: latest?.year ?? new Date().getFullYear(),
        epsActual: latest?.actual ?? undefined,
        epsEstimate: latest?.estimate ?? undefined,
        revenueBillions: 0,
        revenueYoyPercent: 0,
        summary:
          "以上为 Finnhub 公布的季度 EPS 与一致预期对比；营收与同比需查阅公司完整财报（10-Q / press release）。",
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
  const ok = rows.filter((r) => r.actual != null && r.year != null && r.quarter != null);
  ok.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || (b.quarter ?? 0) - (a.quarter ?? 0));
  return ok[0];
}
