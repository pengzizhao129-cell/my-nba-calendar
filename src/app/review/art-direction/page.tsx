import {ArtDirectionReview} from '@/components/art-directions/ArtDirectionReview';
import {ART_DIRECTIONS,type ArtDirection} from '@/components/art-directions/ArtPassPrimitives';

export default async function Page({searchParams}:{searchParams:Promise<{variant?:string;capture?:string}>}){
 const query=await searchParams;
 const direction=ART_DIRECTIONS.includes(query.variant as ArtDirection)?query.variant as ArtDirection:undefined;
 return <ArtDirectionReview initialDirection={direction} capture={query.capture==='1'}/>;
}
