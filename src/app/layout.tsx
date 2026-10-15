import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
const geist = localFont({src:'./fonts/GeistSans.woff2',variable:'--font-geist',display:'swap',weight:'100 900'});
export const metadata: Metadata={title:'我的主队日历 MyGame+ · NBA 主队赛程',description:'NBA 主队赛程 · 全球时区换算。你的主队，你的时间。'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="zh-CN" className={geist.variable}><body>{children}</body></html>}
