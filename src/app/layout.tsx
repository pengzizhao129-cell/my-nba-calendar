import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
const geist = localFont({src:'./fonts/GeistSans.woff2',variable:'--font-geist',display:'block',weight:'100 900'});
const timing = localFont({src:[{path:'../../design/promo/timing-500.woff2',weight:'500'},{path:'../../design/promo/timing-550.woff2',weight:'550'}],variable:'--font-timing',display:'block'});
const annotation = localFont({src:'../../design/promo/event-annotation.woff2',variable:'--font-annotation',display:'block',weight:'400'});
export const metadata: Metadata={title:'我的主队日历 MyGame+ · NBA 主队赛程',description:'NBA 主队赛程 · 本地时间。你的主队，你的时间。'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="zh-CN" className={`${geist.variable} ${timing.variable} ${annotation.variable}`}><body>{children}</body></html>}
