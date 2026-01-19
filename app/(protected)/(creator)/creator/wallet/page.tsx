"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import NWT from "@/assets/nwt.svg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import WithdrawEarningsModal from "@/components/wallet/WithdrawEarningsModal";
import { useUserSession } from "@/lib/api/queries";
import { ConnectWalletModal } from "../../../../../components/wallet/ConnectWalletModal";
import { getCreatorTransactionHistory } from "@/actions/transaction.action";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreatorTransaction } from "@/lib/types";
import LoaderScreen from "@/components/loading-screen";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { addBankAccount, setCreatorAddress } from "@/actions/profile.actions";
import { Landmark } from "lucide-react";

const WalletPage = () => {
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("");
  const { profile, refetch } = useUserSession();
  const creatorProfile = profile?.creatorProfile;

  const usdPerNwt = 0.1;
  const calculateUSD = (amount: number) => amount * usdPerNwt;
  const usdEquivalent = calculateUSD(creatorProfile?.walletBalance);

  const bankDetails = creatorProfile?.bankDetails;
  const walletAddress = creatorProfile?.walletAddress;
  const {
    data: transactions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["creator-transactions"],
    queryFn: getCreatorTransactionHistory,
    placeholderData: keepPreviousData,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  if (error)
    toast.error(error?.message || "Error getting transactions details");

  const transactionData: CreatorTransaction[] =
    transactions?.data.transaction ?? [];

  const filteredAndSortedData = useMemo(() => {
    let filteredData = transactionData;

    if (typeFilter !== "all" && typeFilter !== "") {
      filteredData = filteredData.filter(
        (item) => item.transactionType === typeFilter,
      );
    }
    if (statusFilter !== "all" && statusFilter !== "") {
      filteredData = filteredData.filter(
        (item) => item.status === statusFilter,
      );
    }

    if (sort !== "all" && sort !== "") {
      filteredData = [...filteredData].sort((a, b) => {
        if (sort === "nwtAmount") {
          return a.nwtAmount - b.nwtAmount;
        }
        if (sort === "updatedAt") {
          // Assuming date is a string that can be compared or converted to a Date object
          return (
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          );
        }
        if (sort === "type") {
          return a.earningSource.localeCompare(b.earningSource);
        }
        return 0;
      });
    }

    return filteredData;
  }, [transactionData, typeFilter, statusFilter, sort]);

  if (isLoading) return <LoaderScreen />;

  return (
    <main className="text-white font-inter">
      <section className="max-w-[1300px] mx-auto px-5 py-10 flex flex-col gap-5">
        <div className="flex max-md:flex-col gap-3 justify-between md:items-center">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-[28px]">Wallet</h3>
            <p className="text-nerd-muted text-sm">
              Manage your tokens, earnings, and payouts
            </p>
          </div>
          <div className="flex gap-2">
            <WithdrawEarningsModal />
          </div>
        </div>

        <section className="flex max-md:flex-col items-stretch gap-3">
          <div className="md:w-2/4 md:min-h-[279px] rounded-[12px] border-[0.5px] border-[#292A2E] bg-[#1D1E21] flex flex-col justify-between p-6">
            <div>
              <p className="text-sm">Available Balance</p>
              <p className="text-[64px] text-[#09FFFF] flex items-center gap-3 font-bold">
                <Image src={NWT} width={64} height={64} alt="" />
                {creatorProfile?.walletBalance}
              </p>
            </div>
            <p className="text-right font-bold text-[#598EE2] opacity-55 text-5xl">
              ≈ ${usdEquivalent.toFixed(2) ?? 0.0}
            </p>
          </div>

          <div className="md:w-1/4 min-h-[279px] rounded-[12px] border-[0.5px] border-[#292A2E] text-sm p-6 flex flex-col gap-4">
            <div>
              <p>Wallet Information</p>
              <p className="text-nerd-muted">Manage your payout destination</p>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex flex-col gap-2">
                {walletAddress ? (
                  <>
                    <p className="flex items-center gap-2">
                      Solflare (Solana Wallet)
                    </p>
                    <p className="text-nerd-muted truncate">
                      {`${walletAddress.slice(0, 4)}...${walletAddress.slice(
                        -4,
                      )}`}
                    </p>
                    <Button
                      onClick={() => toast.info("Feature is coming soon")}
                      className="bg-nerd-default w-fit h-8 text-xs"
                    >
                      Edit Wallet
                    </Button>
                  </>
                ) : (
                  <div className="w-full">
                    <ConnectWalletModal />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {bankDetails ? (
                  <>
                    <p className="flex items-center gap-2">
                      <Landmark size={16} /> Bank Account
                    </p>
                    <p className="text-nerd-muted truncate">
                      {`${bankDetails.bankName} - ${bankDetails.accountNumber}`}
                    </p>
                    <BankDetailsDialog
                      onSuccess={refetch}
                      trigger={
                        <Button className="bg-nerd-default w-fit h-8 text-xs">
                          Edit Bank Details
                        </Button>
                      }
                    />
                  </>
                ) : (
                  <BankDetailsDialog
                    onSuccess={refetch}
                    trigger={
                      <Button variant="outline" className="w-full">
                        Add Bank Details
                      </Button>
                    }
                  />
                )}
              </div>
            </div>
            <p className="text-nerd-muted text-xs mt-auto pt-4">
              Payouts are completed every 3 working days
            </p>
          </div>

          <div className="md:w-1/4 min-h-[279px] rounded-[12px] border-[0.5px] border-[#292A2E] text-sm flex flex-col">
            <div className="p-6 h-[60%] flex flex-col justify-between">
              <div>
                <p>Exchange Rates</p>
                <p className="text-nerd-muted">
                  Rates are updated every 2 minutes
                </p>
              </div>
              <div className="font-medium">
                <p className="flex justify-between">
                  1 NWT <span>$0.1</span>
                </p>
                {/* <p className="flex justify-between">
                  1 SOL <span>$10.05</span>
                </p> */}
              </div>
            </div>
            <hr className="!text-[#292A2E] h-0 border-t border-[#292A2E]" />
            <div className="p-6 text-xs text-nerd-muted flex flex-col gap-1">
              <p className="flex justify-between">
                Fees: <span>1% on all transactions.</span>
              </p>
              <p className="flex justify-between">
                Minimum payout: <span>$50 or equivalent.</span>
              </p>
              <p className="flex justify-between">
                Processing time: <span>1 to 3 working days.</span>
              </p>
            </div>
          </div>
        </section>
      </section>

      <hr className="!text-[#292A2E] h-0 border-t border-[#292A2E]" />

      <section className="max-w-[1300px] mx-auto px-5 py-10">
        <p>Transaction History</p>
        <p className="text-nerd-muted text-sm">
          Your payout requests and their status
        </p>

        <div className="flex gap-3 py-5 border-b border-[#292A2E]">
          <Select onValueChange={setTypeFilter} value={typeFilter}>
            <SelectTrigger className="w-full max-w-[155px] bg-[#1D1E21] border-[#292A2E] text-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-[#1D1E21] border-none text-white">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="earning">Earning</SelectItem>
              <SelectItem value="bonus">Bonus</SelectItem>
              <SelectItem value="withdrawal">Withdrawal</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setStatusFilter} value={statusFilter}>
            <SelectTrigger className="w-full max-w-[155px] bg-[#1D1E21] border-[#292A2E] text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1D1E21] border-none text-white">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setSort} value={sort}>
            <SelectTrigger className="w-full max-w-[155px] bg-[#1D1E21] border-[#292A2E] text-white">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-[#1D1E21] border-none text-white">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="type">Type</SelectItem>
              <SelectItem value="nwtAmount">Amount</SelectItem>
              <SelectItem value="updatedAt">Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="container mx-auto py-10 text-white">
          <DataTable columns={columns} data={filteredAndSortedData} />
        </div>
      </section>
    </main>
  );
};

const BankDetailsDialog = ({
  trigger,
  onSuccess,
}: {
  trigger: React.ReactNode;
  onSuccess: () => void;
}) => {
  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (
      !bankDetails.accountName ||
      !bankDetails.accountNumber ||
      !bankDetails.bankName
    ) {
      toast.error("Please fill in all bank details");
      return;
    }
    setIsLoading(true);
    try {
      const response = await addBankAccount(bankDetails);

      if (!response?.success) {
        toast.error(
          response?.message ?? "An error occurred while submitting the form.",
        );
        return;
      }

      await onSuccess();
      toast.success("Bank details set successfully!");
      setIsOpen(false);
    } catch (err) {
      toast.error("An unexpected error occurred.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-[#1D1E21] border-[#292A2E] text-white">
        <DialogHeader>
          <DialogTitle>Bank Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          <Input
            placeholder="Account Name"
            value={bankDetails.accountName}
            onChange={(e) =>
              setBankDetails({ ...bankDetails, accountName: e.target.value })
            }
            className="bg-[#25262A] border-none text-white"
          />
          <Input
            placeholder="Account Number"
            value={bankDetails.accountNumber}
            onChange={(e) =>
              setBankDetails({ ...bankDetails, accountNumber: e.target.value })
            }
            className="bg-[#25262A] border-none text-white"
          />
          <Input
            placeholder="Bank Name"
            value={bankDetails.bankName}
            onChange={(e) =>
              setBankDetails({ ...bankDetails, bankName: e.target.value })
            }
            className="bg-[#25262A] border-none text-white"
          />
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
          >
            {isLoading ? "Saving..." : "Save Details"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletPage;
