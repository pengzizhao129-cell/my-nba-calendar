# MG+ Product & Visual Bible

Version 1.0 · 2026 · Canonical product and visual constitution

本文件是 MG+ 的最高产品与视觉规范。与历史迭代文档冲突时，以本文件为准；实现细节与已验证的固定几何另见 [Digital Game Ticket](digital-game-ticket.md)。未来概念不等于当前已实现功能，开发范围必须遵守第 35–37 节。

## 01 / What is MG+

**MG+ / 我的主队日历 = Personal Basketball Season Archive。**

它把用户支持球队的赛季转成个人比赛记录、城市记录与数字收藏。传统体育产品记录 *What happened in the game.* MG+ 还记录 *Where were you when it happened?*

## 02 / Core idea

核心对象不是 Schedule、Ticket 或 Score，而是 **The game you experienced**。

**GAME × TEAM × LOCATION**：比赛决定事件，球队决定身份，城市决定个人版本。同场 HOU vs LAL，在 Houston、Tokyo、Kobe、Shanghai、London 观看，是不同经历。

最终记录可呈现 `HOU 117 — 112 LAL / WATCHED FROM KOBE / OCT 25 2026 / 10:30 JST`。这是信息结构示例，不代表真实赛果或用户已观看。

## 03 / Brand philosophy

> 平时安静，比赛时有一点颜色。信息很多，但页面不吵。
>
> 比赛有比分，观赛也应该留下痕迹。

体育本身已经足够兴奋；MG+ 是承载这些情绪的安静容器。

## 04 / Brand personality

| 性格 | 可执行含义 |
| --- | --- |
| Quiet | 不主动制造噪音；空白承担层级 |
| Precise | 时间、城市、编号、状态都有明确来源与语义 |
| Personal | 同一场比赛可有不同的个人城市记录 |
| Collectible | 比赛结束后，完整凭证可以留下 |
| Editorial | 像体育杂志或赛季档案，避免工具面板语言 |
| Premium | 依靠秩序、比例、字体与一致性，不堆特效 |

## 05 / What MG+ is not

不做 ESPN、NBA Score App、Fantasy Basketball、Ticketmaster、球队官方 App、球星海报生成器、统计 Dashboard、普通日历或 NFT Marketplace。出现分歧时问：**这是不是让 MG+ 越来越像普通体育 App？** 如果是，重新审视设计。

## 06 / Product loop

`SELECT TEAM → LOCALIZE → PASS ISSUED → LIVE → FINAL → COLLECT → STAMP → ARCHIVE → SHARE → NEXT GAME`

最终形成 **MY SEASON**，留下「这是我的 2026–27 NBA 赛季」，而非浏览历史。该循环是长期方向；不要求 Beta 1 同时开发全部阶段。

## 07 / Local identity

时区不仅是换算工具，也是 **Location Identity**。城市必须具有：

| 字段 | 示例 |
| --- | --- |
| City name | KOBE / 神户 |
| Country | JAPAN / 日本 |
| Country code | JP |
| IANA time zone | Asia/Tokyo |
| UTC offset | GMT+9，按相关时刻与时区规则求值 |
| City code | KOB |

**KOBE ≠ TOKYO**，即便 IANA 时区相同。城市 ID 不能使用 timezone 代替；设备时区识别也不能证明用户实际位于该时区内的某座城市。

## 08 / City identity system

用文字与 metadata 表达城市：`KOBE · JP / 10:30 JST / GMT+9`，或 `WATCHED FROM / KOBE / JAPAN · GMT+9`。不使用天际线、旅游照片、国旗或地标堆叠。

用户选定的城市是当前 Location；历史观看地点是独立的经历记录。不能仅因切换当前城市，就改写历史 `WATCHED FROM` 或宣称用户看过比赛。没有观看记录时，不伪造经历。

## 09 / Game Pass

Game Pass 是一场比赛的 **Digital Artifact Container**，也是 MG+ 最重要的视觉对象。所有重要系统应回到它，而不是把它作为装饰 Card。

实体凭证感来自结构、信息与签发关系，不来自航空图标、Gate、Seat、Flight、条码或仿造认证字段。它记录数字观赛经历，不是入场资格证明。

## 10 / Pass lifecycle

| 产品状态 | 核心内容与含义 |
| --- | --- |
| ISSUED | 尚未开始：球队、日期、当地时间、城市、Game Number、Reference；`PASS ISSUED` |
| LIVE | 进行中：真实比分、节次、比赛钟；轻微增强信号，不做球馆大屏 |
| FINAL | 已结束：最终比分正式写入 Pass |
| COLLECTED | 永久档案：结果、已记录的观赛城市／当地时间、比赛序号、Reference |

内部的 `UPCOMING / NEXT UP / GAME DAY` 可以作为赛前关注度与视觉能量，不能冒充真实 LIVE。Beta 1 必须支持 ISSUED；没有真实状态数据时，不生成虚假进行中状态或比分。

生命周期保留既有边界：NEXT UP 是 selectedTeam 尚未结束的未来比赛按 startTime 排序后的第一场，不使用小时阈值。GAME DAY 比较所选 IANA timezone 下的 local calendar date。开赛不等于结束；归档依据真实 final/endTime，mock 阶段可使用明确封装的 estimatedEndTime。状态只能改变有限明度、信号、对比、情绪签注与材质强度，不移动 Pass DNA。

## 11 / Reference architecture

完整结构：**`MG26-HOU-LAL-004-JPKOB-02741`**。

| 段 | 含义 |
| --- | --- |
| MG26 | 2026–27 赛季 |
| HOU | 用户主队 |
| LAL | 对手 |
| 004 | 本赛季比赛序号 |
| JP | 国家代码 |
| KOB | 独立城市代码 |
| 02741 | 个人 Pass serial |

界面可缩写为 `REF. HOU-LAL.004 / KOB / JP / № 02741`。**Every character means something.** 随机装饰编号不能充当主要 Identity。

User PASS ID 与单场 Reference 职责不同。PASS ID 属于用户，换球队、城市、比赛、赛季都不变；Reference 属于该场比赛的个人／城市版本。测试阶段允许稳定本地签发机制，不能声称具有后端全局唯一性、官方认证或入场效力。未知场次不伪造 Game Number。

## 12 / Match DNA

**Same system. Different memory.**

固定 Layout、Typography、信息层级、Pass Structure、Reference 位置与品牌位置；允许变化 Opponent、有限 Team Color、Game Number、Player Silhouette、Match Geometry、Location、Game State、Result。

轮廓、主副券比例、Bridge、Spine、Security Window、Timing Sanctuary 的固定参数来自 Master Geometry。球队、城市、状态、比赛或赛季不得另造模板。图案最多发展一至两个有产品含义的系统；当前 Time Route 与 82 场 Season Spine 是可延续的基础，不重新加入随机水印。

## 13 / Player silhouette

每场可有一名 Game Representative：定妆照或轮廓、极低透明度、局部裁切，可超出票面边界。视觉权重约 4%–8%，第二眼才发现。不能成为 Hero Poster，不能压过球队、时间与比赛信息。

这是可选 Match DNA 方向，不是 Beta 1 强制增加的人物图层；没有合适素材或数据时，不虚构球员身份。

## 14 / Match representative rule

赛前优先主队代表球员；比赛中保持；赛后若有明确 Game Hero，Archive Version 可更新。`GAME HERO / #7 / 34 PTS` 等始终 secondary，不能演变成 Player Stats Card。

## 15 / Season passport

82 场不是 82 个标签，而是 **82 次留下痕迹**。未来用户拥有 Season Passport，每完成一场比赛可获得对应球队的 Stamp。完整 Passport 与盖章流程不在 Beta 1 范围。

## 16 / 30-team stamp DNA

未来各队 Stamp 必须定义 Primary / Secondary Color、Geometry、Typography Detail、Team/City Motif、Home / Away / Postseason Variant；不能是 30 个 Logo 加圆圈。

示例：Houston 的深红／黑、Orbit、Engine / Trajectory、HOU；Los Angeles 的紫／金、Radial、LA、Showtime rhythm；San Antonio 的黑／银、Industrial、Spur、SATX。遮住 Logo 仍应有球队气质。未来 Stamp 中的少量球队金色不代表全站采用黑金 VIP 风格。

## 17 / Passport differentiation

个人 Passport 的差异来自主队、观看场次、对手、主客场、城市、结果、特殊比赛与季后赛。两个 Rockets 球迷也不应拥有完全相同的经历档案；不能凭默认 mock 自动声称用户已观看。

## 18 / My season archive

核心页面命名 **MY SEASON**，不用 Favorites、Collection 或 Saved 作为产品主名称。未来顶部为 `2026—27 / HOUSTON / MY SEASON`；一级统计 `14 / 82 GAMES COLLECTED`，其次 `9 W — 5 L / 3 CITIES / 2 TIME ZONES`，然后是 Archived Game Passes。

现有本地归档逻辑可保留，Beta 1 不扩展完整 Archive Analytics 或独立完整收藏页。

## 19 / Archived game

历史 Pass 只保存值得记住的信息：最终比分、FINAL、日期、真实观看城市、当地时间、GAME X / 82、可选 Game Hero、Reference。不复制完整 Box Score。

城市身份与观看地点须随历史记录保留，不能随当前 selector 改写。历史赛季不被新赛季覆盖；用户 PASS ID 连续。归档按 team + season 隔离，唯一 gameId 去重，collectedGames 从归档 ID 派生，不能刷新一次加一。

## 20 / Milestone system

Milestone 是 **Quiet Recognition**，不是传统 Gamification。不用奖杯、烟花、火焰、Achievement Unlocked、Congratulations 或 Level Up。

## 21 / Milestone examples

未来支持 First Game、Game 10 / 41 / 82、First Win、First OT、Buzzer Beater、Rivalry、Play-In、Playoffs、Conference Finals、Finals。通过极小 Typography、Micro Symbol、Border、纸张、Reference、Emboss 或有限色差识别；用户自己发现差异，不弹庆祝屏幕。不为此改变 Pass DNA，Beta 1 暂缓新增 UI。

## 22 / Share DNA

分享应生成独立 **Game Artifact**，不等于完整首页截图。首页用于使用，Artifact 用于保存与传播；两者复用同一份真实 Pass 数据与设计 DNA。

## 23 / Share artifact structure

固定第一眼是比赛／比分或当地时间／Pass；第二眼是球队、城市、品牌；第三眼是编号、赛季与工艺。

赛后结构可为 `MG+ / 2026—27 / HOU / 117 — 112 / LAL / FINAL / WATCHED FROM / KOBE · JP / OCT 25 · 10:30 JST / GAME 04 / 82 / REF. HOU-LAL.004 / COLLECTED`。赛前复用 ISSUED 数据，不显示虚构赛果或观看记录。可有受控 Player Silhouette / Match DNA、大量空白与少量球队色；不带首页导航、未来赛程或大段解释。

## 24 / Share principle

**Curiosity > Advertising。** 用户分享自己的 Pass，不替品牌转发广告。不加入 Download Now、Track Your Team、Best NBA App、Scan QR Code、Try MG+、网址、二维码或强 CTA。

## 25 / Social formats

必须建立两个原生构图：

- **1080 × 1440 / 3:4**：Douyin、Xiaohongshu、Feed。
- **1080 × 1920 / 9:16**：Instagram Story、TikTok、Douyin Video / Story。

两者共享 Design DNA 与真实数据，分别组织留白、品牌、Pass 与城市上下文；不能简单裁切。手机产品宣传截图继续保留真实 App 结构，不能被独立 Artifact 替代。

## 26 / Visual language

Warm White、Soft Gray、Deep warm ink、有限 Team Color；大量 Negative Space，极轻 Shadow，精确 Alignment，Editorial Typography，Ticket / Archive Metadata。普通 UI 平静、扁平、功能性；Game Pass 是唯一情绪与物体核心。默认不以亚克力、玻璃或独立摄影棚构图重做首页。

## 27 / Color rule

约 **90% neutral，球队色 10% 或更少**。球队色优先用于 SportsSignal、LIVE、Opponent Indicator、Stamp、Match DNA 与 Micro Detail；不得用大面积球队渐变控制页面。

颜色只来自 semantic tokens。中性色收束为 Primary / Secondary / Muted / Hairline；warm stone canvas、ivory ticket、deep warm graphite system 保持同一色温家族。Brand Red 表示品牌／关键 active signal，Team Accent 表示球队身份，不能互相冒充。既有 [Color & Material Guide](color-material-tokens.md) 是 token 参考，视觉表现服从本 Bible 的克制原则。

## 28 / Typography

主要字体 **Geist**。时间、比分、Game Number 使用稳定数字排版。角色为 Display / Primary / Secondary / Metadata / Micro Metadata；比例、Weight、Spacing、Opacity、Alignment 先于大量不同字号。

Matchup 形成主要 Typography Moment；时间清晰而不依赖最大最粗。中文承担主要用户信息，英文承担确有意义的系统、档案和编号语义。不重复翻译同一字段，不让所有区域都有 label。Serial 与 Timing 使用 tabular numerals；Script 仅作情绪签注，不能承载核心系统信息。

## 29 / Premium rule

**Premium = Restraint + Precision + Consistency。** 不依靠 Gold、Glassmorphism、大量 Blur、Neon、3D Basketball、复杂 Gradient、强阴影、随机纹理或大面积球队色。如果一个元素只能用「看起来很贵」解释为什么存在，删除它。

## 30 / Motion

动画只服务状态确认：PASS ISSUED、LIVE Transition、FINAL Lock、STAMP Applied、COLLECTED。不得无意义浮动、持续漂移、过度 Spring、粒子或 Confetti。

普通更新约 160–200ms；时间约 160–180ms crossfade；首次签发全程短促。遵守 reduced-motion，禁用 bounce、overshoot、flip、强缩放、glow pulse。系统在确认事实，而不是表演。

## 31 / Pass issued moment

用户确认主队与城市后，经历短暂 `Generating → Reference Assigned → PASS ISSUED → archive-ready`。应像「刚刚为我生成」，不像普通 Loading。

PASS ID 只在首次明确确认时生成并本地持久化。刷新、换城市、换比赛、已有身份后换球队、换赛季均不得重复签发用户身份。状态可以短暂显示技术微文案，但身份编号才是重点，结束后仍为正常首页。

## 32 / Stamp moment

未来比赛结束：`FINAL → Result locks → Stamp appears → COLLECTED`。不使用烟花。未来声音若加入，应接近 Paper、Mechanical Click、Passport Stamp，而非游戏奖励音。该完整仪式属于后续 Passport / Archive 阶段，当前不捏造真实赛果。

## 33 / Home screen

首页三秒内回答 **What’s next?**：下一场是谁、什么时候、在我的城市几点。

顺序为 Brand → Local Context → Next Game → Game Pass → Secondary Schedule → Navigation。完整手机产品骨架保留，不改成单独海报。查看历史 Pass 是有意识的详情行为；当前首页的默认重点不能长期停留在已结束比赛，也不能因此删除历史对象。

## 34 / Information priority

| 层级 | 内容 |
| --- | --- |
| 一级 | Teams、Game Time、Score / State |
| 二级 | City、Date、Game Number |
| 三级 | Reference、Timezone、Metadata |
| 四级 | Decorative DNA |

**Decoration must never outrank information。** 一个页面只有一个视觉英雄：Game Pass。每个语义区域最多三个主要文字层级，去掉边框后仍应依靠空白与对齐成立。

## 35 / Beta product scope

| Beta 1 必须 | 暂缓 |
| --- | --- |
| 30 Teams / Team Selection | 完整 Season Passport |
| 独立 City / IANA Timezone | 30 Team Stamp System |
| WATCHED FROM 的城市身份与真实记录语义 | 新 Milestone UI |
| Next Game | 完整 Archive Analytics |
| Game Pass / Reference System | 82 Game Season Summary 产品页 |
| ISSUED State | 复杂 Live Data |
| Match DNA Prototype | 账号、数据库、社区、排行榜、交易、稀有度 |
| Share Artifact Prototype，两种尺寸 | 无关新闻、Box Score、复杂分享 API |

已有归档、里程碑 resolver、系列验证与 share 基础设施应保持兼容，不等于要在 Beta 1 扩展所有未来页面。当前可使用 localStorage、mock games 与 mock season；模拟数据必须在开发与交付文档中明确，不声称接入真实 NBA API。

## 36 / Beta validation

首先验证用户是否主动问「链接呢？」「在哪里用？」「能选我的球队吗？」「可以换城市吗？」「其他球队也有吗？」「这个票能保存吗？」这些问题说明产品价值被理解。此阶段不以 DAU 或注册量代替价值验证。

## 37 / Development order

| Phase | 顺序与交付 |
| --- | --- |
| 0 | Product & Visual System：本 Bible、语义 token、稳定架构与范围 |
| 1 | City Identity：城市与时区分离、Kobe ≠ Tokyo、IANA 换算 |
| 2 | Game Pass Architecture：主副券、Reference、ISSUED、不可变几何 |
| 3 | Match DNA：少量可解释的比赛／球队／城市差异原型 |
| 4 | Share Artifact：3:4 与 9:16 原生构图，复用真实数据 |
| 5 | Season Passport + Archive：真实观看记录、Stamp、完整 MY SEASON |
| 6 | Milestones + Season Summary：安静认可与赛季完成物件 |

**不能为了新 Idea 跳过核心结构。** 每阶段先验证，再扩大下一阶段；不得把这份长期 Bible 当作一次性实现全部系统的清单。

## 38 / Design review checklist

每次修改后逐项检查。明显失败就继续调整，不通过新增装饰掩盖问题。

1. 是不是更像普通体育 App 了？
2. 球队色是不是太多？
3. 有没有无意义装饰？
4. 信息层级是否三秒可读？
5. Game Pass 是否仍为视觉中心？
6. 城市身份是否存在，并且不只是 GMT？
7. Reference 每段是否有明确意义？
8. 82 张放在一起是否属于同一设计家族？
9. Share 脱离 App 后是否成立，且不虚构数据？
10. 用户会不会想保存它？

同时执行 30% Thumbnail、Greyscale / 低饱和、Squint、Border-Off、Tokyo / London Overlay 与 Team Swap 检查。固定几何必须在不同城市、球队、状态、赛季与三种 Pass 规格中保持；只允许有来源的变量区域不同。

## 39 / North star

MG+ 不只是帮助用户 *Remember the schedule.* 而是 **Remember the season.**

赛季结束后，别人有赛程历史、截图与比分；MG+ 用户拥有自己的 Season Archive。

## 40 / Final brand statement

**MYGAME+**

**YOUR TEAM. YOUR TIME. YOUR SEASON.**

比赛属于联盟，球队属于城市，但你经历这个赛季的方式，只属于你。
