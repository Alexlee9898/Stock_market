import type { IndustryTheme } from "../types";

export const industries: IndustryTheme[] = [
  {
    slug: "ai",
    titleZh: "人工智能",
    titleEn: "AI",
    coverage: "覆盖算力芯片、云基础设施、大模型、企业软件与 AI 应用等关键环节（教学演示，非荐股）。",
    picks: [
      {
        id: "ai-1",
        name: "NVIDIA",
        ticker: "NVDA",
        market: "us",
        summary: "数据中心 GPU 与 CUDA 生态在训练/推理侧具备强粘性；资本开支周期与出口管制为关键变量。",
        industryPosition: "加速计算与 AI 基础设施上游（GPU / 网络 / 软件栈）。",
        mainSegments: "数据中心、游戏 GPU、汽车、专业可视化。",
        companyDescription:
          "英伟达以 GPU 为核心，向云厂商与企业客户提供 AI 训练与推理算力；CUDA 与软件栈强化迁移成本。需关注客户 capex 节奏、竞争格局与监管环境。",
        coreReasons: [
          "AI 工作负载扩张带动高端 GPU 与集群需求，短期景气与云厂商资本开支高度相关。",
          "软硬件一体化与开发者生态形成差异化，但估值对增长预期敏感。",
          "供应链、地缘政治与替代计算架构进展，可能改变中长期行业利润分配。",
        ],
      },
      {
        id: "ai-2",
        name: "Microsoft",
        ticker: "MSFT",
        market: "us",
        summary: "Azure 与 Copilot 产品线协同；企业客户粘性强，经常性收入占比高。",
        industryPosition: "云基础设施 + 生产力工具 + AI 应用入口。",
        mainSegments: "Azure、Microsoft 365、Windows、安全与行业解决方案。",
        companyDescription:
          "微软以企业市场为主，云与 AI 功能嵌入办公与业务流程；资本开支上升反映算力建设投入。需跟踪 AI 货币化路径与竞争定价。",
        coreReasons: [
          "企业数字化与云迁移的长期趋势提供需求底座。",
          "AI 功能提升 ARPU 的潜力与落地节奏存在不确定性。",
          "监管与反垄断议题可能影响部分产品分发与分成模式。",
        ],
      },
      {
        id: "ai-3",
        name: "科大讯飞",
        ticker: "002230",
        market: "cn",
        summary: "中文语音与认知智能应用落地广泛；教育、政务等场景具备项目制收入特征。",
        industryPosition: "中文大模型与行业智能化解决方案。",
        mainSegments: "教育、医疗、城市、消费者硬件与开放平台。",
        companyDescription:
          "科大讯飞聚焦中文场景与行业应用，产品形态包含软件、硬件与项目交付。需关注回款周期、竞争加剧与研发投入强度。",
        coreReasons: [
          "中文数据与行业 know-how 形成差异化落地能力。",
          "项目制收入占比可能带来利润波动与现金流管理压力。",
          "大模型竞赛推高研发与算力成本，商业化节奏需持续验证。",
        ],
      },
      {
        id: "ai-4",
        name: "商汤",
        ticker: "00020",
        market: "hk",
        summary: "计算机视觉与生成式 AI 能力向智慧城市与商业客户输出。",
        industryPosition: "视觉 AI 平台与行业解决方案。",
        mainSegments: "智慧城市、商业、智能汽车、创新业务。",
        companyDescription:
          "商汤以视觉与多模态能力为核心，面向政企与商业客户提供平台与解决方案。需关注订单转化、毛利率与现金流改善路径。",
        coreReasons: [
          "平台化能力与行业场景结合，具备项目扩展空间。",
          "行业竞争与价格压力可能影响盈利修复速度。",
          "研发投入与商业化平衡决定中长期护城河厚度。",
        ],
      },
      {
        id: "ai-5",
        name: "Alphabet",
        ticker: "GOOGL",
        market: "us",
        summary: "搜索与 YouTube 广告规模领先；云与 AI 基础设施投入加大。",
        industryPosition: "数字广告 + 云 + AI 研究与应用分发。",
        mainSegments: "Google 服务、Google 云、Other Bets。",
        companyDescription:
          "Alphabet 以广告为利润核心，同时通过云与 AI 产品拓展增量；AI 对搜索分发的长期影响为结构性观察点。",
        coreReasons: [
          "广告业务现金流充沛，为研发与资本开支提供缓冲。",
          "云业务增速与利润率改善影响估值弹性。",
          "监管与反垄断风险对商业模式存在尾部不确定性。",
        ],
      },
    ],
  },
  {
    slug: "robotics",
    titleZh: "机器人",
    titleEn: "Robotics",
    coverage: "覆盖工业机器人、核心零部件、人形机器人产业链与系统集成（教学演示，非荐股）。",
    picks: [
      {
        id: "rb-1",
        name: "汇川技术",
        ticker: "300124",
        market: "cn",
        summary: "工控与伺服系统龙头之一；制造业升级与国产替代带来需求弹性。",
        industryPosition: "运动控制、伺服驱动、工业机器人核心部件与解决方案。",
        mainSegments: "通用自动化、电梯、新能源汽车、轨道交通。",
        companyDescription:
          "汇川技术在伺服与变频器等领域具备较强竞争力，并向机器人与新能源车相关自动化延伸。需关注制造业资本开支周期与价格竞争。",
        coreReasons: [
          "国产替代与下游行业自动化渗透率提升提供中长期需求。",
          "多业务线扩张带来增长，但也可能稀释管理与资源聚焦。",
          "周期属性导致盈利波动，需结合库存与订单节奏判断拐点。",
        ],
      },
      {
        id: "rb-2",
        name: "微创机器人",
        ticker: "02252",
        market: "hk",
        summary: "手术机器人国产替代与医院渗透为核心叙事；商业化与放量节奏决定兑现。",
        industryPosition: "腔镜手术机器人等高端医疗机器人研发与商业化。",
        mainSegments: "图迈等机器人产品线、培训与服务体系（示例归纳）。",
        companyDescription:
          "微创机器人聚焦手术机器人赛道，研发与取证周期较长。需关注入院进度、竞争格局、费用率与现金流。",
        coreReasons: [
          "国产替代与医保支付环境变化可能带来结构性机会。",
          "高研发投入与取证不确定性对短期盈利形成压力。",
          "龙头进口品牌竞争仍在，商业化节奏需要持续跟踪。",
        ],
      },
      {
        id: "rb-3",
        name: "Intuitive Surgical",
        ticker: "ISRG",
        market: "us",
        summary: "手术机器人系统与耗材生态；装机量与每机使用强度驱动经常性收入。",
        industryPosition: "医疗机器人（微创手术机器人平台）。",
        mainSegments: "达芬奇系统、耗材与服务、数字化产品。",
        companyDescription:
          "直觉外科以手术机器人为核心，形成设备 + 耗材 + 服务的闭环。需关注医院资本开支、竞品进入与监管审批节奏。",
        coreReasons: [
          "高转换成本与培训体系强化客户粘性。",
          "耗材与服务提供稳定经常性收入。",
          "估值对增长与渗透率预期敏感，需警惕竞争格局变化。",
        ],
      },
      {
        id: "rb-4",
        name: "埃斯顿",
        ticker: "002747",
        market: "cn",
        summary: "国产工业机器人与运动控制代表企业之一；并购整合与出海为看点。",
        industryPosition: "工业机器人整机、核心零部件与智能制造系统。",
        mainSegments: "机器人本体、自动化产线、运动控制。",
        companyDescription:
          "埃斯顿通过内生与外延布局机器人产业链。需关注并购商誉、整合效率与下游需求波动。",
        coreReasons: [
          "产业链一体化有助于成本与交付能力。",
          "整合风险与财务杠杆需要持续跟踪。",
          "制造业景气与价格战影响短期利润率。",
        ],
      },
    ],
  },
  {
    slug: "aerospace",
    titleZh: "航空航天",
    titleEn: "Aerospace",
    coverage: "覆盖防务航空、商用航发产业链、卫星与航天电子等（教学演示，非荐股）。",
    picks: [
      {
        id: "as-1",
        name: "Lockheed Martin",
        ticker: "LMT",
        market: "us",
        summary: "防务系统与航空平台龙头；订单周期长、现金流相对稳定。",
        industryPosition: "防务航空、导弹与火控、航天系统。",
        mainSegments: "航空、旋转与任务系统、太空、导弹与火控。",
        companyDescription:
          "洛克希德·马丁以美国政府与盟友防务订单为主，项目制与长周期合同特征明显。需关注预算政治、合同执行与供应链。",
        coreReasons: [
          "防务需求具备一定逆周期属性，但受财政与政治周期影响。",
          "长订单周期带来可见性，也可能带来交付集中与执行风险。",
          "ESG 与伦理争议可能对部分资金配置形成约束。",
        ],
      },
      {
        id: "as-2",
        name: "中航沈飞",
        ticker: "600760",
        market: "cn",
        summary: "军用航空整机平台重要供应商之一；装备批产与交付节奏影响收入确认。",
        industryPosition: "军用航空整机与维修保障相关产业链。",
        mainSegments: "整机、备件、维修服务（示例归纳）。",
        companyDescription:
          "中航沈飞业务与国防装备需求相关，具备较强的计划性与准入壁垒。需关注订单节奏、定价机制与成本管控。",
        coreReasons: [
          "行业准入壁垒高，竞争格局相对稳定。",
          "需求与采购节奏可能导致季度间波动。",
          "信息披露与估值框架需结合军工行业特性理解。",
        ],
      },
      {
        id: "as-3",
        name: "RTX",
        ticker: "RTX",
        market: "us",
        summary: "商用航发与防务电子综合集团；售后市场与备件贡献现金流。",
        industryPosition: "商用航空发动机、防务系统、导弹防御。",
        mainSegments: "Collins Aerospace、Raytheon、发动机售后。",
        companyDescription:
          "RTX 业务横跨商用航发与防务电子，具备售后与备件收入缓冲。需关注航空出行周期、供应链与项目风险。",
        coreReasons: [
          "航发售后市场提供较高毛利与粘性。",
          "防务订单提供需求韧性。",
          "大型项目执行与质量风险可能带来一次性冲击。",
        ],
      },
    ],
  },
  {
    slug: "uav",
    titleZh: "无人机",
    titleEn: "UAV / Drones",
    coverage: "覆盖工业无人机、eVTOL、军用无人机产业链与关键载荷（教学演示，非荐股）。",
    picks: [
      {
        id: "uav-1",
        name: "EHang",
        ticker: "EH",
        market: "us",
        summary: "eVTOL 与城市空中交通叙事代表之一；取证与商业化进度决定兑现节奏。",
        industryPosition: "载人/载物自动驾驶飞行器与运营生态（早期阶段）。",
        mainSegments: "整机、培训、运营服务（示例归纳）。",
        companyDescription:
          "亿航智能聚焦 eVTOL 产品研发与适航取证，行业处于早期高投入阶段。需关注监管、取证进展、订单与现金流。",
        coreReasons: [
          "赛道具备长期想象空间，但技术与监管路径不确定性强。",
          "资本开支与研发投入对现金消耗大。",
          "订单与交付的可验证性是估值锚点之一。",
        ],
      },
      {
        id: "uav-2",
        name: "航天彩虹",
        ticker: "002389",
        market: "cn",
        summary: "无人机系统与智能弹药相关产业链；军贸与内需双轮驱动（示例表述）。",
        industryPosition: "中大型无人机系统与配套应用。",
        mainSegments: "无人机整机、载荷、维修保障（示例归纳）。",
        companyDescription:
          "航天彩虹业务与特种应用场景相关，订单与交付节奏对业绩影响显著。需关注采购节奏、定价与竞争格局。",
        coreReasons: [
          "细分赛道壁垒较高，需求具备计划性。",
          "订单波动与项目确认节奏影响短期利润。",
          "信息披露与可比公司较少，研究需结合产业链验证。",
        ],
      },
      {
        id: "uav-3",
        name: "大疆（未上市）",
        ticker: "—",
        market: "cn",
        summary: "消费与工业无人机全球份额领先；未上市标的仅作产业链学习参考。",
        industryPosition: "消费无人机、行业无人机与影像系统。",
        mainSegments: "硬件、软件、行业解决方案（示例归纳）。",
        companyDescription:
          "大疆在消费与工业无人机市场具备品牌与供应链优势。未上市公司无法通过二级市场直接投资，本条目仅用于理解产业链格局。",
        coreReasons: [
          "龙头地位有助于理解产业链利润分配与零部件机会。",
          "未上市意味着流动性与信息透明度与上市公司不同。",
          "监管与出口管制可能影响全球业务扩张路径。",
        ],
      },
    ],
  },
  {
    slug: "energy-storage",
    titleZh: "储能电池",
    titleEn: "BESS",
    coverage: "覆盖大储系统集成、变流器 PCS、电芯与热管理/消防等关键环节（教学演示，非荐股）。",
    picks: [
      {
        id: "es-1",
        name: "Fluence",
        ticker: "FLNC",
        market: "us",
        summary: "大型储能系统集成与软件服务；项目制收入与交付节奏影响短期利润。",
        industryPosition: "大型储能系统集成、能源管理软件与运维服务。",
        mainSegments: "储能系统、软件与控制、运维服务。",
        companyDescription:
          "Fluence 面向公用事业与独立发电商等客户提供储能系统与软件平台，行业受新能源装机、电网政策与原材料价格影响较大。",
        coreReasons: [
          "全球大储渗透率提升带来需求扩张，但区域政策差异显著。",
          "项目制业务导致收入与毛利率波动，需要跟踪订单质量与执行。",
          "电芯价格与供应链变化会传导至系统集成商利润。",
        ],
      },
      {
        id: "es-2",
        name: "Tesla",
        ticker: "TSLA",
        market: "us",
        summary: "能源存储业务增速较快；与电动车业务共享品牌与部分供应链。",
        industryPosition: "户用与公用事业级储能产品、能源软件与调度。",
        mainSegments: "Megapack、Powerwall、能源交易与软件。",
        companyDescription:
          "特斯拉能源业务受益于可再生能源装机与峰谷套利需求；同时公司整体估值仍高度依赖汽车业务预期。",
        coreReasons: [
          "储能业务提供增量叙事，但利润贡献占比仍可能波动。",
          "产能爬坡与安装服务能力影响交付体验。",
          "汽车业务竞争与价格战可能外溢影响整体风险偏好。",
        ],
      },
      {
        id: "es-3",
        name: "宁德时代",
        ticker: "300750",
        market: "cn",
        summary: "动力电池龙头向储能电芯延伸；规模与成本曲线为核心壁垒。",
        industryPosition: "锂电池研发制造，覆盖动力与储能场景。",
        mainSegments: "动力电池、储能电池、材料回收与矿产资源布局。",
        companyDescription:
          "宁德时代在产能、客户结构与技术研发上具备规模优势；储能业务与动力业务共享制造与供应链能力。需关注产能利用率、价格与海外政策。",
        coreReasons: [
          "规模与成本优势强化市场份额与议价能力。",
          "价格竞争与原材料波动影响利润率。",
          "海外建厂与贸易政策带来运营复杂度上升。",
        ],
      },
      {
        id: "es-4",
        name: "阳光电源",
        ticker: "300274",
        market: "cn",
        summary: "光伏逆变器龙头，储能系统集成能力突出；海外收入占比高。",
        industryPosition: "光伏逆变器、储能系统集成与新能源电站解决方案。",
        mainSegments: "逆变器、储能系统、新能源投资开发（示例归纳）。",
        companyDescription:
          "阳光电源在逆变器与储能系统集成领域具备较强竞争力，海外渠道与项目经验为关键资产。需关注汇率、运费与海外政策风险。",
        coreReasons: [
          "光储一体化趋势提升解决方案价值。",
          "海外收入带来增长，也带来合规与地缘风险。",
          "项目制与渠道库存可能导致短期业绩波动。",
        ],
      },
    ],
  },
];

export function getIndustryBySlug(slug: string | undefined): IndustryTheme | undefined {
  if (!slug) return undefined;
  return industries.find((i) => i.slug === slug);
}

export const defaultIndustrySlug = industries[0].slug;
