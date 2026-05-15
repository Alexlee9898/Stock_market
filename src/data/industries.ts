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
    slug: "semiconductor",
    titleZh: "半导体",
    titleEn: "Semiconductor",
    coverage:
      "行业处于「总量复苏、结构性过热、赛道分化」：AI 算力、HBM、先进封装与高端设备高景气；成熟制程、功率器件与部分材料仍处去库存后的修复期。本页覆盖美股、A 股与港股链上设计、制造、设备、材料、封测等代表性标的；投资上宜区分产业地位与估值位置，并关注资本开支、国产替代与出口管制（教学演示，非投资建议）。",
    picks: [
      {
        id: "semi-1",
        name: "NVIDIA",
        ticker: "NVDA",
        market: "us",
        summary:
          "AI 计算平台龙头；数据中心收入与毛利率处于高位，但估值已充分反映高预期，需跟踪云厂商 CAPEX 与竞争分流。",
        industryPosition: "GPU / AI 系统 / 网络与软件生态（CUDA、机架级方案）。",
        mainSegments: "数据中心、游戏、专业可视化、汽车。",
        companyDescription:
          "英伟达不止卖芯片，而是以 GPU + 系统软件 + 开发者生态锁定客户。AI 训练向推理扩散、企业 Agent 与整机占比提升是中期逻辑；风险在于定制 ASIC 分流、出口限制与板块估值过热。",
        coreReasons: [
          "占据 AI 算力主赛道平台位，数据中心业务贡献主要收入与利润弹性。",
          "CUDA 与整机协同形成高迁移成本，但股价已对高增长定价，容错率偏低。",
          "需持续跟踪大客户资本开支节奏、竞争格局与监管政策变化。",
        ],
      },
      {
        id: "semi-2",
        name: "AMD",
        ticker: "AMD",
        market: "us",
        summary: "x86 服务器 CPU 与 Instinct GPU 双轮驱动；在 AI 与通用算力上追赶龙头，估值波动大。",
        industryPosition: "CPU、GPU、AI 加速器与数据中心解决方案。",
        mainSegments: "数据中心、客户端、游戏、嵌入式。",
        companyDescription:
          "AMD 在服务器 CPU 份额提升的同时布局 Instinct 系列 AI 芯片，客户以云厂商与 OEM 为主。产业逻辑清晰，但相对 NVIDIA 仍处第二梯队，盈利与估值对周期更敏感。",
        coreReasons: [
          "服务器 CPU 与 AI GPU 产品线协同，受益于云与 HPC 资本开支。",
          "与英特尔、英伟达竞争加剧，份额与定价需季度验证。",
          "高成长预期下估值弹性大，业绩不及预期时回撤风险较高。",
        ],
      },
      {
        id: "semi-3",
        name: "Broadcom",
        ticker: "AVGO",
        market: "us",
        summary: "定制 AI 加速器与 AI 网络芯片高景气；客户集中度较高，属 AI 基础设施「卖铲人」逻辑。",
        industryPosition: "定制 ASIC、以太网 / AI 网络、连接与基础设施软件。",
        mainSegments: "半导体解决方案、基础设施软件（收购整合后）。",
        companyDescription:
          "博通深度绑定超大规模云客户的定制芯片与网络需求，在 AI 集群互连上份额突出。商业模式偏长单与客户绑定，但收入集中与估值高位是主要风险。",
        coreReasons: [
          "定制 AI 芯片与网络需求随云 CAPEX 扩张，短期景气度强。",
          "大客户订单可见度高，但集中度带来单一客户砍单风险。",
          "并购整合与软件业务改善利润结构，需关注监管与估值。",
        ],
      },
      {
        id: "semi-4",
        name: "Taiwan Semiconductor",
        ticker: "TSM",
        market: "us",
        summary: "先进制程代工龙头；3nm/5nm/7nm 收入占比高，AI/HPC 订单饱满，地缘风险为定价核心变量。",
        industryPosition: "先进逻辑代工、先进封装（CoWoS 等）协同。",
        mainSegments: "晶圆代工、先进封装与掩膜服务等。",
        companyDescription:
          "台积电专注代工，良率与客户共研构成壁垒。N2 等节点与先进封装是 AI 算力扩张的关键产能；股票除成长外须为地缘政治与区域集中度留出折价空间。",
        coreReasons: [
          "全球先进逻辑制造枢纽，先进制程收入占比持续提升。",
          "与苹果、英伟达等头部客户绑定深，产能利用率影响盈利。",
          "地缘与出口管制议题可能放大股价波动，不宜只看产业地位。",
        ],
      },
      {
        id: "semi-5",
        name: "ASML",
        ticker: "ASML",
        market: "us",
        summary: "EUV 光刻近乎独占；设备 + 升级 + 服务复利模型，但出口管制与客户 CAPEX 波动是核心风险。",
        industryPosition: "光刻、量测、计算光刻与装机基盘管理。",
        mainSegments: "EUV/DUV 系统、安装基础服务、计算光刻软件。",
        companyDescription:
          "ASML 代表半导体设备最高壁垒环节，EUV 对先进制程不可或缺。收入质量与毛利率极高；风险主要来自地缘政治下的出口限制及晶圆厂资本开支周期。",
        coreReasons: [
          "EUV 在先进节点具备稀缺性，订单与装机基盘提供长期收入。",
          "毛利率与研发强度领先设备行业，盈利质量突出。",
          "出口管制与客户扩产节奏延迟可能显著影响短期业绩与股价。",
        ],
      },
      {
        id: "semi-6",
        name: "Micron",
        ticker: "MU",
        market: "us",
        summary: "DRAM / NAND / HBM 全面受益 AI 周期；存储属高弹性品类，价格波动仍不可忽视。",
        industryPosition: "存储芯片设计制造（美国存储龙头）。",
        mainSegments: "DRAM、NAND、HBM、数据中心与移动端存储。",
        companyDescription:
          "美光在本轮 AI 周期中受益于 HBM 与数据中心存储需求，各业务单元收入曾创阶段高点。投资属性偏周期反转与高成长叠加，需跟踪存储价格与库存。",
        coreReasons: [
          "HBM 与 AI 服务器拉动高端 DRAM 需求，景气度处于上行。",
          "存储行业仍具价格周期，盈利对供需平衡敏感。",
          "资本开支与产能扩张若过快，中期可能压制价格与利润率。",
        ],
      },
      {
        id: "semi-7",
        name: "Applied Materials",
        ticker: "AMAT",
        market: "us",
        summary: "平台型前道设备巨头；覆盖沉积、刻蚀、CMP 等多品类，受益全球晶圆厂资本开支。",
        industryPosition: "半导体制造设备（平台型）。",
        mainSegments: "晶圆制造设备、封装设备与服务。",
        companyDescription:
          "应用材料品类最全的前道设备厂商之一，客户涵盖 Foundry、Memory 与 IDM。逻辑是 AI 与本土化扩产带动设备支出；风险为周期下行与部分市场出口限制。",
        coreReasons: [
          "平台化设备组合提高单客户渗透与替换成本。",
          "SEMI 等机构预计晶圆厂设备支出仍处扩张，订单可见度较好。",
          "存储与成熟制程资本开支回落时，收入与估值可能承压。",
        ],
      },
      {
        id: "semi-8",
        name: "Lam Research",
        ticker: "LRCX",
        market: "us",
        summary: "刻蚀与沉积设备核心供应商；存储与先进逻辑扩产均受益，存储周期影响显著。",
        industryPosition: "刻蚀、薄膜沉积、清洗设备。",
        mainSegments: "前道刻蚀/沉积、晶圆制造服务与相关技术。",
        companyDescription:
          "泛林在刻蚀与沉积工艺积累深，是存储厂与先进逻辑厂关键供应商。AI 带动的高端产能建设支撑需求；需关注 NAND/DRAM 周期与对华出口政策。",
        coreReasons: [
          "刻蚀/沉积为晶圆制造关键步骤，客户验证周期长、粘性强。",
          "先进逻辑与 HBM 相关产能扩张带来增量订单。",
          "存储景气回落或限制放松节奏变化，可能影响短期业绩。",
        ],
      },
      {
        id: "semi-9",
        name: "onsemi",
        ticker: "ON",
        market: "us",
        summary: "汽车与工业功率半导体；处于修复期，盈利改善慢于 AI 链，更像周期反转标的。",
        industryPosition: "功率器件、传感与模拟（车规与工业）。",
        mainSegments: "汽车电子、工业、云电源等。",
        companyDescription:
          "安森美聚焦车规与工业功率，与 AI 算力链景气不同步。2026 年一季度呈现同比修复但盈利能力尚未全面恢复，适合按库存周期与车端需求跟踪。",
        coreReasons: [
          "汽车电动化与工业自动化提供中长期需求底座。",
          "去库存结束后收入修复，但毛利率与产能利用率仍待验证。",
          "与 AI 主线相比弹性偏弱，宜按周期股框架估值。",
        ],
      },
      {
        id: "semi-10",
        name: "Entegris",
        ticker: "ENTG",
        market: "us",
        summary: "特种材料与耗材；先进制程对纯度与供应稳定性要求高，偏「高黏性耗材」逻辑。",
        industryPosition: "半导体材料、过滤与传输解决方案。",
        mainSegments: "先进材料、微污染控制、特种化学品与 handling。",
        companyDescription:
          "Entegris 处于上游材料环节，客户认证周期长、切换成本高。先进制程与 HBM 扩产拉动特种材料需求；景气更多随晶圆厂稼动率与资本开支波动。",
        coreReasons: [
          "材料环节一旦导入产线，收入具备持续性与复购属性。",
          "先进节点对污染控制与化学品纯度要求提升，利好龙头。",
          "晶圆厂减产或去库存阶段，耗材需求可能阶段性走弱。",
        ],
      },
      {
        id: "semi-11",
        name: "北方华创",
        ticker: "002371",
        market: "cn",
        summary: "国内平台型前道设备龙头；刻蚀、薄膜、炉管等多品类扩张，国产替代逻辑清晰。",
        industryPosition: "半导体前道设备平台（刻蚀、PVD/CVD、清洗、炉管等）。",
        mainSegments: "集成电路装备、电子元器件、新能源锂电装备等。",
        companyDescription:
          "北方华创是国内最接近「平台型设备龙头」的标的之一，优势在于多品类验证与客户导入后的放大效应。研发投入占比高，新品验证周期与毛利率波动是跟踪重点。",
        coreReasons: [
          "国产化率提升与本土晶圆厂扩产带来中长期订单可见度。",
          "平台化扩张提高单客户价值，但新品导入可能阶段性拖累利润。",
          "与国际龙头仍有技术代差，需按验证节奏而非概念热度定价。",
        ],
      },
      {
        id: "semi-12",
        name: "中微公司",
        ticker: "688012",
        market: "cn",
        summary: "高端刻蚀设备领先；先进逻辑与存储关键工艺导入，属高壁垒设备成长股。",
        industryPosition: "刻蚀、LPCVD/ALD 等半导体设备。",
        mainSegments: "CCP 刻蚀、ICP 刻蚀、薄膜沉积设备。",
        companyDescription:
          "中微公司在刻蚀环节具备较强技术积累，是国产替代中「单点做强」的代表。客户验证与海外拓展决定成长斜率；研发费用与订单交付节奏影响短期盈利。",
        coreReasons: [
          "刻蚀为晶圆制造刚需步骤，验证通过后粘性强、复购稳定。",
          "先进制程与存储扩产带来增量导入机会。",
          "设备行业受下游资本开支波动影响，订单确认存在节奏差。",
        ],
      },
      {
        id: "semi-13",
        name: "华海清科",
        ticker: "688120",
        market: "cn",
        summary: "CMP 设备国产核心；向减薄、再生与服务延伸，装备 + 耗材模式增强黏性。",
        industryPosition: "CMP、减薄、晶圆再生与相关服务。",
        mainSegments: "CMP 装备、清洗、晶圆再生、关键耗材与服务等。",
        companyDescription:
          "华海清科在 CMP 环节占据国产替代枢纽位置，并尝试向服务与再生业务延伸。CMP 一旦导入产线切换成本高；需关注竞争导入与毛利率变化。",
        coreReasons: [
          "CMP 为先进制程必备工艺，国产化空间仍大。",
          "服务与再生延伸有助于提高客户生命周期价值。",
          "新品类扩张带来增长，也可能增加研发与验证投入。",
        ],
      },
      {
        id: "semi-14",
        name: "安集科技",
        ticker: "688019",
        market: "cn",
        summary: "CMP 抛光液与湿电子化学品龙头；配方壁垒高，全球份额持续提升。",
        industryPosition: "CMP 抛光液、后 CMP 清洗液、功能性湿电子化学品。",
        mainSegments: "化学机械抛光液、清洗液、刻蚀后清洗等。",
        companyDescription:
          "安集科技代表上游材料里「高黏性耗材」逻辑，研发投入占比高。优势在配方与客户认证；风险在于下游扩产节奏与海外竞品价格压力。",
        coreReasons: [
          "材料导入后具备持续复购属性，盈利质量通常优于重资产制造。",
          "先进制程与 3D 结构拉动新品类需求。",
          "晶圆厂去库存阶段，耗材收入可能阶段性承压。",
        ],
      },
      {
        id: "semi-15",
        name: "沪硅产业",
        ticker: "688126",
        market: "cn",
        summary: "300mm 大硅片国产化核心；硅片行业量恢复、价仍弱，更接近周期修复资产。",
        industryPosition: "半导体硅片（300mm 大硅片、SOI 等）。",
        mainSegments: "抛光片、外延片、SOI 硅片等。",
        companyDescription:
          "沪硅产业对应大硅片国产替代长逻辑。行业经历多年去库存后 300mm 需求回暖，但价格修复慢于出货量；资本开支与良率爬坡影响盈利兑现。",
        coreReasons: [
          "大硅片国产化是供应链安全主线，长期渗透逻辑清晰。",
          "行业处于修复期，出货量回升但价格仍制约利润弹性。",
          "重资产扩产带来折旧压力，需跟踪产能利用率。",
        ],
      },
      {
        id: "semi-16",
        name: "海光信息",
        ticker: "688041",
        market: "cn",
        summary: "国产服务器 CPU/DCU 平台；算力国产化受益标的，生态与订单兑现是关键。",
        industryPosition: "x86 兼容服务器 CPU、深度计算处理器（DCU）。",
        mainSegments: "高端处理器、协处理器与相关解决方案。",
        companyDescription:
          "海光信息对应国产算力「平台化」路线，收入与利润受党政、金融、互联网及大模型场景渗透驱动。技术壁垒在兼容性与系统稳定性；股价波动往往反映预期交易。",
        coreReasons: [
          "国产服务器与数据中心算力替代提供中长期需求。",
          "CPU 与 DCU 协同有助于提高单客户价值。",
          "生态成熟度与同业竞争决定份额，估值对预期敏感。",
        ],
      },
      {
        id: "semi-17",
        name: "寒武纪",
        ticker: "688256",
        market: "cn",
        summary: "国产 AI 训练/推理芯片；产业叙事强、波动大，需跟踪产品迭代与客户导入。",
        industryPosition: "AI 芯片与智能计算集群系统。",
        mainSegments: "云端训练芯片、边缘推理芯片、软件栈与整机方案。",
        companyDescription:
          "寒武纪是国产 AI 算力纯度较高的设计公司之一，收入与亏损改善依赖大模型与云厂商订单。投资属性偏产业预期交易，需区分技术进展与估值安全边际。",
        coreReasons: [
          "大模型与国产算力政策催化需求，具备主题弹性。",
          "客户集中与产品竞争力决定收入兑现速度。",
          "研发投入与商业化平衡影响中长期护城河与股价波动。",
        ],
      },
      {
        id: "semi-18",
        name: "澜起科技",
        ticker: "688008",
        market: "cn",
        summary: "内存接口芯片龙头；数据中心互连、CXL 等方向具备稀缺性。",
        industryPosition: "内存接口芯片、津逮服务器平台、PCIe Retimer 等。",
        mainSegments: "DDR 接口芯片、PCIe/CXL Retimer、津逮 CPU 等。",
        companyDescription:
          "澜起科技在内存接口环节具备全球竞争力，受益于 DDR 世代升级与服务器架构演进。业务与数据中心资本开支相关，但竞争格局相对清晰。",
        coreReasons: [
          "接口芯片技术壁垒高，客户认证周期长。",
          "DDR5 渗透与 CXL 等新标准带来产品迭代机会。",
          "下游服务器出货波动可能影响短期收入节奏。",
        ],
      },
      {
        id: "semi-19",
        name: "兆易创新",
        ticker: "603986",
        market: "cn",
        summary: "NOR Flash 与 MCU 龙头；存储+MCU 国产替代，消费与工业复苏影响景气。",
        industryPosition: "存储芯片、MCU 与传感器。",
        mainSegments: "NOR Flash、MCU、DRAM 代理/自研、传感等。",
        companyDescription:
          "兆易创新在 NOR Flash 与 MCU 领域具备规模优势，受益本土供应链替代。行业竞争分散，价格与库存周期对盈利影响明显，宜按周期框架跟踪。",
        coreReasons: [
          "本土客户导入带来份额提升空间。",
          "MCU 与存储组合提高平台化销售能力。",
          "消费电子与工业需求波动带来业绩弹性。",
        ],
      },
      {
        id: "semi-20",
        name: "中芯国际",
        ticker: "688981",
        market: "cn",
        summary: "本土晶圆代工枢纽；成熟制程与特色工艺受益国产替代，先进制程受设备限制。",
        industryPosition: "晶圆代工（成熟与部分先进节点）。",
        mainSegments: "逻辑代工、特色工艺、掩膜与相关服务。",
        companyDescription:
          "中芯国际是 A 股视角下制造链核心资产，收入与毛利率随产能利用率与产品结构变化。资本开支、折旧与地缘政治、设备获取能力共同影响盈利与估值。",
        coreReasons: [
          "本土设计公司本地化流片需求提供订单底座。",
          "成熟制程利用率回升改善盈利，但价格竞争仍存。",
          "先进制程与设备限制影响长期技术天花板预期。",
        ],
      },
      {
        id: "semi-21",
        name: "华虹半导体",
        ticker: "688347",
        market: "cn",
        summary: "特色工艺代工（功率、模拟、嵌入式 NVM）；成熟节点复苏受益标的。",
        industryPosition: "特色工艺晶圆代工。",
        mainSegments: "功率器件、模拟、嵌入式存储、MCU 代工等。",
        companyDescription:
          "华虹聚焦特色工艺而非最先进逻辑，与汽车、工业、功率电子需求关联度高。盈利修复节奏通常慢于 AI 链，但估值波动相对温和。",
        coreReasons: [
          "特色工艺客户粘性强，适合本土功率与模拟设计公司。",
          "成熟制程复苏带动产能利用率改善。",
          "扩产与折旧需与需求匹配，避免价格战压制毛利。",
        ],
      },
      {
        id: "semi-22",
        name: "长电科技",
        ticker: "600584",
        market: "cn",
        summary: "大陆封测龙头；先进封装收入占比提升，向高端封装升级。",
        industryPosition: "封装测试、先进封装与系统级封装。",
        mainSegments: "传统封装、先进封装、测试服务。",
        companyDescription:
          "长电科技先进封装相关收入占比较高，绑定国际与国内头部客户。逻辑是 Chiplet 与算力封装需求提升单颗价值；风险在于价格竞争与资本开支错配。",
        coreReasons: [
          "先进封装渗透率提升改善产品组合与毛利。",
          "AI/HPC 客户项目放量带来增量。",
          "封测行业周期性明显，需跟踪订单与产能利用率。",
        ],
      },
      {
        id: "semi-23",
        name: "通富微电",
        ticker: "002156",
        market: "cn",
        summary: "封测与 CPU/GPU 封装弹性；绑定大客户项目，业绩波动与订单集中度相关。",
        industryPosition: "集成电路封装测试。",
        mainSegments: "传统封测、高端处理器封装、测试等。",
        companyDescription:
          "通富微电在高端处理器封测环节具备较强弹性，与部分国际大客户深度绑定。收入景气与下游芯片出货相关；客户集中与扩产节奏是主要风险。",
        coreReasons: [
          "算力芯片封装需求提升单颗封装价值。",
          "大客户项目导入带来收入跃升可能。",
          "客户集中度高，订单波动对业绩影响大。",
        ],
      },
      {
        id: "semi-24",
        name: "中芯国际",
        ticker: "0981",
        market: "hk",
        summary: "港股视角下的本土代工龙头；AH 溢价与地缘预期常影响港股定价。",
        industryPosition: "晶圆代工（与 A 股上市主体同一集团）。",
        mainSegments: "逻辑代工、特色工艺、掩膜服务等。",
        companyDescription:
          "中芯国际 H 股为国际资金配置中国半导体制造的主要入口之一。基本面与 A 股同源，但流动性、汇率与风险偏好差异会导致港股相对 A 股波动特征不同。",
        coreReasons: [
          "制造链国产替代逻辑在港股同样有主题映射。",
          "国际投资者关注地缘与出口管制，股价弹性可能更大。",
          "需同时跟踪产能利用率、资本开支与 AH 估值差。",
        ],
      },
      {
        id: "semi-25",
        name: "华虹半导体",
        ticker: "1347",
        market: "hk",
        summary: "港股上市的特色工艺代工；功率与模拟景气修复的制造侧标的。",
        industryPosition: "特色工艺晶圆代工（港股主体）。",
        mainSegments: "功率、模拟、嵌入式 NVM、MCU 代工等。",
        companyDescription:
          "华虹半导体 H 股便于配置特色工艺代工复苏。业务重心在成熟节点与特色工艺，与 AI 先进制程主线关联度低于代工龙头，更适合周期与国产替代并重的研究框架。",
        coreReasons: [
          "汽车与工业芯片需求回暖利好特色工艺稼动率。",
          "港股半导体板块对政策与风险偏好敏感。",
          "扩产周期需与下游需求匹配，避免盈利不及预期。",
        ],
      },
      {
        id: "semi-26",
        name: "ASMPT",
        ticker: "0522",
        market: "hk",
        summary: "全球封装设备与材料龙头之一；先进封装设备受益 CoWoS/Chiplet 趋势（港股）。",
        industryPosition: "半导体封装设备、SMT 解决方案与先进封装材料。",
        mainSegments: "固晶、焊线、封装设备、先进封装解决方案。",
        companyDescription:
          "ASMPT 是港股市场中稀缺的半导体封装设备标的，与全球封测扩产及先进封装升级相关。收入受封测厂资本开支驱动，亦受消费电子与汽车景气间接影响。",
        coreReasons: [
          "先进封装投资升温带动高端封装设备需求。",
          "客户遍布全球封测厂，订单具一定周期属性。",
          "港股流动性与半导体板块情绪可能放大股价波动。",
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
