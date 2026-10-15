# 我的主队日历 MyGame+

面向中文 NBA 球迷与海外留学生的移动端网页原型。Next.js 15、TypeScript、Tailwind CSS 4；无外部 API、无官方球队 Logo。

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

默认主队为休斯顿火箭，演示时区为东京，固定演示日期为 2026-10-25。可在「我的」切换真实日期。所有赛程均为模拟数据，不代表官方安排。未来 7 天指所选时区的今天及之后六个日历日。城市可手动选择，也可点击定位图标识别设备时区（不请求地理位置）。

- `src/data/teams.ts`：30 支球队
- `src/data/mockGames.ts`：UTC ISO 模拟比赛与演示时钟
- `src/lib/timezone.ts`：IANA 时区与 Intl 格式化
- `src/lib/schedule.ts`：按当地日期筛选、统计和下一场计算
- `src/components/CalendarApp.tsx`：交互界面

无需环境变量、密钥或数据库。球队与时区选择保留在当前页面会话内。

## V2.6 品牌呈现

首页使用「我的主队日历 MyGame+」完整品牌与 MG+ 票券微型签名。品牌与状态规则见 `docs/brand-system.md`。

正常页面隐藏模拟数据、演示日期和非官方赛程说明，赛程仍使用上述 mock 数据。开发时可通过 `NEXT_PUBLIC_DEBUG_UI=true npm run dev` 显示调试说明；生产构建如需显示，请在 `npm run build` 前设置该变量。它仅影响说明文字，不影响日期或赛程。
