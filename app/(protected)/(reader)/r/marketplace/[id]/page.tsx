"use client";
import { nftData } from "@/components/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { use } from "react";

export default function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [ticketCount, setTicketCount] = React.useState<number>(1);

  const nft = nftData.find((nft) => nft.id === id);

  const addTicket = (e: React.MouseEvent) => {
    e.preventDefault();
    setTicketCount((prevCount) => prevCount + 1);
  };

  const removeTicket = (e: React.MouseEvent) => {
    e.preventDefault();
    if (ticketCount > 1) {
      setTicketCount((prevCount) => prevCount - 1);
    }
  };

  const price = nft?.price ?? 0;

  const handleTicketCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    const validValue = Math.max(1, value); // Ensure minimum of 1
    setTicketCount(validValue);
  };

  return (
    <>
      <header className="relative min-h-[50vh] w-full pt-6">
        <div
          style={{ backgroundImage: `url(${nft?.image})` }}
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
                  <div className="w-3 h-3 animate-pulse rounded-full bg-[#97F68E]" />
                  Minting Now
                </div>
                <h2 className="text-5xl font-bold">{nft?.name}</h2>
              </div>

              <p>by John Doe</p>

              <p>{nft?.description}</p>

              <div className="flex items-center gap-4">
                <p className="text-[#F5F5F599] flex items-center gap-1">
                  Volume <span className="text-white">{nft?.total_copies}</span>
                </p>
                <p className="text-[#F5F5F599] flex items-center gap-1">
                  Minted <span className="text-white">{nft?.sold_copies}</span>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex gap-3 items-center bg-[#FFFFFF1A] border border-[#F5F5F50D] h-[45px] rounded-lg overflow-hidden">
                  <button
                    onClick={removeTicket}
                    disabled={ticketCount <= 1}
                    className="px-4 hover:opacity-85 hover:scale-110 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus size={18} />
                  </button>
                  <p>{ticketCount}</p>
                  <button
                    onClick={addTicket}
                    className="px-4 hover:opacity-85 hover:scale-110 transition-all duration-300 cursor-pointer"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                {price > 0 ? (
                  <Button variant={"primary"}>
                    Mint for N{(ticketCount * price).toLocaleString()}
                  </Button>
                ) : null}
              </div>
            </section>
            {nft?.image && (
              <Image
                src={nft?.image}
                width={323}
                height={500}
                alt={`${nft.name} cover`}
                className="h-[500px] w-[323px] max-md:h-[200px] max-md:w-auto object-contain"
              />
            )}
          </section>
          {/* <section>
            <h4 className="border-b border-nerd-gray pb-3">Activity</h4>
          </section> */}
        </div>
      </header>
    </>
  );
}
