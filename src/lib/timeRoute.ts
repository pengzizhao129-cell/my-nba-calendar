/**
 * MyGame+ Time Route is a world-time coordinate, never a map or a travel path.
 * Its authored domain covers the inhabited civil-time range UTC−12..UTC+14.
 * A city's marker uses its actual offset at the event instant, including DST
 * and half/quarter-hour zones. Cities sharing an offset share a coordinate;
 * their independent city identities remain in the printed destination label.
 */
export const TIME_ROUTE_DOMAIN=Object.freeze({minMinutes:-12*60,maxMinutes:14*60});

export function utcOffsetMinutes(offset:string):number {
 const match=/^(?:GMT|UTC)(?:([+−-])(\d{1,2})(?::(\d{2}))?)?$/.exec(offset.trim());
 if(!match)throw new RangeError(`Invalid printed UTC offset: ${offset}`);
 const hours=Number(match[2]??0),minutes=Number(match[3]??0);
 const value=(hours*60+minutes)*(match[1]==='-'||match[1]==='−'?-1:1);
 if(minutes>=60||value<TIME_ROUTE_DOMAIN.minMinutes||value>TIME_ROUTE_DOMAIN.maxMinutes)throw new RangeError(`UTC offset outside Time Route domain: ${offset}`);
 return value;
}

/** Unit-interval coordinate. No rounding to whole hours and no fake geography. */
export function timeRoutePosition(offset:string):number {
 const {minMinutes,maxMinutes}=TIME_ROUTE_DOMAIN;
 return (utcOffsetMinutes(offset)-minMinutes)/(maxMinutes-minMinutes);
}
