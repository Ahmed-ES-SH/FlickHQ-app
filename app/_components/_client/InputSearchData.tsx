"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { instance } from "../_globalComponents/AxiosTool";
import { ShowType } from "@/app/types/websiteTypes";
import { AnimatePresence, motion } from "framer-motion";
import { formatTitle } from "@/app/_helpers/helpers";
import { useRouter } from "next/navigation";
import Img from "../_globalComponents/Img";

export default function InputSearchData() {
  const router = useRouter();
  const [searchData, setSearchData] = useState<ShowType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchContent, setSearchContent] = useState("");

  useEffect(() => {
    const fetchSearchData = async () => {
      if (!searchContent.trim()) return;
      try {
        setLoading(true);
        const moviesResponse = await instance.get(
          `/search/movie?query=${searchContent}&include_adult=false&language=en-US&page=1`,
        );
        const showsResponse = await instance.get(
          `/search/tv?query=${searchContent}&include_adult=false&language=en-US&page=1`,
        );
        const movies = moviesResponse.data?.results || [];
        const shows = showsResponse.data?.results || [];
        setSearchData([...movies, ...shows]);
      } catch (error: unknown) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    const timeout = setTimeout(() => {
      fetchSearchData();
    }, 500);

    if (searchContent.length === 0) {
      setSearchData([]);
    }

    return () => clearTimeout(timeout);
  }, [searchContent]);

  const handleGo = (media: ShowType) => {
    router.push(
      `/${media.name ? "shows" : "movies"}/${formatTitle(
        media.title || media.name,
      )}?currentId=${media.id}`,
    );
    setSearchContent("");
    setSearchData([]);
  };

  return (
    <div className="relative w-full">
      <input
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearchContent(e.target.value)
        }
        value={searchContent || ""}
        type="text"
        className="bg-[#141414] border border-white/10 rounded-md py-2 w-full 2xl:w-[320px] placeholder:text-gray-500 placeholder:text-sm outline-none px-4 text-white focus:border-white/20 transition-colors text-sm"
        placeholder="Search movies & shows..."
      />
      <AnimatePresence>
        {searchData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="xl:w-[500px] max-md:w-full w-[400px] max-h-[70vh] flex flex-col gap-1 overflow-y-auto rounded-md bg-[#0b0b0b] border border-white/5 p-2 absolute top-12 right-0 z-[100]"
          >
            {loading ? (
              <div className="w-full h-24 flex justify-center items-center">
                <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              searchData.map((media, index) => (
                <motion.div
                  key={`${media.id}-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, delay: Math.min(index * 0.03, 0.3) }}
                >
                  <button
                    onClick={() => handleGo(media)}
                    className="flex items-center justify-between w-full p-2.5 rounded-md hover:bg-white/5 transition-colors cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 rounded overflow-hidden flex-shrink-0 bg-[#141414]">
                        <Img
                          src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                          alt={media.title || media.name || ""}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h2 className="text-white text-sm font-medium group-hover:text-accent transition-colors line-clamp-1">
                          {media.title || media.name}
                        </h2>
                        <span className="text-gray-500 text-xs">
                          {media.release_date ||
                            media.first_air_date ||
                            "Coming Soon"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {Number(media.vote_average || 0).toFixed(1)}
                    </div>
                  </button>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
