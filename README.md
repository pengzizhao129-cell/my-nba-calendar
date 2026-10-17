# 我的主队日历 MyGame+

**MG+ / 我的主队日历 = Personal Basketball Season Archive。** 面向中文 NBA 球迷的移动端网页原型，以 `GAME × TEAM × LOCATION` 生成个人比赛凭证，逐步记录「那一天，我在哪里看我的球队」。

Next.js 15、TypeScript、Tailwind CSS 4；无外部 NBA API、无官方球队 Logo、无账号或数据库。所有赛程、演示状态与验证赛果均为 mock，不代表官方安排，也不能证明用户已经观看。

## 最高产品与视觉规范

[MG+ Product & Visual Bible V1.0 · 2026](docs/product-visual-bible.md) 是最高约束。当前按 Phase 0–4 推进 Beta 1：产品规范 → 独立城市身份 → Game Pass / Reference → Match DNA 原型 → 双尺寸 Share Artifact 原型。

Beta 1 保留 30 队选择、城市／IANA 时区、本地时间、下一场、ISSUED Pass 与有语义的 Reference。完整 Season Passport、30 队 Stamp、Archive Analytics、新 Milestone UI、82 场赛季总结与复杂 Live 数据留待后续阶段。已有归档与里程碑基础设施继续兼容，不代表这些未来产品已完整交付。

## 本地开发

需要 Node.js 20.9+（当前环境使用 Node.js 24）。

```bash
npm ci
npm run dev
```

```bash
npm test
npm run build
npm start
```

默认主队为休斯顿火箭，演示城市为东京，固定演示日期为 2026-10-25。可在「我的」切换真实日期；此操作只改变本地时钟，不接入真实 NBA 数据。未来 7 天指所选 IANA 时区的今天及之后六个日历日。

城市不是时区别名：Kobe 与 Tokyo 同属 Asia/Tokyo，但拥有不同的城市身份和 Reference。设备图标只识别浏览器 IANA 时区，不请求地理位置，也不能据此确定用户身处哪座城市。所选城市不是历史观赛证明；只有明确的经历记录才能标为 `WATCHED FROM`。

- `src/data/teams.ts`：30 支球队
- `src/data/mockGames.ts`：UTC ISO 模拟比赛与演示时钟
- `src/lib/timezone.ts`：IANA 时区与 Intl 格式化
- `src/lib/schedule.ts`：按当地日期筛选、统计和下一场计算
- `src/components/CalendarApp.tsx`：交互界面

无需环境变量、密钥或数据库。首次确认主队后签发并持久化四位 PASS ID；该用户身份不随主队、城市、比赛或赛季切换而变化。比赛 Reference 与用户 PASS ID 分开，不能用装饰随机数代替有意义的比赛／城市／赛季信息。

## Game Pass 与 Share Artifact

首页保持真实 Mobile Web App：品牌、本地上下文、下一场 Pass、未来比赛索引与安静的 Bottom Controller。Game Pass 是唯一视觉英雄。连续的 HOU — LAL、24 小时时间仪器与 82 场 Season Spine 具有产品含义，不用航空图标、条码或随机水印建立票据感。

固定结构及历史实施记录见 [Digital Game Ticket](docs/digital-game-ticket.md)。其中旧的六位 ISSUE 描述已被 Bible 的语义 Reference 规范取代；其历史测试数量不能视为当前版本测试结果。

当前正式方向见 [Phase 4 — Atmosphere & Refinement](docs/phase4-atmosphere.md)：C 的实体可拆票根结构与 B 的 24 小时时间仪器融合为一个 `precision` 票面。728×576 固定主版、520/208 主副券比例、上下切口、Bridge、机械六位编号与底缘 82 个独立场次刻度保持稳定。单一球队印刷脊、暖石色环境、ivory 主券与轻微异色档案副券区分材质；浅色控制器保持功能与触控尺寸。编号继续沿用既有身份，城市切换仅改变当地时间坐标，不重新签发。

[Phase 5 — Spatial Atmosphere System](docs/spatial-atmosphere.md) 在这套固定几何上建立正式物理规则：Ivory 负责纸张／记忆，Carbon Ink 负责时间仪器，Signal 负责状态，Team 负责身份。下半部横向 Ink 印刷区不新增控件边界；同一刻度在纸面与 Ink 上切换对比。Canvas、纸券、副券和仪器共享左上柔光，以独立 contact／ambient／局部 occlusion tokens 表达距离；导航与赛程保持 flat。`src/styles/spatial-atmosphere-tokens.css` 集中物理参数，`spatial-pass.css` 执行材质响应；不会因城市或球队改变光源与骨架。

[Phase 2](docs/collectible-ticket.md) 与 [Phase 3 — Art Direction Review](docs/art-direction-review.md) 保留历史设计与测试记录。旧 Editorial / Instrument / Collectible 构图仍可在开发评审入口 `/review/art-direction` 对比，不出现在正式首页。`GamePass` 的这些 variant 共享真实 `PersonalPass` 数据，六位 `047295` 是现有 serial 的补零印刷格式。

`output/art-direction/` 与 `output/douyin/` 保留旧轮次成品。Phase 3 的历史导出脚本还包含旧首页冻结断言，不用于验证已升级的 Phase 4 首页。

生产构建后，`npm run export:promo`（同 `npm run export:phase5`）直接截取生产 App，导出 1080×1440 东京／伦敦完整手机宣传图、票面裁切、四队系列和去阴影／去球队色／去 Signal 诊断图到 `output/phase5/`。可通过 `MYGAME_APP_URL` 指定已运行的服务；未指定时脚本启动本地生产服务。没有独立宣传 HTML 模板。Phase 4 成品仍保留为几何基线。Share Artifact 与首页截图用途不同：复用真实 Pass 数据，原生适配 1080×1440 与 1080×1920，不包含导航、未来赛程、二维码或广告 CTA，也不虚构比分与观看记录。

## V2.9 Personal Season Collection

历史规则、组件接口、测试和导出见 [Personal Season Collection](docs/personal-season-collection.md)，产品优先级以 Bible 为准。现有比赛结束判断与本地归档保持：完成依据 final/endTime 或明确 mock estimate，不能开赛即归档；按球队／赛季隔离的唯一 gameId 派生收藏进度。首次签发仅一次。`GamePass` 提供 full / compact / collection 规格；内部 resolver 与系列验证为未来 MY SEASON 复用，不新增完整收藏页。

`npm run export:season` 导出独立分享样例及 82 张系列验证图。82 场 mock 仅用于验证同一 Master Geometry 的系列节奏，不替换首页演示赛程，也不代表已经观看或完成真实赛季。

## V2.7 Quiet Motion · Homepage Brand Final

首页使用「我的主队日历 MyGame+」完整品牌、副标题「NBA 主队赛程 · 本地时间」与 MG+ 票券微型签名。品牌与状态规则见 `docs/brand-system.md`。

正常页面隐藏模拟数据、演示日期和非官方赛程说明，赛程仍使用上述 mock 数据。开发时可通过 `NEXT_PUBLIC_DEBUG_UI=true npm run dev` 显示调试说明；生产构建如需显示，请在 `npm run build` 前设置该变量。它仅影响说明文字，不影响日期或赛程。
