"use client";
import { useGetPurchasedNFTs } from "@/lib/api/nfts";
import { Loader2 } from "lucide-react";
import React from "react";
import { NFTCollectible } from "@/lib/types";

type PurchasedNFT = {
  nftId?: string;
  id?: string;
  imageUrl?: string;
  image?: string;
  nft?: NFTCollectible;
  title?: string;
  name?: string;
  quantityOwned?: number;
  purchasedAt?: string;
  price?: number;
};
import Image from "next/image";
// import NWT from "@/assets/nwt.svg";
import Link from "next/link";

const MyNFTsPage = () => {
  const { data: nftData, isLoading, error } = useGetPurchasedNFTs();

  // Ensure we always have an array
  const NFTs = React.useMemo<PurchasedNFT[]>(() => {
    if (!nftData) return [];
    if (Array.isArray(nftData)) return nftData as PurchasedNFT[];
    if (nftData.nfts && Array.isArray(nftData.nfts))
      return nftData.nfts as PurchasedNFT[];
    if (nftData.data && Array.isArray(nftData.data))
      return nftData.data as PurchasedNFT[];
    if (nftData.purchases && Array.isArray(nftData.purchases))
      return nftData.purchases as PurchasedNFT[];
    return [];
  }, [nftData]);

  return (
    <main className="max-w-[1200px] w-full mx-auto px-5 font-inter text-white pt-20">
      <div className="py-8">
        <h3 className="font-semibold text-[28px]">My NFTs</h3>
        <p className="text-sm text-nerd-muted">
          View and manage your purchased NFT collectibles
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      ) : error ? (
        <div className="py-10">
          <p className="text-center text-red-400">
            Failed to load your NFTs. Please try again later.
          </p>
        </div>
      ) : NFTs.length === 0 ? (
        <div className="py-20 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <p className="text-nerd-muted text-lg">
              You haven&apos;t purchased any NFTs yet
            </p>
            <p className="text-sm text-nerd-muted">
              Explore the marketplace to discover and collect exclusive NFTs
            </p>
            <Link
              href="/r/marketplace"
              className="inline-block mt-4 bg-[#1D1E21] hover:bg-[#2D2E31] transition-colors px-6 py-3 rounded-md"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
      ) : (
        <section className="pb-10">
          <div className="flex flex-wrap gap-4">
            {NFTs.map((nft: PurchasedNFT, idx: number) => (
              <div
                key={`${nft.nftId ?? nft.id ?? nft.title ?? idx}`}
                className="rounded-md w-[173px] overflow-hidden cursor-pointer group"
              >
                <figure className="relative h-[268px] flex items-center">
                  <Image
                    src={nft.imageUrl || nft.nft?.imageUrl || nft.image || ""}
                    width={173}
                    height={268}
                    alt={`${nft.title || nft.nft?.title || nft.name || "NFT"} image`}
                    className="rounded-md object-cover"
                  />
                  <div className="absolute bottom-2 left-2 text-xs text-white bg-black/70 rounded-full px-2 py-1">
                    Qty: {nft.quantityOwned ?? 1}
                  </div>
                </figure>
                <div className="bg-[#FFFFFF0D] p-4 flex flex-col gap-1 group-hover:bg-nerd-default">
                  <h4 className="font-medium">
                    {nft.title || nft.nft?.title || nft.name}
                  </h4>
                  {/* <p className="text-sm flex items-center gap-2">
                    {nft.price || nft.nft?.price || 0}{" "}
                    <span>
                      <Image src={NWT} width={15} height={15} alt="nwt" />
                    </span>
                  </p> */}
                  {nft.purchasedAt && (
                    <p className="text-xs text-nerd-muted mt-1">
                      Purchased:{" "}
                      {new Date(nft.purchasedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default MyNFTsPage;
