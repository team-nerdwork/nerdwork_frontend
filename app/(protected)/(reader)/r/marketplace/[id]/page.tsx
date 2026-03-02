"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Minus, Plus, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { use } from "react";
import { useGetSingleListedNFT, usePurchaseNFT } from "@/lib/api/nfts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserSession } from "@/lib/api/queries";
import { PurchaseConfirmModal } from "./PurchaseConfirmModal";
import { useSession } from "next-auth/react";

export default function NFTDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [ticketCount, setTicketCount] = React.useState<number>(1);
  const [showPurchaseModal, setShowPurchaseModal] = React.useState(false);

  const { data: session } = useSession();
  const { profile } = useUserSession(session?.user?.id);
  const { data: nftData, isLoading, error } = useGetSingleListedNFT(id);
  const purchaseNFTMutation = usePurchaseNFT();

  const walletBalance = profile?.readerProfile?.walletBalance ?? 0;

  const nft = React.useMemo(() => {
    if (!nftData) return null;
    // Handle different response structures
    if (nftData.nft) return nftData.nft;
    if (nftData.data) return nftData.data;
    return nftData;
  }, [nftData]);

  const remainingSupply = React.useMemo(() => {
    if (!nft) return undefined;
    if (nft.remainingSupply != null) return nft.remainingSupply;
    if (nft.total_copies != null && nft.sold_copies != null)
      return nft.total_copies - nft.sold_copies;
    return undefined;
  }, [nft]);

  const addTicket = (e: React.MouseEvent) => {
    e.preventDefault();
    if (purchaseNFTMutation.isPending) return;
    if (remainingSupply != null && ticketCount >= remainingSupply) {
      toast.error(`Cannot select more than ${remainingSupply} item(s)`);
      return;
    }
    setTicketCount((prevCount) => prevCount + 1);
  };

  const removeTicket = (e: React.MouseEvent) => {
    e.preventDefault();
    if (ticketCount > 1 && !purchaseNFTMutation.isPending) {
      setTicketCount((prevCount) => prevCount - 1);
    }
  };

  const price = nft?.price ?? 0;
  const totalCost = ticketCount * price;

  const handleOpenPurchaseModal = () => {
    if (remainingSupply != null && ticketCount > remainingSupply) {
      toast.error(`Cannot purchase more than ${remainingSupply} item(s)`);
      return;
    }
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = async () => {
    if (!nft || !id) return;

    if (remainingSupply != null && ticketCount > remainingSupply) {
      toast.error(`Cannot purchase more than ${remainingSupply} item(s)`);
      return;
    }

    try {
      await purchaseNFTMutation.mutateAsync({
        listingId: id,
        quantity: ticketCount,
      });
      toast.success(`Successfully purchased ${ticketCount} NFT(s)!`);
      setShowPurchaseModal(false);
      setTimeout(() => {
        router.push("/r/my-nfts");
      }, 1500);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to purchase NFT",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (error || !nft) {
    return (
      <div className="max-w-[1000px] mx-auto px-5 py-20 text-center">
        <p className="text-red-400 mb-4">Failed to load NFT details</p>
        <Link href="/r/marketplace">
          <Button variant="outline">Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <header className="relative min-h-[50vh] w-full pt-6">
        <div
          style={{
            backgroundImage: `url(${nft?.imageUrl || nft?.image})`,
          }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,13,13,0.2)_0%,#151515_50.75%)] z-10 -mb-px" />
        <div className="relative z-20 text-white h-full max-w-[1000px] mx-auto">
          <section className="flex max-md:flex-col-reverse max-md:pt-20 justify-between min-h-[65vh] font-inter -mb-px max-md:gap-6 md:gap-8 items-center px-5">
            <section className="max-w-[445px] space-y-7">
              <div className="flex flex-col gap-6">
                <Link href={"/r/marketplace"}>
                  <button className="flex items-center cursor-pointer gap-2.5 text-sm font-medium">
                    <ArrowLeft size={16} /> back
                  </button>
                </Link>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 animate-pulse rounded-full ${(remainingSupply ?? 0) > 0 ? "bg-[#97F68E]" : "bg-red-500"}`}
                  />
                  {(remainingSupply ?? 0) > 0 ? "Available Now" : "Sold Out."}
                </div>
                <h2 className="text-5xl font-bold">
                  {nft?.title || nft?.name}
                </h2>
              </div>

              <p>by {nft?.creatorName || "Creator"}</p>

              <p>{nft?.description}</p>

              <div className="flex items-center gap-4">
                {/* <p className="text-[#F5F5F599] flex items-center gap-1">
                  Supply{" "}
                  <span className="text-white">
                    {nft?.supply || nft?.total_copies}
                  </span>
                </p> */}
                <p className="text-[#F5F5F599] flex items-center gap-1">
                  Remaining{" "}
                  <span className="text-white">{remainingSupply ?? "N/A"}</span>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex gap-3 items-center bg-[#FFFFFF1A] border border-[#F5F5F50D] h-[45px] rounded-lg overflow-hidden">
                  <button
                    onClick={removeTicket}
                    disabled={ticketCount <= 1 || purchaseNFTMutation.isPending}
                    className="px-4 hover:opacity-85 hover:scale-110 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus size={18} />
                  </button>
                  <p>{ticketCount}</p>
                  <button
                    onClick={addTicket}
                    disabled={
                      purchaseNFTMutation.isPending ||
                      (remainingSupply != null &&
                        ticketCount >= remainingSupply)
                    }
                    className="px-4 hover:opacity-85 hover:scale-110 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                {price > 0 ? (
                  <Button
                    variant={"primary"}
                    onClick={handleOpenPurchaseModal}
                    disabled={(remainingSupply ?? 0) <= 0}
                  >
                    {(remainingSupply ?? 0) > 0
                      ? `Purchase for ${totalCost.toLocaleString()} NWT`
                      : "Sold Out"}
                  </Button>
                ) : null}
              </div>
            </section>
            {(nft?.imageUrl || nft?.image) && (
              <Image
                src={nft?.imageUrl || nft?.image}
                width={323}
                height={500}
                alt={`${nft?.title || nft?.name} cover`}
                className="h-[500px] w-[323px] max-md:h-[200px] max-md:w-auto object-contain"
              />
            )}
          </section>
        </div>
      </header>

      <PurchaseConfirmModal
        open={showPurchaseModal}
        onOpenChange={setShowPurchaseModal}
        nftTitle={nft?.title || nft?.name || "NFT"}
        quantity={ticketCount}
        pricePerUnit={price}
        totalCost={totalCost}
        walletBalance={walletBalance}
        onConfirm={handleConfirmPurchase}
        isPending={purchaseNFTMutation.isPending}
      />
    </>
  );
}
