import FetchData from "./FetchData";

export default async function getGenres(api: string) {
  const genres = await FetchData(api, false);
  return genres;
}
