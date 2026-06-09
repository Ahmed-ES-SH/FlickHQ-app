import React from "react";
import CloseTrailer from "../../_client/movies/CloseTrailer";
import TrailerDiv from "../../_client/movies/TrailerDiv";
import NotFoundTrailer from "./NotFoundTrailer";

interface TrailerProps {
  trailer: {
    id: string;
    iso_639_1: string;
    iso_3166_1: string;
    key: string;
    name: string;
    official: boolean;
    published_at: string;
    site: string;
    size: number;
    type: string;
  };
}

export default function MediaTrailer({ trailer }: TrailerProps) {
  if (!trailer) {
    return (
      <TrailerDiv>
        <NotFoundTrailer />
      </TrailerDiv>
    );
  }
  if (trailer.site !== "YouTube") {
    return <p>Unsupported video site: {trailer.site}</p>;
  }

  const videoUrl = `https://www.youtube.com/embed/${trailer.key}`;
  const publishDate = new Date(trailer.published_at).toLocaleDateString();

  return (
    <TrailerDiv>
      <div className="xl:w-1/2 lg:w-[80%] w-[98%] max-lg:h-1/2 lg:h-3/4  xl:h-fit  relative mx-auto p-4 bg-gray-900 rounded-xl shadow-lg text-white flex flex-col">
        <CloseTrailer />
        <h2 className="text-xl font-bold mb-2">{trailer.name}</h2>
        <p className="text-sm text-gray-400 mb-4">
          {trailer.type} • {trailer.official ? "Official" : "Unofficial"} •{" "}
          {trailer.iso_3166_1} • {publishDate} • {trailer.size}p
        </p>
        <div className="aspect-video w-full h-[80%] mt-auto">
          <iframe
            className="w-full h-full rounded-md"
            src={videoUrl}
            title={trailer.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </TrailerDiv>
  );
}
