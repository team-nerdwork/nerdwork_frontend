"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useListNFT } from "@/lib/api/nfts";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ListNFTModalProps {
  nftId: string;
  nftName: string;
  trigger: React.ReactNode;
  onSuccess?: () => void;
}

export const ListNFTModal = ({
  nftId,
  nftName,
  trigger,
  onSuccess,
}: ListNFTModalProps) => {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState("");
  const listNFTMutation = useListNFT();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const priceValue = parseFloat(price);

    if (!priceValue || priceValue <= 0) {
      toast.error("Please enter a valid price greater than 0");
      return;
    }

    try {
      await listNFTMutation.mutateAsync({
        nftId,
        price: priceValue,
      });

      toast.success("NFT listed successfully!");
      setOpen(false);
      setPrice("");
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to list NFT",
      );
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!listNFTMutation.isPending) {
      setOpen(newOpen);
      if (!newOpen) {
        setPrice("");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#1D1E21] text-white border-[#292A2E]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl">List NFT for Sale</DialogTitle>
            <DialogDescription className="text-nerd-muted">
              Set the price for &quot;{nftName}&quot; to list it on the
              marketplace.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="price" className="text-sm">
                Price (NWT)
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-[#171719] border-[#292A2E] text-white"
                disabled={listNFTMutation.isPending}
                required
              />
              <p className="text-xs text-nerd-muted">
                Enter the price in NWT for this NFT listing.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={listNFTMutation.isPending}
              className="text-white border-[#292A2E] hover:bg-[#1d1e21]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={listNFTMutation.isPending || !price}
            >
              {listNFTMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Listing...
                </>
              ) : (
                "List NFT"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
