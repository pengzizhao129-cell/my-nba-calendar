export const timezones = [
['Asia/Tokyo','东京','日本'],['Asia/Shanghai','北京 / 上海','中国'],['Asia/Seoul','首尔','韩国'],['Asia/Singapore','新加坡','新加坡'],['Europe/London','伦敦','英国'],['Europe/Paris','巴黎','法国'],['Europe/Berlin','柏林','德国'],['America/New_York','纽约','美国'],['America/Toronto','多伦多','加拿大'],['America/Los_Angeles','洛杉矶','美国'],['America/Vancouver','温哥华','加拿大'],['Australia/Sydney','悉尼','澳大利亚'],['Australia/Melbourne','墨尔本','澳大利亚'],['Australia/Brisbane','布里斯班','澳大利亚'],['Pacific/Auckland','奥克兰','新西兰']
].map(([id,city,country])=>({id,city,country}));
export function dateKey(date: Date, timeZone: string) {
 const parts = new Intl.DateTimeFormat('en-US',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
 const part = (type: string)=>parts.find(p=>p.type===type)!.value;
 return `${part('year')}-${part('month')}-${part('day')}`;
}
export function formatDate(date: Date,timeZone: string,options: Intl.DateTimeFormatOptions) { return new Intl.DateTimeFormat('zh-CN',{...options,timeZone}).format(date); }
export function dayDistance(from: string,to: string) { return Math.round((Date.parse(`${to}T00:00:00Z`)-Date.parse(`${from}T00:00:00Z`))/86400000); }
export function detectTimezone() { return Intl.DateTimeFormat().resolvedOptions().timeZone; }
