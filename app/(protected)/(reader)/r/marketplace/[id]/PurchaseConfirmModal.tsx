"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import NWT from "@/assets/nwt.svg";
import { Loader2, AlertCircle } from "lucide-react";

interface PurchaseConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nftTitle: string;
  quantity: number;
  pricePerUnit: number;
  totalCost: number;
  walletBalance: number;
  onConfirm: () => void;
  isPending: boolean;
}

export const PurchaseConfirmModal = ({
  open,
  onOpenChange,
  nftTitle,
  quantity,
  pricePerUnit,
  totalCost,
  walletBalance,
  onConfirm,
  isPending,
}: PurchaseConfirmModalProps) => {
  const hasSufficientFunds = walletBalance >= totalCost;
  const balanceAfterPurchase = walletBalance - totalCost;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1D1E21] text-white border-[#292A2E] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Confirm Purchase
          </DialogTitle>
          <DialogDescription className="text-nerd-muted">
            Review your purchase details before confirming
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* NFT Details */}
          <div className="space-y-2">
            <p className="text-sm text-nerd-muted">NFT</p>
            <p className="font-medium">{nftTitle}</p>
          </div>

          {/* Purchase Summary */}
          <div className="bg-[#FFFFFF0D] rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-nerd-muted">Quantity</span>
              <span className="font-medium">{quantity}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-nerd-muted">Price per unit</span>
              <span className="font-medium flex items-center gap-1">
                {pricePerUnit.toLocaleString()}
                <Image src={NWT} width={14} height={14} alt="nwt" />
              </span>
            </div>
            <div className="h-px bg-[#FFFFFF1A]" />
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Cost</span>
              <span className="font-semibold flex items-center gap-1.5">
                {totalCost.toLocaleString()}
                <Image src={NWT} width={16} height={16} alt="nwt" />
              </span>
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="bg-[#FFFFFF0D] rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-nerd-muted">Current Balance</span>
              <span className="font-medium flex items-center gap-1">
                {walletBalance.toLocaleString()}
                <Image src={NWT} width={14} height={14} alt="nwt" />
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-nerd-muted">Balance After Purchase</span>
              <span
                className={`font-medium flex items-center gap-1 ${
                  !hasSufficientFunds ? "text-red-400" : "text-white"
                }`}
              >
                {hasSufficientFunds ? balanceAfterPurchase.toLocaleString() : "—"}
                {hasSufficientFunds && (
                  <Image src={NWT} width={14} height={14} alt="nwt" />
                )}
              </span>
            </div>
          </div>

          {/* Insufficient Funds Warning */}
          {!hasSufficientFunds && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-400">
                  Insufficient Funds
                </p>
                <p className="text-xs text-red-300">
                  You need{" "}
                  {(totalCost - walletBalance).toLocaleString()} more NWT to
                  complete this purchase.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="bg-transparent border-[#292A2E] text-white hover:bg-[#2D2E31]"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={!hasSufficientFunds || isPending}
            className="min-w-[120px]"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Purchase"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
