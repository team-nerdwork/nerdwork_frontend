"use client";
import { useUserSession } from "@/lib/api/queries";
import { useGetCreatorNFTs } from "@/lib/api/nfts";
import NFTsEmptyState from "@/app/(protected)/(creator)/_components/nfts/NFTsEmptyState";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import NFTList from "../../_components/nfts/NFTList";

const NFTsPage = () => {
  const { profile } = useUserSession();
  const { data: nftData, isLoading, error } = useGetCreatorNFTs();
  const creatorProfile = profile?.creatorProfile;

  const NFTs = nftData?.data;
  console.log("Fetched NFTs:", NFTs);

  return (
    <main className="font-inter text-white">
      <section className="max-w-[1300px] mx-auto px-5 flex flex-col gap-4 py-8">
        <div>
          <h3 className="font-semibold text-[28px]">My NFTs</h3>
          <p className="text-sm text-nerd-muted">
            Welcome back, {creatorProfile?.creatorName}! Manage your NFT
            collectibles
          </p>
        </div>
        <Link href={"/creator/nfts/new"} className="max-md:w-full">
          <Button variant={"secondary"}>
            <Plus /> New Collectible
          </Button>
        </Link>
      </section>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      ) : error ? (
        <div className="max-w-[1300px] mx-auto px-5 py-10">
          <p className="text-center text-red-400">
            Failed to load NFTs. Please try again later.
          </p>
        </div>
      ) : !NFTs || NFTs.length === 0 ? (
        <NFTsEmptyState />
      ) : (
        <NFTList nfts={NFTs} />
      )}
    </main>
  );
};

export default NFTsPage;
