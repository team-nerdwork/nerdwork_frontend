"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Landmark, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Helio from "@/assets/helio.svg";
import { toast } from "sonner";
import { useUserSession } from "@/lib/api/queries";

const WithdrawEarningsModal = () => {
  const [withdrawAmount, setWithdrawAmount] = React.useState(0);
  const [withdrawalMethod, setWithdrawalMethod] = React.useState<
    "bank" | "wallet"
  >("bank");
  const { profile } = useUserSession();
  const creatorProfile = profile?.creatorProfile;

  const usdPerNwt = 0.1;
  const calculateUSD = (amount: number) => amount * usdPerNwt;
  const availableBalance = creatorProfile?.walletBalance; // NWT
  const usdEquivalent = calculateUSD(availableBalance);

  const transactionFee = 0.01; // 1%

  const hasBank = !!creatorProfile?.bankDetails;
  const hasWallet = !!creatorProfile?.walletAddress;

  React.useEffect(() => {
    if (hasBank && !hasWallet) setWithdrawalMethod("bank");
    if (!hasBank && hasWallet) setWithdrawalMethod("wallet");
    // If both are present, we keep the user's selection (defaults to "bank")
  }, [hasBank, hasWallet]);

  const handleWithdrawAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseFloat(e.target.value);
    setWithdrawAmount(isNaN(value) ? 0 : value);
  };

  const calculateFee = (amount: number) => {
    return amount * transactionFee;
  };

  const calculateTotal = (amount: number) => {
    return amount + calculateFee(amount);
  };

  const amountInNWT = withdrawAmount;
  const amountInUSD = (
    withdrawAmount *
    (usdEquivalent / availableBalance)
  ).toFixed(2);
  const feeNWT = calculateFee(withdrawAmount);
  const totalNWT = calculateTotal(withdrawAmount);

  const handleSubmit = () => {
    // console.log(totalNWT);
    toast.info("Proceeding to Helio for payment...");
  };

  return (
    <div>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button variant={"primary"}>
              <Send /> Withdraw Money
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#171719] font-inter text-white border-none">
            <DialogHeader>
              <DialogTitle className="text-2xl">Withdraw Earnings</DialogTitle>
              <DialogDescription className="text-nerd-muted">
                Choose the amount of money you want to withdraw and continue to
                payment
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className={`py-3 px-3 border border-[#292A2E] rounded-md`}>
                <p>Available Balance</p>
                <p className="text-nerd-muted flex items-center justify-between">
                  {availableBalance ?? 0} NWT{" "}
                  <span>${usdEquivalent.toFixed(2) ?? 0.0}</span>
                </p>
              </div>

              <div
                className={`py-3 px-3 border border-[#292A2E] rounded-md flex flex-col justify-between gap-2`}
              >
                {hasBank && hasWallet && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-nerd-muted">Withdraw to</span>
                    <Select
                      value={withdrawalMethod}
                      onValueChange={(v) =>
                        setWithdrawalMethod(v as "bank" | "wallet")
                      }
                    >
                      <SelectTrigger className="w-[180px] h-8 text-xs bg-[#1D1E21] border-[#292A2E]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1D1E21] border-[#292A2E] text-white">
                        <SelectItem value="bank">Bank Account</SelectItem>
                        <SelectItem value="wallet">Solana Wallet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  {withdrawalMethod === "bank" && hasBank ? (
                    <>
                      <p className="flex items-center gap-2">
                        <Landmark size={16} /> Bank Account
                      </p>
                      <p className="text-nerd-muted">
                        {creatorProfile?.bankDetails?.bankName} -{" "}
                        {creatorProfile?.bankDetails?.accountNumber}
                      </p>
                    </>
                  ) : withdrawalMethod === "wallet" && hasWallet ? (
                    <>
                      <p>Solflare (Solana Wallet)</p>
                      <p className="text-nerd-muted">
                        {creatorProfile?.walletAddress?.slice(0, 4)}...
                        {creatorProfile?.walletAddress?.slice(-4)}
                      </p>
                    </>
                  ) : (
                    <span className="text-xs text-red-400">
                      Please connect a wallet or add bank details to enable
                      withdrawal
                    </span>
                  )}
                </div>
                {/* <Button className="bg-nerd-default w-fit">Edit Wallet</Button> */}
              </div>

              <div className="relative flex items-center space-x-2">
                <Input
                  type="number"
                  value={withdrawAmount === 0 ? "" : withdrawAmount}
                  onChange={handleWithdrawAmountChange}
                  placeholder="0 NWT"
                  className="bg-[#1D1E21] border-[#292A2E] text-white placeholder:text-nerd-muted"
                />
                <Button
                  variant="outline"
                  className="bg-transparent text-white"
                  onClick={() => setWithdrawAmount(availableBalance)}
                >
                  Max
                </Button>
              </div>
              <p className="text-sm text-[#E8794A]">
                Minimum amount is 25.00 NWT
              </p>
            </div>
            <div className="space-y-2 text-sm text-nerd-muted border-t pt-4 border-[#292A2E]">
              <div className="flex justify-between">
                <span>USD Amount</span>
                <span className="text-white">${amountInUSD}</span>
              </div>
              <div className="flex justify-between">
                <span>Token Equivalent</span>
                <span className="text-white">{amountInNWT} NWT</span>
              </div>
              <div className="flex justify-between pb-3">
                <span>1% Transaction Fee</span>
                <span className="text-white">{feeNWT} NWT</span>
              </div>
              <div className="flex justify-between border-t border-[#292A2E] pt-3 text-white">
                <span>Total to pay</span>
                <span>{totalNWT} NWT</span>
              </div>
            </div>

            <DialogFooter className="flex !flex-col">
              <Button
                onClick={handleSubmit}
                variant={"primary"}
                className="w-full mt-3"
                disabled={
                  !creatorProfile?.walletAddress && !creatorProfile?.bankDetails
                }
              >
                Continue to Payment
              </Button>
              <p className="text-xs text-center text-nerd-muted flex items-center justify-center gap-2">
                Powered by Helio{" "}
                <Image src={Helio} width={14} height={14} alt="helio" />
              </p>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default WithdrawEarningsModal;
