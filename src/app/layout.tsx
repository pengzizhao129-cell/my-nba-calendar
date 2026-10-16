import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
const geist = localFont({src:'./fonts/GeistSans.woff2',variable:'--font-geist',display:'block',weight:'100 900'});
const timing = localFont({src:[{path:'../../design/promo/timing-450.woff2',weight:'450'},{path:'../../design/promo/timing-500.woff2',weight:'500'},{path:'../../design/promo/timing-550.woff2',weight:'550'}],variable:'--font-timing',display:'block'});
const identity = localFont({src:'../../design/promo/identity-600.woff2',variable:'--font-identity',display:'block',weight:'600'});
const annotation = localFont({src:'../../design/promo/event-annotation.woff2',variable:'--font-annotation',display:'block',weight:'400'});
export const metadata: Metadata={title:'MG+ 我的主队日历 · Your Team. Your Time. Your Season.',description:'把主队比赛、你的城市与当地时间，留下为属于你的赛季档案。MyGame+ · Personal Basketball Season Archive。'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="zh-CN" className={`${geist.variable} ${timing.variable} ${identity.variable} ${annotation.variable}`}><body>{children}</body></html>}
