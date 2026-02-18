"use client";

import { Badge } from "@/components/ui/badge";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from "@/components/ui/menubar";
import {
  EllipsisVertical,
  ChartLine,
  Eye,
  Trash,
  DollarSign,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { NFTCollectible } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { ListNFTModal } from "./ListNFTModal";
import { useDeleteNFT } from "@/lib/api/nfts";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AllNFTs = ({ data }: { data: NFTCollectible[] }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFTCollectible | null>(null);
  const deleteNFTMutation = useDeleteNFT();

  const handleDeleteClick = (nft: NFTCollectible) => {
    setSelectedNFT(nft);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedNFT) return;

    try {
      await deleteNFTMutation.mutateAsync(selectedNFT.id);
      toast.success("NFT deleted successfully!");
      setDeleteDialogOpen(false);
      setSelectedNFT(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete NFT",
      );
    }
  };

  return (
    <section className="font-inter text-white mb-10 max-md:mt-5 max-2xl:mx-5">
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {data.map((comic) => (
          <div
            key={comic.id}
            className="relative group h-[586px] bg-[#171719] rounded-[8px] flex flex-col border border-[#262626] hover:border-[#9D9D9F] transition duration-300 hover:ease-in-out overflow-hidden"
          >
            <Image
              src={comic.imageUrl}
              width={316}
              height={468}
              alt={`${comic.title} cover`}
              className="h-[400px] w-full object-cover"
            />
            <div className="absolute left-5 right-5 flex justify-between top-3">
              <Badge variant={"secondary"} className="capitalize h-6 text-xs">
                {comic.status}
              </Badge>
              <Menubar className="bg-[#1D1E21] font-inter outline-none border-none ring-0 rounded-full transition duration-300 hover:ease-in-out  p-0">
                <MenubarMenu>
                  <MenubarTrigger className="bg-[#1D1E21] data-[state=open]:bg-none h-8 w-8 flex justify-center items-center transition duration-300 cursor-pointer rounded-full p-0">
                    <EllipsisVertical size={16} />
                  </MenubarTrigger>
                  <MenubarContent className="bg-[#1D1E21] text-white border-0 absolute -right-[30px]">
                    <MenubarItem>
                      <Eye />
                      View Details
                    </MenubarItem>
                    <ListNFTModal
                      nftId={comic.id}
                      nftName={comic.title}
                      trigger={
                        <MenubarItem onSelect={(e) => e.preventDefault()}>
                          <DollarSign />
                          List for Sale
                        </MenubarItem>
                      }
                    />
                    <MenubarItem>
                      <ChartLine /> View Stats
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem
                      onClick={() => handleDeleteClick(comic)}
                      className="text-red-400 focus:text-red-400"
                    >
                      <Trash /> Delete NFT
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
            <div className="p-5 max-md:p-3 text-sm space-y-1">
              <p className="mb-1 font-semibold">{comic.title}</p>
              <p className="text-nerd-muted text-sm">{comic.description}</p>
              <div className="text-sm py-3 space-y-1">
                <p className="flex justify-between items-center text-nerd-muted">
                  <span>
                    {comic.status == "listed"
                      ? "issued"
                      : comic.status == "sold"
                        ? "Sold out"
                        : "Frozen"}
                  </span>
                  <span>
                    {comic.supply - comic.remainingSupply}/{comic.supply} copies
                  </span>
                </p>

                <Progress
                  value={
                    (comic.supply - comic.remainingSupply / comic.supply) * 100
                  }
                />
              </div>
              <p className="flex justify-between items-center">
                <span>{comic.price ?? 0} NWT</span>
                <span className="text-nerd-muted">
                  {comic.royaltyBps / 100}% commission
                </span>
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#1D1E21] text-white border-[#292A2E]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-nerd-muted">
              This action cannot be undone. This will permanently delete &quot;
              {selectedNFT?.title}&quot; and remove it from the marketplace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-transparent border-[#292A2E] text-white hover:bg-[#1d1e21]"
              disabled={deleteNFTMutation.isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteNFTMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteNFTMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default AllNFTs;
