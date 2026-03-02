"use client";
import React, { useState } from "react";
import NFTRList from "./NFTRList";
import { useGetMarketplaceNFTs } from "@/lib/api/nfts";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NFTCollectible } from "@/lib/types";

type SortOption =
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "newest"
  | "oldest"
  | "most-available"
  | "almost-sold";

const Marketplace = () => {
  const { data: nftData, isLoading, error } = useGetMarketplaceNFTs();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Ensure we always have an array
  const NFTs = React.useMemo<NFTCollectible[]>(() => {
    if (!nftData) return [];
    if (Array.isArray(nftData)) return nftData as NFTCollectible[];
    if (nftData.nfts && Array.isArray(nftData.nfts))
      return nftData.nfts as NFTCollectible[];
    if (nftData.data && Array.isArray(nftData.data))
      return nftData.data as NFTCollectible[];
    return [];
  }, [nftData]);

  // Filter and sort NFTs
  const filteredAndSortedNFTs = React.useMemo(() => {
    let result = [...NFTs];

    // Filter by search query
    if (searchQuery.trim()) {
      result = result.filter((nft: NFTCollectible) =>
        nft.title?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sort NFTs
    result.sort((a: NFTCollectible, b: NFTCollectible) => {
      switch (sortBy) {
        case "price-asc":
          return (a.price || 0) - (b.price || 0);
        case "price-desc":
          return (b.price || 0) - (a.price || 0);
        case "name-asc":
          return (a.title || "").localeCompare(b.title || "");
        case "name-desc":
          return (b.title || "").localeCompare(a.title || "");
        case "newest":
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
          );
        case "most-available":
          return (b.remainingSupply || 0) - (a.remainingSupply || 0);
        case "almost-sold":
          return (a.remainingSupply || 0) - (b.remainingSupply || 0);
        default:
          return 0;
      }
    });

    // Separate available and sold out, keep available first
    const available = result.filter(
      (nft: NFTCollectible) => (nft.remainingSupply ?? 0) > 0,
    );
    const soldOut = result.filter(
      (nft: NFTCollectible) => (nft.remainingSupply ?? 0) <= 0,
    );

    return [...available, ...soldOut];
  }, [NFTs, searchQuery, sortBy]);

  return (
    <main className="max-w-[1200px] w-full mx-auto px-5 font-inter text-white pt-20">
      <div className="py-8">
        <h3 className="font-semibold text-[28px]">Marketplace</h3>
        <p className="text-sm text-nerd-muted">
          Discover and collect exclusive NFTs
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      ) : error ? (
        <div className="py-10">
          <p className="text-center text-red-400">
            Failed to load marketplace NFTs. Please try again later.
          </p>
        </div>
      ) : (
        <>
          {/* Search and Sort Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            {/* Search Bar */}
            <div className="relative w-full sm:w-[400px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-nerd-muted" />
              <Input
                type="text"
                placeholder="Search NFTs..."
                className="pl-10 bg-[#1E1E1E66] border-[#292A2E] text-white placeholder:text-nerd-muted focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-nerd-muted whitespace-nowrap">
                Sort by:
              </span>
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortOption)}
              >
                <SelectTrigger className="w-[200px] bg-[#1E1E1E66] border-[#292A2E] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1D1E21] border-[#292A2E] text-white">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A-Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z-A</SelectItem>
                  <SelectItem value="most-available">Most Available</SelectItem>
                  <SelectItem value="almost-sold">Almost Sold Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-nerd-muted">
              {filteredAndSortedNFTs.length} NFT
              {filteredAndSortedNFTs.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* NFT Grid */}
          {filteredAndSortedNFTs.length === 0 ? (
            <div className="py-20 text-center text-nerd-muted">
              <p className="text-lg mb-2">No NFTs found</p>
              <p className="text-sm">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Check back later for new NFTs"}
              </p>
            </div>
          ) : (
            <NFTRList data={filteredAndSortedNFTs} />
          )}
        </>
      )}
    </main>
  );
};

export default Marketplace;
