import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={title:'我的看球日历 · NBA 主队赛程',description:'你的主队，你的时区。面向中文 NBA 球迷的赛程日历原型。'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="zh-CN"><body>{children}</body></html>}
