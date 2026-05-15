/**
 * 筛选接口不可用时首页备选：常见曾达 / 接近 1 万亿美元市值的美股（名单会随行情变化，仅作兜底）。
 * 含在美上市 ADR（如 TSM）。
 */
export const MEGA_CAP_FALLBACK_TICKERS = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "GOOG",
  "NVDA",
  "AMZN",
  "META",
  "TSLA",
  "AVGO",
  "TSM",
] as const;

/** 筛选接口有结果时仍强制并入首页的标的（不要求满足万亿筛选） */
export const MEGA_EXTRA_TICKERS = ["TSLA"] as const;

/** 无筛选接口时的卡片展示（中英文简称 + 一句行业） */
export const MEGA_FALLBACK_CARD_META: Record<
  string,
  { name: string; nameZh: string; tagline: string }
> = {
  AAPL: { nameZh: "苹果", name: "Apple Inc.", tagline: "消费电子与软件服务" },
  MSFT: { nameZh: "微软", name: "Microsoft Corporation", tagline: "云计算与企业软件" },
  GOOGL: { nameZh: "谷歌 A 类", name: "Alphabet Inc. Class A", tagline: "搜索与数字广告" },
  GOOG: { nameZh: "谷歌 C 类", name: "Alphabet Inc. Class C", tagline: "搜索与数字广告" },
  NVDA: { nameZh: "英伟达", name: "NVIDIA Corporation", tagline: "AI 与数据中心算力" },
  AMZN: { nameZh: "亚马逊", name: "Amazon.com Inc.", tagline: "电商与 AWS 云" },
  META: { nameZh: "Meta", name: "Meta Platforms Inc.", tagline: "社交与元宇宙投入" },
  TSLA: { nameZh: "特斯拉", name: "Tesla Inc.", tagline: "电动车与能源业务" },
  AVGO: { nameZh: "博通", name: "Broadcom Inc.", tagline: "半导体与基础设施软件" },
  TSM: { nameZh: "台积电", name: "Taiwan Semiconductor Manufacturing Co.", tagline: "先进制程晶圆代工" },
};
