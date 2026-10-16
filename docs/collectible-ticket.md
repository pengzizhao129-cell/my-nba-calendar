# MyGame+ — Phase 2 / From Ticket to Collectible

> 本文件记录本轮视觉实施的约束与验收依据。最高产品规则仍为 [MG+ Product & Visual Bible](product-visual-bible.md)。它不新增账号、观看打卡、全球唯一签发服务或完整收藏页，也不修改既有归档和时区业务。

## 要留下的不是赛程，而是一张自己的比赛票根

首页继续保留真实 Mobile Web App 的品牌、主队与城市交互、Game Pass、未来比赛索引和底部导航。独立 Share Artifact 是另外的输出，不能替代首页截图。

本轮保留连续的 `HOU — LAL`、右侧副券、`GAME 01 / 82`、`SEASON 26–27`、个人签发编号，以及暖白、低彩度的 Editorial 排版。只调整已有结构的比例、字形、留白、对齐与材质。优先顺序为 **删除 → 重新放置 → 缩放 → 调整文字角色**，不以增加装饰换取收藏感。

## Ticket construction

票据必须能够在隐藏 `GAME PASS` 标题后继续成立。主券、撕线、副券分别承担比赛、物理分界、个人存档信息。

- 外轮廓、上下不同曲率的撕口、主副券比例、MG+ Bridge 和全部安全区统一来自 Master Geometry；球队、城市、状态不能另造几何。
- 撕线使用独立微小孔／切口及极低对比的明暗边缘，不使用普通网页 dashed border。
- Bridge 是未被打孔的实体连接，不是放在撕线上的 Logo badge。
- 主券较明亮、柔和；副券仅有轻微偏冷的纸温差。两者仍属于同一张票，不以深边框切成 Card + Sidebar。
- 印刷安全区与字段对齐轴固定。内容长短只能在所属区域内处理，不能推移撕线、时间区或收藏结构。

本轮几何以 `src/lib/passDNA.ts` 为唯一事实来源。它可以进行一次统一升级，但升级后所有城市、球队、状态及 full / compact / collection / share 输出必须复用同一组参数。

### MG-DNA-3 固定图纸

本轮保持 728 × 576 的整体比例与 x582 的主副券连接轴，不因 serial 或城市文字长短改变票宽。

| 区域 | Master units |
| --- | --- |
| 主券 / 副券 | x0 / y0 / w582 / h576；副券 x584 / y0 / w144 / h576 |
| 纵向撕线 | x582 / y16 / w2 / h544；节距 8 |
| 未打孔 Bridge | x576 / y278 / w14 / h28 |
| 横向 Season Spine | x604 / y152 / w104 / h40 |
| Season 字段 | 副券 y210 |
| 用户 PASS ID | 副券 y272，较小印刷层 |
| Personal serial | 副券 y326 / w104；个人 serial 26 单位，Reference 在下方较轻 |
| 上方撕口 | 中心 x582，深 10；沿用浅 V 结构 |
| 下方撕口 | 中心 x582，深 14；沿用更深的弧形收口 |

主时间、主副券比例和整体位置不借本轮继续扩大。收藏进度和里程碑 resolver 保留，但普通票面隐藏进度文案，避免与 GAME / SEASON / serial 重复争夺副券空间。

## 六类文字角色

| 角色 | 工作 | 纪律 |
| --- | --- | --- |
| Match display | `HOU — LAL` | 第一视觉；字宽、字距、baseline 与 Match Line 共同构图，不依靠继续加粗 |
| Date display | `25 OCT / 2026` | 日期数字、月份、年份分工；不降成普通 UI 标签 |
| Local time display | `10:00 / 01:00` | 修长、实心、tabular；定制低对比冒号；与当地城市／GMT 组成完整 timing block |
| City / location | `TOKYO · JP` | 文本坐标，不用地标、国旗、地图或航空语义 |
| Archive metadata | `GAME 01 / 82 / SEASON 26–27` | 数字参与构图；固定轴、固定位置，不包装成 badge |
| Serial / machine type | Personal serial 与 Reference | 序列数字具有独立印刷识别，技术上下文安静退后，不把所有字段都变成相同的 tracking 灰字 |

中文继续承担用户行为、主要操作、球队名称和必要说明。英文只保留城市、票据、档案和签发语义。主状态只设一个强阅读层，避免 `GAME DAY` 与「今天有比赛」以相同重量重复表达。

Match Line 是对阵的分隔与连接结构，不再依赖默认 em dash 字形的偶然宽度。它可以与 Time Route 的细线、刻度共用精度，但不能增加无意义的速度线、徽章或视觉特效。

## Personal serial：增强现有身份，不重新签发身份

上一轮 Bible 实施已经将六位 `ISSUE #475817` 历史示例收束成有语义的 Reference。当前示例用户对应的个人 serial 是五位 `47295`；它不是漏字，也不应为了匹配旧文案重新生成用户身份。

本轮应突出 **现有个人 serial** 的有限印刷编号感，并保留语义 Reference 的上下文：

```text
PERSONAL ISSUE / NO. 47295
REF. HOU-LAL.001
TYO / JP
```

具体票面大小与排布以组件为准，上例不是要求同时加入所有字样。现有 serial 应成为副券中能被仔细阅读发现的数字标记，但不得与 Matchup 或主时间竞争。

编号的职责保持分离：

- `PASS 0147`：用户身份，本地持久化；换城市、球队、比赛、赛季不重新生成。
- 个人 serial：本地稳定 mock issuer 为用户／球队／比赛／赛季确定的单场签发标记；不随城市或状态变化。
- `MG26-HOU-LAL-001-JPTYO-47295`：完整有语义 Reference。城市段随当前 Location 改变，季节、主队、对手、场次与个人 serial 各有来源。

它不是数据库 ID 的直接展示，也不声称全球唯一、官方认证或线下入场资格。未来真实 issuer 可替换生成机制，视觉组件不应直接生成或修改编号。

## Season Spine：82 个独立位置，不是滚动条

右缘贯穿大半张票的竖向刻度退出本轮主呈现。82 个微刻度分成两组横向 index register，紧邻 `01 / 82` 的场次信息，让两者形成同一阅读组。

每个 mark 对应一场常规赛；当前场次只激活一个 mark，不填满此前刻度，不显示百分比，不模拟 scrollbar thumb。十位或分组刻度可以提供节奏，但不能变成第二套进度组件。未知场次不伪造 active 位置。

固定的是 82 个槽位、组件位置和刻度绘制规则。变化的是 `gameNumber` 对应的标记和有来源的状态墨色。COLLECTED 仍保留这一场的赛季位置。

## Time Route：比赛固定，位置与当地时间改变

Time Route 只表达支持对象与当前观赛城市的关系。它不是航线、地图或精确地理距离。

当前 marker 使用固定 UTC offset 标尺，由 **比赛发生时刻** 在所选 IANA timezone 下的 offset 确定；不得根据城市名字任意移点，也不得使用当前浏览器 offset 替代比赛时刻的 offset。它表示时差，不表示城市经纬度或球队与城市之间的地理距离。

固定 route frame、刻度区与标签安全区；只允许 marker、城市、国家和 GMT 信息在组件内部按规则更新。Timing Sanctuary 继续保持纯净，不能穿过防伪纹理、serial、装饰线或反光。

### Tokyo / London 的真实 DST 边界

当前演示比赛时刻为 `2026-10-25T01:00:00Z`。该时刻恰逢英国夏令时结束：

| Location | IANA timezone | 当地比赛时间 | 事件时刻 offset |
| --- | --- | --- | --- |
| Tokyo | Asia/Tokyo | 10:00 | GMT+9 |
| London | Europe/London | 01:00 | GMT |

因此本次不能同时印 `London 01:00 / GMT+1`。`01:00 GMT` 是正确结果，不为保持旧示例而写错时区。London 的规范 ISO country code 为 `GB`；`UK` 可以是展示用简称，但有语义 Reference 的国家段继续使用 `GB`。

Tokyo 与 London 的 PASS ID、个人 serial、比赛、场次、赛季、票据几何和页面比例必须一致。完整 Reference 中的城市／国家段以及 Time Route 的合法坐标信息允许变化。

## 页面外侧退后，票根成为个人对象

主队和所在地采用 Identity Coordinates：先看到支持谁、在哪里看，第二眼才发现可点击修改。保留真实按钮、原生城市选择、键盘焦点和可访问名称，减弱 chevron 的视觉存在，而不是删除交互能力。

赛前 `WATCHING FROM` 表示当前选择的观看上下文；`WATCHED FROM` 只属于显式保存的历史观看记录，不能因为选择城市或自动归档就宣称用户已经观看，也不能随当前 selector 改写旧经历。

MG+ seal 与中文产品名承担 Header 主识别，MyGame+ script 降为 issuer／brand signature，不能与两者平级争主角。未来赛程保持无 Card 的档案索引，日期、对手、主客场和当地时间共享 baseline；轻微信号只指向真正的 NEXT game。底部导航是安静的 floating controller，不是页面的第二个视觉英雄。

## Materiality 通过差异，而不是纹理表演

页面为平静 warm stone；主券为更亮的 ivory stock；副券为略安静的 archival stock。统一左上光源，接触阴影只建立落在页面上的感觉，不使用强 3D、玻璃或厚重描边。

本轮不需要为了「纸」加入可见噪点、复古纹理、做旧、污渍或折痕。微孔边缘、纸温差、印刷安全区和序列字形应先完成物体感。所有 paint 继续使用 semantic tokens，组件内部不随意增加色值。

## 验证与证据边界

以下为本轮检查方法，实际已验证的结果另列于下一节；「想保存」属于体验判断，不能由自动测试冒充用户研究。

1. 相同 viewport、DPR、页面比例、Pass 位置和裁切下导出 Tokyo / London，验证 PNG 为 1080 × 1440 且可完整解码。
2. 主副券、Bridge、撕线、Season Spine、Time Route frame、Timing Sanctuary 在不同球队／状态／城市下保持共同几何。
3. 82 个独立刻度、已知场次仅一个 active；未知场次没有假标记；COLLECTED 不丢失其场次。
4. 城市切换只改变 Location 信息和有数学含义的 route marker；用户 ID、个人 serial、比赛、赛季不变。
5. 检查 London DST 比赛时刻的 offset，不接受固定 GMT+1。
6. 30% 缩略图先看到 Matchup、时间与票据轮廓；个人 serial 属于仔细看才发现的第二／第三层。
7. Label-Off：隐藏 GAME PASS 后仍能读出主券、可撕副券和签发结构。Logo-Off：不依靠 Logo 才能维持秩序。
8. Border-Off：隐藏普通边框和分隔线，排版、纸温差、切口和留白仍成立。
9. 未来赛程 baseline 与底部导航安全区不退化，主队选择、城市选择和历史归档行为仍可操作。
10. 没有增加 Card、Badge、无意义英文、航空符号、条码、随机水印或伪造认证信息。

最终设计审阅要分别回答：第一次看到是否只像工具；遮住标题是否仍像正式凭证；个人编号、比赛、城市与当地时间是否共同形成值得保存的对象。不能只以「更漂亮」代替这三个判断。

## 本轮已验证结果

69 项单元测试全部通过，0 跳过、0 失败；生产构建通过；9 组 App 浏览器检查、3 组首次签发检查通过。四种生命周期状态下实际 SVG 撕线及固定 DNA 的栅格比较差异为 0；13 份系列／分享输出通过检查，其中 82 张系列共用同一 Master Geometry。没有为本轮改动用户身份、归档隔离或比赛结束判定。

两张成品直接截取真实生产 App，均为 **1080 × 1440 PNG**，可完整解码：

| 成品 | 文件字节数 | 当地时间 | 个人 serial |
| --- | ---: | --- | --- |
| `output/douyin/mygame-plus-douyin-01-tokyo.png` | 204,452 | 10:00 / GMT+9 | 47295 |
| `output/douyin/mygame-plus-douyin-02-london.png` | 205,103 | 01:00 / GMT | 47295 |

两张使用同一 viewport 与 scale，Pass 均为 `x88 / y225.15625 / w424 / h335.46875` CSS px。排除有来源的 Location／slogan／时间／route marker 区域后，静态像素差为 **0**。London 视觉简称使用 `UK`，Reference 仍使用 `GB`。

### 15 项视觉自检的分组结论

以下依据完整成品、30% 缩略图、Label/Logo-Off 与 Border-Off 诊断进行专家审阅，不替代用户研究。

| 对应自检 | 审阅结果 |
| --- | --- |
| 1–2 / Card 与可撕副券 | 上下不同撕口、独立微切口、轻微纸温差和副券印刷结构共同建立票据；遮住标题后仍可辨认。撕线刻意低对比，不以深线加重轮廓 |
| 3–4 / Matchup 与文字角色 | HOU — LAL 保持第一视觉；Match Line 为固定 SVG，日期、修长主时间、场次、个人 serial 各有不同构图角色 |
| 5–7 / 个人编号与赛季位置 | 47295 明显强于原先的小号 metadata，仍弱于对阵和时间；01 / 82 与横向 82 mark register 同组，不再像 scrollbar；刻度在 30% 消失属预期 |
| 8–9 / Time Route 与城市切换 | Tokyo +9 与 London 0 的 marker 实际变化，票据及个人 serial 不变；同场、同票、不同当地时间由视觉本身体现 |
| 10–12 / Identity Coordinates、Header、Controller | 先读主队和 WATCHING FROM 城市，再发现可修改；中文品牌主识别、灰色小 signature 次之；底部导航缩窄减重，不成为第二视觉中心 |
| 13–15 / Schedule、克制与独立识别 | 索引维持无 Card 的 baseline 排版；没有增加新图案、badge 或强材质；隐藏 Logo／GAME PASS 后仍保留主副券、季节刻度和时间坐标的秩序 |

**Tool Test**：整页仍是可操作的手机产品，但主角读作比赛凭证而非单纯时间工具。**Ticket Test**：Label-Off 图保留明确的签发票据结构。**Desire Test**：专家审阅认为个人编号与赛事印刷感已更成立；是否会让真实用户愿意保存、生成和分享，仍需实际观察，未宣称通过用户验证。
