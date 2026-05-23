import { Link, useParams } from "react-router-dom";
import {
  computeRevenueYoyPercent,
  formatFiscalQuarterLabel,
  formatMarketCapResolved,
  formatPercent,
  formatUsd,
  metricDividendYieldFraction,
  metricMarginPercent,
  metricNumber,
  metricPeTtmBest,
  revenueActualToBillionsUsd,
  safe52WeekHighLow,
  type FinnhubEpsHistoryRow,
  type FinnhubMetric,
  type FinnhubProfile,
  type ParsedQuarterFinancials,
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
          <h2 className="panel-title">最新财报摘要</h2>
          <span className="pill pill--earnings">{e.quarter}</span>
        </div>
        <p className="earnings-meta">报告期：{e.reportDate}</p>
        <div className="earnings-stats">
          <div className="earnings-stat">
            <span className="earnings-label">单季营收</span>
            <strong>{formatBillions(e.revenueBillions)}</strong>
            <span className="earnings-sub">
              {e.revenueEstimateBillions != null
                ? `预期 ${formatBillions(e.revenueEstimateBillions)}`
                : e.revenueYoyPercent !== 0
                  ? `同比 ${formatSignedPercent(e.revenueYoyPercent)}`
                  : "同比见公司正式披露"}
            </span>
          </div>
          <div className="earnings-stat">
            <span className="earnings-label">毛利率</span>
            <strong>{formatMargin(e.grossMarginPercent)}</strong>
            <span className="earnings-sub">
              {e.grossProfitBillions != null ? `毛利润 ${formatBillions(e.grossProfitBillions)}` : "—"}
            </span>
          </div>
          <div className="earnings-stat">
            <span className="earnings-label">营业利润率</span>
            <strong>{formatMargin(e.operatingMarginPercent)}</strong>
            <span className="earnings-sub">
              {e.operatingIncomeBillions != null ? `营业利润 ${formatBillions(e.operatingIncomeBillions)}` : "—"}
            </span>
          </div>
          <div className="earnings-stat">
            <span className="earnings-label">净利率</span>
            <strong>{formatMargin(e.netMarginPercent)}</strong>
            <span className="earnings-sub">
              {e.netIncomeBillions != null ? `净利润 ${formatBillions(e.netIncomeBillions)}` : "—"}
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
        {e.marginsAreTtm ? <p className="earnings-note">注：部分利润率取自滚动四季（TTM）口径，单季利润表缺失时使用。</p> : null}
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

  const latestEarnings = mergeEarningsReport(
    base?.latestEarnings,
    pickLatestEps(api.epsHistory),
    api.incomeQuarters,
    api.metric ?? undefined,
  );

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

function formatBillions(b: number | undefined): string {
  if (b == null || !Number.isFinite(b) || b <= 0) return "—";
  return `${b.toFixed(b >= 10 ? 1 : 2)}B 美元`;
}

function formatMargin(p: number | undefined): string {
  if (p == null || !Number.isFinite(p)) return "—";
  return `${p.toFixed(1)}%`;
}

function formatSignedPercent(p: number): string {
  const sign = p > 0 ? "+" : "";
  return `${sign}${p.toFixed(1)}%`;
}

function mergeEarningsReport(
  base: EarningsReport | undefined,
  latestEps: FinnhubEpsHistoryRow | undefined,
  incomeQuarters: ParsedQuarterFinancials[],
  metric: FinnhubMetric | undefined,
): EarningsReport {
  const ic = incomeQuarters[0];
  const revFromEps = revenueActualToBillionsUsd(latestEps?.revenueActual);
  const revEstFromEps = revenueActualToBillionsUsd(latestEps?.revenueEstimate);

  const revenueBillions =
    ic?.revenueBillions ?? revFromEps ?? (base?.revenueBillions && base.revenueBillions > 0 ? base.revenueBillions : 0);

  const yoyFromIc =
    ic && incomeQuarters.length > 1 ? computeRevenueYoyPercent(ic, incomeQuarters) : undefined;

  const grossMarginQuarter = ic?.grossMarginPercent;
  const opMarginQuarter = ic?.operatingMarginPercent;
  const netMarginQuarter = ic?.netMarginPercent;

  const grossTtm = metricMarginPercent(metric, ["grossMarginTTM", "grossMarginAnnual"]);
  const opTtm = metricMarginPercent(metric, ["operatingMarginTTM", "operatingMarginAnnual", "ebitMarginTTM"]);
  const netTtm = metricMarginPercent(metric, ["netProfitMarginTTM", "netMarginAnnual", "netProfitMarginAnnual"]);

  const grossMarginPercent = grossMarginQuarter ?? grossTtm ?? base?.grossMarginPercent;
  const operatingMarginPercent = opMarginQuarter ?? opTtm ?? base?.operatingMarginPercent;
  const netMarginPercent = netMarginQuarter ?? netTtm ?? base?.netMarginPercent;
  const marginsAreTtm =
    grossMarginQuarter == null && opMarginQuarter == null && netMarginQuarter == null && (grossTtm != null || opTtm != null || netTtm != null);

  const quarterLabel =
    latestEps?.year != null && latestEps.quarter != null
      ? formatFiscalQuarterLabel(latestEps.year, latestEps.quarter)
      : ic?.period
      ? `截至 ${ic.period.slice(0, 10)}`
      : base?.quarter ?? "最近一季";

  const reportDate = ic?.period?.slice(0, 10) ?? latestEps?.period?.slice(0, 10) ?? base?.reportDate ?? "—";

  const summaryParts: string[] = [];
  if (ic) {
    summaryParts.push(
      `最近一季利润表（截至 ${ic.period.slice(0, 10)}）：营收 ${formatBillions(ic.revenueBillions)}` +
        (grossMarginQuarter != null ? `，毛利率 ${formatMargin(grossMarginQuarter)}` : "") +
        (opMarginQuarter != null ? `，营业利润率 ${formatMargin(opMarginQuarter)}` : "") +
        "。",
    );
  } else if (revFromEps != null) {
    summaryParts.push(`单季营收约 ${revFromEps.toFixed(2)}B 美元（来自 earnings 接口，以公司正式财报为准）。`);
  }
  if (latestEps?.actual != null) {
    summaryParts.push(
      latestEps.estimate != null
        ? `EPS 实际 ${latestEps.actual.toFixed(2)}，一致预期 ${latestEps.estimate.toFixed(2)}。`
        : `EPS 实际 ${latestEps.actual.toFixed(2)}。`,
    );
  }
  if (base?.summary?.trim() && !ic) summaryParts.push(base.summary.trim());

  return {
    quarter: quarterLabel,
    fiscalYear: latestEps?.year ?? base?.fiscalYear ?? new Date().getFullYear(),
    epsActual: latestEps?.actual ?? base?.epsActual,
    epsEstimate: latestEps?.estimate ?? base?.epsEstimate,
    revenueBillions,
    revenueYoyPercent: yoyFromIc ?? base?.revenueYoyPercent ?? 0,
    revenueEstimateBillions: revEstFromEps ?? base?.revenueEstimateBillions,
    grossMarginPercent,
    operatingMarginPercent,
    netMarginPercent,
    grossProfitBillions: ic?.grossProfitBillions ?? base?.grossProfitBillions,
    operatingIncomeBillions: ic?.operatingIncomeBillions ?? base?.operatingIncomeBillions,
    netIncomeBillions: ic?.netIncomeBillions ?? base?.netIncomeBillions,
    marginsAreTtm: marginsAreTtm || undefined,
    summary:
      summaryParts.join(" ") ||
      base?.summary ||
      "完整口径请查阅公司 IR 发布的季报、年报（10-Q / 10-K）及业绩说明会材料。",
    reportDate,
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
