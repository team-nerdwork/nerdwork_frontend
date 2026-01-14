"use client";

import { getSharedComicPreview } from "@/actions/comic.actions";
import { Button } from "@/components/ui/button";
import ShareButton from "@/components/share-button";
import { PreviewComic } from "@/lib/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Navbar from "@/components/homepage/Navbar";
import { useRouter } from "next/navigation";

export default function PreviewComicClient({ slug }: { slug: string }) {
  const { data: response, isLoading } = useQuery({
    queryKey: ["preview-comic", slug],
    queryFn: async () => await getSharedComicPreview(slug),
    placeholderData: keepPreviousData,
    refetchInterval: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  const comicData = response?.data?.data || response?.data;

  if (!response?.success || !comicData) {
    const router = useRouter();
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Comic Not Found</h1>
            <p className="text-gray-400">
              The comic you are looking for does not exist.
            </p>

            <div>
              <div className="mt-4 flex items-center justify-center gap-3">
                <Button
                  onClick={() => router.refresh()}
                  className="bg-white text-black font-semibold h-10 rounded-xl px-4"
                >
                  Reload Page
                </Button>
                <Button
                  asChild
                  className="bg-transparent border border-white/20 text-white h-10 rounded-xl px-4"
                >
                  <Link href="/">Go to Homepage</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const comic: PreviewComic = comicData;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4 font-inter">
        <div className="max-w-md w-full bg-[#1D1E21] rounded-2xl overflow-hidden shadow-2xl border border-[#2A2B2E]">
          <div className="relative h-96 w-full">
            <Image
              src={comic.image}
              alt={comic.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D1E21] via-transparent to-transparent opacity-90" />
            <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-[#1D1E21] to-transparent">
              <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
                {comic.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="font-bold text-white">
                  {comic.owner || "Unknown Creator"}
                </span>
                {comic.genre && comic.genre.length > 0 && (
                  <>
                    {comic.genre.slice(0, 2).map((g, i) => (
                      <React.Fragment key={`${g}-${i}`}>
                        <span className="mx-1">•</span>
                        <span>{g}</span>
                      </React.Fragment>
                    ))}
                    {comic.genre.length > 2 && (
                      <>
                        <span>+{comic.genre.length - 2} more</span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="absolute top-4 right-4 z-10">
              <ShareButton
                url={`/preview/${slug}`}
                title={comic.title}
                text={`Read ${comic.title}`}
                className="bg-black/40 hover:bg-black/60 text-white border-white/20 backdrop-blur-sm"
              />
            </div>
          </div>
          <div className="p-6 pt-0 flex flex-col gap-6">
            <div className="flex justify-between text-sm text-gray-400 border-b border-gray-800 pb-4">
              <div className="flex flex-col items-center">
                <span className="font-bold text-white text-lg">
                  {comic.noOfChapters}
                </span>
                <span>Chapters</span>
              </div>
              <div className="w-px bg-gray-800" />
              <div className="flex flex-col items-center">
                <span className="font-bold text-white text-lg">
                  {comic.noOfViews?.toLocaleString() || 0}
                </span>
                <span>Reads</span>
              </div>
              <div className="w-px bg-gray-800" />
              <div className="flex flex-col items-center">
                <span className="font-bold text-white text-lg">
                  {comic.noOfLikes?.toLocaleString() || 0}
                </span>
                <span>Likes</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
              {comic.description}
            </p>
            <div className="flex flex-col gap-3">
              <Button
                asChild
                className="w-full group bg-white text-black hover:bg-gray-200 font-semibold h-12 rounded-xl"
              >
                <Link
                  href={`/r/comics/${slug}`}
                  className="flex items-center justify-center gap-2"
                >
                  Find out more{" "}
                  <ArrowRight
                    className="group-hover:translate-x-1.5 transition-transform ease-in-out duration-300"
                    size={18}
                  />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
