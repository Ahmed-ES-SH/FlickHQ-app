// //////////////////////////////////////////////////////////////////////////////
// Show hero — full-width backdrop image with gradient overlays ////////////////
// //////////////////////////////////////////////////////////////////////////////

import Img from "@/app/_components/_globalComponents/Img";

interface Props {
  backdropPath: string;
}

export default function ShowHero({ backdropPath }: Props) {
  return (
    <div className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
      <Img
        src={`https://image.tmdb.org/t/p/original${backdropPath}`}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
    </div>
  );
}
