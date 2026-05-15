export type EventCategory = "macro" | "earnings" | "ipo" | "fed" | "other";

export interface CalendarEvent {
  id: string;
  date: string;
  time?: string;
  title: string;
  category: EventCategory;
  detail?: string;
  symbol?: string;
}

export interface EarningsReport {
  quarter: string;
  fiscalYear: number;
  epsActual?: number;
  epsEstimate?: number;
  revenueBillions: number;
  revenueYoyPercent: number;
  /** 一致预期营收（十亿美元） */
  revenueEstimateBillions?: number;
  grossMarginPercent?: number;
  operatingMarginPercent?: number;
  netMarginPercent?: number;
  grossProfitBillions?: number;
  operatingIncomeBillions?: number;
  netIncomeBillions?: number;
  /** 利润率是否来自滚动四季（metric）而非单季利润表 */
  marginsAreTtm?: boolean;
  summary: string;
  reportDate: string;
}

export interface StockDetail {
  symbol: string;
  name: string;
  nameZh: string;
  sector: string;
  description: string;
  priceDisplay: string;
  changePercentDisplay: string;
  marketCapDisplay: string;
  peDisplay: string;
  dividendYieldDisplay: string;
  week52High: string;
  week52Low: string;
  latestEarnings: EarningsReport;
  highlights: string[];
  riskNotes: string[];
}

export interface HotStock {
  symbol: string;
  name: string;
  nameZh: string;
  tagline: string;
  accent: string;
}

/** 市场：美股 / 港股 / A股（教学演示数据） */
export type EquityMarket = "us" | "hk" | "cn";

export interface IndustryPick {
  id: string;
  name: string;
  ticker: string;
  market: EquityMarket;
  summary: string;
  industryPosition: string;
  mainSegments: string;
  companyDescription: string;
  /** 入选「核心名单」的要点，对应右侧「一、二、三」 */
  coreReasons: string[];
}

export interface IndustryTheme {
  slug: string;
  titleZh: string;
  titleEn: string;
  /** 灰色副标题：覆盖的细分环节 */
  coverage: string;
  picks: IndustryPick[];
}

export type ResearchRating = "买入" | "增持" | "中性" | "减持" | "卖出";

export interface ResearchReport {
  id: string;
  /** 机构名称 */
  firm: string;
  /** 机构英文缩写 */
  firmCode: string;
  /** 研报标题 */
  title: string;
  /** 目标股票代码 */
  symbol: string;
  /** 目标公司中文名 */
  nameZh: string;
  /** 评级 */
  rating: ResearchRating;
  /** 目标价（美元） */
  targetPrice?: number;
  /** 研报摘要 */
  summary: string;
  /** 发布日期 */
  date: string;
  /** 研报来源链接 */
  sourceUrl: string;
}

