import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={title:'我的看球日历 Game+ · NBA 主队赛程',description:'NBA 主队赛程 · 全球时区换算。你的主队，你的时间。'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="zh-CN"><body>{children}</body></html>}
