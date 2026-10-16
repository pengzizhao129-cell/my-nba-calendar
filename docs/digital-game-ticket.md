# MyGame+ — Digital Game Ticket / Visual Constitution

> 历史实施记录：本文件记录 `MG-DNA-2` 的几何、样式与当时验收结果。最高产品／视觉约束已更新为 [MG+ Product & Visual Bible V1.0](product-visual-bible.md)。城市身份、语义 Reference、生命周期名称、Beta 1 范围与开发顺序以 Bible 为准；下文的六位 ISSUE 示例不再定义主要身份系统。固定几何仍可复用，历史验收记录不代表后续版本已重新验证。

> 最新视觉实施见 [Phase 2 — From Ticket to Collectible](collectible-ticket.md)：它在既有票据架构上收束 Match Display、个人 serial、横向 Season Spine、Time Route 与可撕副券；本页继续保留为 MG-DNA-2 的历史记录。

本轮明确重建视觉骨架为 `MG-DNA-2`，取代旧的横向主券／底部副券。原有个人身份、IANA 时区、比赛选择、状态判断、自动归档、赛季数据与首次签发行为不变。首页仍是真实 Next.js 页面，宣传图直接截取该页面。

## 产品与构图

线上观赛同样值得留下比赛凭证。页面是安静的展示空间，Game Pass 是唯一具有纸面与收藏属性的对象。

主券先回答「哪场比赛」，再回答「我在哪里、几点看」。右侧副券回答「这是属于我的哪一张」。不使用航空图标、GATE、SEAT、FLIGHT、条码、评分、稀有度或假认证字段。

固定阅读顺序：**HOU — LAL → 日期／赛季场次 → 当地时间 → 城市／场馆 → 身份与签发编号。**

## Master drawing

所有 full / compact / collection / share 规格共同使用 `src/lib/passDNA.ts`，团队、城市和生命周期不能另行排版。

| 区域 | 728 × 576 坐标 |
| --- | --- |
| 主券 | x0 / y0 / w582 / h576 |
| 右侧副券 | x584 / y0 / w144 / h576 |
| 纵向撕线 | x582 / y16 / w2 / h544；3 单位孔，8 单位节距 |
| MG+ 实体 Bridge | x576 / y278 / w14 / h28 |
| Season Spine | x704 / y80 / w12 / h410 |
| Matchup | x40 / y156 / w504 / h144 |
| Timing Sanctuary | x40 / y368 / w504 / h112 |

轮廓使用 4 单位小圆角、右上削角，撕线顶端为浅 V、底端为更深的弧形收口。切口和纵向撕线连接主副券，不再以左右两个半圆作为票据的唯一依据。Bridge 是未打孔的实体段，细看才发现「+」。主副券仅以极轻纸温差区分，不用边框包住每个字段。

## 只发展两个可解释的图案

1. **Time Route**：主队代码 → 极细坐标线／刻度 → 用户城市与国家。它表达支持对象与观赛所在地的关系，不是地理航线。目的城市预留固定宽度，Tokyo / London 不改变整条坐标区的结构。
2. **Season Spine**：82 条独立刻度，每条代表一场常规赛。当前 gameNumber 只标记一个位置，不填充过去刻度，不使用进度条。未知场次不伪造位置。归档后当前刻度收回中性色。

旧的重复球队水印不再绘制。Team Identity Pack 和历史 security-stock 数据接口仍保留，未改变球队或归档业务数据；它们不再成为这版票面的装饰背景。

## 六类文字角色

| 角色 | 规则 |
| --- | --- |
| Display | 中文品牌承担识别；MyGame+ 花体是较小的 signature |
| Matchup | 定制 Identity 600，100 单位；连续 `HOU — LAL`，无小卡片 |
| Time | 新 Timing 450，76 单位；修长实心数字，定制低对比冒号 |
| Editorial body | 中文球队名、场馆、赛程；450–500，靠留白与 baseline 分组 |
| Metadata | 日期、城市坐标、主客场、赛季；固定位置，不套 badge |
| Serial / Machine | PASS ID、ISSUE、收藏记录；tabular 数字、固定字距、小字号 |

时间比上一版更小、更轻，不以最大最粗取得主导。日期包含完整年份；比赛编号来自 Game 数据层。英文仅用于既有技术语义；中文承担主要用户信息。

中性色角色只有 Primary / Secondary / Muted / Hairline。`--text-micro` 与 tertiary 统一到同一个 Muted，不引入第四种近似灰文字。所有颜色与阴影仍来自 `color-material.css`；球队色只进入身份字标与极少信号。普通页面无立体材质，票面不用玻璃，当前首页不使用亚克力外壳。

## 身份与签发编号

`PASS 0147` 仍是浏览器持久化的用户身份。

`ISSUE #475817` 是示例用户在当前主队／比赛／赛季下的稳定六位本地 edition number，由 `ticketIssueNumber()` 生成。城市与状态不参与计算，因此切换 Tokyo / London 或进入 COLLECTED 不重新签发。更换用户或比赛得到不同 edition。它是 smoke-test 阶段的确定性编号，不承诺全局唯一或认证能力，未来可由真实 issuer 替换。

PASS / GAME / SEASON / ISSUE 只在副券。主券保留日期、比赛、时间、地点。首次签发仍为 800ms；第二阶段改为坐标线轻显，避免依赖已取消的水印。减少动态效果的用户直接获得完整文字。

## 生命周期与观看记录

原有 UPCOMING → NEXT UP → GAME DAY → COLLECTED 及归档键隔离规则继续执行。赛前副券为 ISSUED；结束后为 COLLECTED。比赛结束以真实 final/endTime 或显式 mock estimate 判断，不能在开赛时归档。

`GamePass` 可接收未来的 `commemoration`，仅在 archived 状态呈现明确传入的比分及 `WATCHED FROM …`，使用已预留的 result / watched-from 位置。当前不根据所选城市自动宣称用户看过比赛，不伪造比分，不添加打卡流程或新的账号系统。未提供记录时该位置保持空白。

## 首页系统语言

品牌区只保留版次／Beta、固定 Brand Lockup、简短产品说明和 slogan。主队与城市成为左右两个坐标，保留真实选择和设备时区识别。重复的辅助英文、AUTO CONVERTED 与解释性底部提示不再逐项显示；自动换算以票面城市／当地时间和真实操作体现。

NEXT 7 DAYS 改为「未来比赛索引」：日期、对手、HOME/AWAY、当地时间共享固定 baseline，无卡片和分隔线。首页预览两场，数量显示全部本周比赛；「全部」进入已有完整赛程，不丢失其余比赛。

Bottom Controller 宽度最多 264px、高 40px；暖石墨采用 90 级，active 底色 3.5%。只保留图标与中文导航，英文从视觉中移除。它不是页面的黑色地基。

## 不可变的设计纪律

- 一个页面只有一个视觉英雄：Game Pass。
- 不为高级感增加无意义英文、Card、badge、pill 或独立装饰图案。
- 不用大渐变、强玻璃、大面积球队色或强阴影建立层级。
- 一个语义组最多三个主要文字层级；空白、比例与 baseline 先于边框。
- 数字参与构图，功能信息与收藏信息共存。
- 即使隐藏品牌和 GAME PASS 标题，纵向存档副券、Time Route 与 82 刻度仍应保持票据识别。
- 所有状态共享架构；只有有语义的内容、字色与有限纸面光差改变。

## 验证与导出

```bash
npm test
npm run build
npm run start -- --port 4901
MYGAME_APP_URL=http://127.0.0.1:4901 node design/promo/check-app.cjs
MYGAME_APP_URL=http://127.0.0.1:4901 node design/validation/check-personal-season.cjs
MYGAME_APP_URL=http://127.0.0.1:4901 npm run export:promo
npm run export:season
```

不设置 MYGAME_APP_URL 时，`export:promo` 自动启动已构建的生产 App。它以 600×800 CSS viewport / 1.8 DPR 截取真正的 1080×1440 PNG，拒绝带开发控件的页面。`promo.html` 仅是历史源文件，已不参与当前导出。

构建前先停止同一仓库的开发进程；`next dev` 与 `next build` 不应同时写入 `.next`。依赖和生成素材不变，不需要新增环境变量。

导出检查完整解码、字号主次、两行索引可见、导航安全区、82 个刻度、固定编号、Tokyo/London 几何和静态像素。另生成 30% 缩略图、Border-Off、Logo／GAME PASS Label-Off 诊断到 `/tmp/mygame-ticket-*`。功能回归继续覆盖 IANA 跨日期、下一场排序、结束后持久化、去重、球队与赛季隔离；82 张 mock 仍只用于系列验证。

## 本轮验收记录

43 项单元测试、8 组 App 浏览器回归、3 组签发回归与干净生产构建通过。82 张系列、三种规格与七种分享样例通过归一化几何检查。两张手机 PNG 都为 1080×1440，可完整解码；静态区域像素差为 0，末行索引距导航 38.375 CSS px。日期、对手、HOME/AWAY 与当地时间另通过原生 baseline 探针验证，误差小于 1 CSS px。

| 验收 | 结果与依据 |
| --- | --- |
| 1. Card → Ticket | 主副券贯穿整高，纵向撕线和不对称撕口形成实体结构 |
| 2. 隐去 GAME PASS | Label-Off 实图仍保留票据形状和存档副券 |
| 3. 对阵先于时间 | Matchup 100 单位、Time 76 单位；30% 图仍先读 HOU — LAL |
| 4. 无航空复制 | 无飞机、Gate、Seat、Flight、条码或航空操作语义 |
| 5. 原创 DNA | Time Route 与 82 场刻度均有明确产品含义 |
| 6. 城市切换剧情 | 同场／同编号；Tokyo 10:00，London 01:00；非 Location 区域完全重合 |
| 7. 01 / 82 系统化 | 82 条独立刻度，恰好一个 current；未知场次不标记 |
| 8. 序列编号 | 六位 ISSUE 绑定用户／球队／比赛／赛季，城市与状态不改变它 |
| 9. 页面更静 | 顶部压缩辅助说明，移除重复水印，仅票面保留物体层次 |
| 10. Schedule 同源 | 字体、数字、列轴与票券一致；无分隔框；完整赛程可进入 |
| 11. Nav 减重 | 最大宽 264px、高 40px，English 不再显示，active 背景降至 3.5% |
| 12. Logo-Off | 隐藏 MG+ seal／signature 后，副券、坐标线和刻度仍有完整秩序 |
