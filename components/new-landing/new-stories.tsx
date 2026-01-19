"use client";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getPublicComics } from "@/actions/comic.actions";
import { PreviewComic } from "@/lib/types";
import Image from "next/image";
import { BookOpen, Eye, Heart, Loader2 } from "lucide-react";

const NewStories = () => {
  const { data: comicData, isLoading } = useQuery({
    queryKey: ["preview-comics"],
    queryFn: async () => await getPublicComics(),
    placeholderData: keepPreviousData,
    refetchInterval: 5 * 60 * 1000,
  });

  const comics: PreviewComic[] = comicData?.data?.data || [];

  return (
    <>
      <section className="text-white font-montserrat max-w-[1440px] mx-auto px-4 py-16 space-y-4 sm:px-6 lg:px-8 max-md:my-10">
        <div className="flex flex-col items-center w-full">
          <h2 className="text-[#08FA37] text-[40px] max-md:text-2xl font-archivo uppercase">
            Find New Stories
          </h2>
          <p className="text-center max-w-[399px] max-md:text-sm">
            Read tales inspired by tradition, modern life, and bold futures. All
            crafted by African creators
          </p>
        </div>

        <section>
          <div>
            {isLoading && (
              <p className="flex flex-col items-center">
                <Loader2 className="animate-spin" />
                Loading comics
              </p>
            )}
          </div>

          <div>
            {comics.length === 0 && !isLoading && (
              <p className="text-center font-bold mb-5">
                No comics available at the moment.
              </p>
            )}
          </div>

          <div>
            {comics.length > 0 && (
              <div className="flex gap-6 w-full flex-nowrap snap-x snap-mandatory overflow-x-auto py-5 nw-scroll">
                {comics.slice(0, 10).map((comic) => (
                  <div
                    key={comic.id}
                    className="h-[412px] w-[240px] min-w-[240px] flex-shrink-0 flex flex-col justify-between rounded-[15px] overflow-hidden bg-[#212121] snap-start"
                  >
                    <figure className="relative group h-[308px] w-full overflow-hidden">
                      <Image
                        src={comic.image}
                        width={240}
                        height={314}
                        alt={`${comic.title} cover`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 group-hover:border group-hover:border-nerd-muted transition-opacity duration-300 p-4 flex flex-col gap-3 text-white">
                        <p className="font-semibold text-xl">{comic.title}</p>
                        <div className="mt-auto grid grid-cols-2 gap-2 text-am text-gray-400 font-medium">
                          <span className="flex items-center gap-1.5">
                            <BookOpen size={14} className="text-[#08FA37]" />
                            {comic.noOfChapters} Chap(s)
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Eye size={14} className="text-[#08FA37]" />
                            {comic.noOfViews?.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Heart size={14} className="text-[#08FA37]" />
                            {comic.noOfLikes?.toLocaleString()}
                          </span>
                        </div>
                        <p className="line-clamp-6 text-sm text-gray-200">
                          {comic.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {comic.genre?.slice(0, 3).map((g) => (
                            <span
                              key={g}
                              className="text-[10px] bg-white/10 border border-white/20 px-2 py-0.5 rounded-full capitalize"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    </figure>
                    <div>
                      <div className="py-2 px-4">
                        <p className="text-[20px] font-bold">{comic.title}</p>
                        <p>Trailer</p>
                      </div>
                      <Button
                        className="w-full bg-[#009BCB99] rounded-none"
                        asChild
                      >
                        <Link href={`/r/comics/${comic.slug}`}>
                          Start Reading
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="flex justify-center">
          <Button
            asChild
            className="uppercase max-w-[361px] bg-[#08FA37] hover:bg-[#08FA37]/50 font-montserrat font-bold text-black"
          >
            <Link href={"/r/comics"}>See all new releases</Link>
          </Button>
        </div>
      </section>
      <style jsx>{`
        .nw-scroll::-webkit-scrollbar {
          height: 5px;
        }
        .nw-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
        }
        .nw-scroll::-webkit-scrollbar-thumb {
          background: #08fa37;
          border-radius: 9999px;
        }
        .nw-scroll {
          scrollbar-width: thin;
          scrollbar-color: #08fa37 rgba(255, 255, 255, 0.03);
        }
      `}</style>
    </>
  );
};

export default NewStories;
