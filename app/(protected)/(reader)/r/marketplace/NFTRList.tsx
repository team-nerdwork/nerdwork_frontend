"use client";
import { NFTCollectible } from "@/lib/types";
import Image from "next/image";
import React from "react";
import NWT from "@/assets/nwt.svg";
import Link from "next/link";

export default function NFTRList({ data }: { data: NFTCollectible[] }) {
  return (
    <section>
      <div className="flex flex-wrap gap-4">
        {data.map((nft) => (
          <div
            key={nft.listingId}
            className="rounded-md w-[173px] overflow-hidden cursor-pointer group"
          >
            <figure className="relative h-[268px] flex items-center">
              <Link href={`/r/marketplace/${nft.listingId}`}>
                <Image
                  src={nft.imageUrl}
                  width={173}
                  height={268}
                  alt={`${nft.title} image`}
                  className="rounded-md"
                />
              </Link>
              <div className="absolute bottom-2 left-2 text-xs text-white bg-black rounded-full px-2 py-1">
                {nft.remainingSupply}
              </div>
            </figure>
            <div className="bg-[#FFFFFF0D] p-4 flex flex-col gap-1 group-hover:bg-nerd-default">
              <Link href={`/r/marketplace/${nft.listingId}`}>
                <h4 className="font-medium truncate hover:underline">
                  {nft.title}
                </h4>
              </Link>
              <p className="text-sm flex items-center gap-2">
                {nft.price}{" "}
                <span>
                  <Image src={NWT} width={15} height={15} alt="nwt" />
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
