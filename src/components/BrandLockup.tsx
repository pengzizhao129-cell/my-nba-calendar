/** One fixed seal / Chinese name / signature relationship, shared by App and promo. */
export function BrandLockup(){
 return <div className="brand-lockup">
  <BrandSeal/>
  <h1 className="brand-name">我的主队日历</h1>
  <span className="brand-signature wordmark" role="img" aria-label="MyGame+"/>
 </div>;
}

export function BrandSeal(){
 return <span className="app-mark" role="img" aria-label="MG+ App Mark"><svg className="mark-glyph" viewBox="0 0 56 56" aria-hidden="true">
   <path className="mark-m" data-letter="M" d="M10 25.5V11Q10 10 11 10H13.4L19.4 19.4 25.4 10H28.8V25.5H25.2V16.5L19.4 24.7 13.6 16.5V25.5Z"/>
   <g className="mark-g" data-letter="G+"><path d="M40.5 33.7 38 36.1C36.9 34.7 35.6 34 33.7 34H32.3C30.1 34 28.8 35.3 28.8 37.7V40.4C28.8 42.8 30.1 44.1 32.3 44.1H34.1C35.2 44.1 36.2 43.7 36.8 43V40.9H33.1V37.8H40.2V44.4C38.8 46.3 36.8 47.3 34.1 47.3H32.3C28 47.3 25.3 44.6 25.3 40.4V37.7C25.3 33.5 28 30.8 32.3 30.8H33.7C36.6 30.8 38.9 31.7 40.5 33.7Z"/><path className="mark-plus" d="M45 34.5H47.6V37.3H50.4V39.9H47.6V42.7H45V39.9H42.2V37.3H45Z"/></g>
  </svg></span>;
}
