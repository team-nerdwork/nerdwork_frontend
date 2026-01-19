"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import solflareLogo from "@/assets/creator/solflare.svg";
// import phantomLogo from "@/assets/creator/phantom.svg";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Solflare from "@solflare-wallet/sdk";
import { useUserSession } from "@/lib/api/queries";
import { addBankAccount, setCreatorAddress } from "@/actions/profile.actions";
import { Input } from "@/components/ui/input";
import { Landmark } from "lucide-react";
import { useSession } from "next-auth/react";

const wallet = new Solflare();

export function PaymentDetailsForm() {
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const router = useRouter();
  const { refetch } = useUserSession();
  const { update } = useSession();
  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
  });

  // const walletDetected = (walletName: string) => {
  //   console.log(walletName);
  //   return wallet.isConnected;
  // };

  const handleContinue = async () => {
    if (selectedWallet === "bank") {
      if (
        !bankDetails.accountName ||
        !bankDetails.accountNumber ||
        !bankDetails.bankName
      ) {
        toast.error("Please fill in all bank details");
        return;
      }
      try {
        const response = await addBankAccount(bankDetails);

        if (!response?.success) {
          toast.error(
            response?.message ?? "An error occurred while submitting the form.",
          );
          return;
        }

        await refetch();
        await update({
          cProfile: true,
          ...(response.data?.token && { token: response.data.token }),
        });
        toast.success("Bank details set successfully!");
        router.push("/creator/comics");
      } catch (err) {
        toast.error("An unexpected error occurred.");
        console.error(err);
      }
      return;
    }

    console.log("Selected wallet:", selectedWallet);
    await wallet.connect();

    if (wallet!.publicKey!.toString()) {
      toast.info("Wallet Detected..");
    } else {
      toast.info("Wallet not  Connected... ");
    }

    console.log(wallet!.publicKey!.toString());
    try {
      const response = await setCreatorAddress(
        wallet!.publicKey!.toString(),
        selectedWallet,
      );
      console.log(response);

      if (!response?.success) {
        toast.error(
          response?.message ?? "An error occurred while submitting the form.",
        );
        return;
      }

      await refetch();
      await update({
        cProfile: true,
        ...(response.data?.token && { token: response.data.token }),
      });
      toast.success("Wallet address set successfully!");
      router.push("/creator/comics");
    } catch (err) {
      toast.error("An unexpected error occurred.");
      console.error(err);
    }
  };

  useEffect(() => {
    wallet.on("connect", () => {
      toast.info("Wallet Connected.");
      console.log("connected", wallet!.publicKey!.toString());
    });
    wallet.on("disconnect", () => {
      toast.info("Wallet Disconnected... ");
      console.log("disconnected");
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center px-5 text-white min-h-[75vh]">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl mb-3 font-bold text-center">
          Setup your payment details
        </h1>
        <p className="text-sm text-[#707073] text-center mb-8">
          If you don&apos;t have a wallet, choose a provider below to setup one
          now
        </p>

        <div className="space-y-4 mt-10">
          <div
            className={`py-2 px-3 flex items-center justify-between cursor-pointer transition-colors ${
              selectedWallet === "solflare"
                ? "rounded-[12px] bg-[#25262A]"
                : "hover:bg-neutral-800 rounded-[12px]"
            }`}
            onClick={() => setSelectedWallet("solflare")}
          >
            <div className="flex items-center space-x-4">
              <Image
                src={solflareLogo}
                alt="Solflare Wallet"
                width={32}
                height={32}
              />
              <div className="flex flex-col">
                <span className="text-sm">Solflare Wallet</span>
              </div>
            </div>
            {/* {walletDetected("solflare") && (
              <span className="text-[#D9D9D9] text-sm">Detected</span>
            )} */}
          </div>

          {/* <div
            className={`py-2 px-3 flex items-center justify-between cursor-pointer transition-colors ${
              selectedWallet === "phantom"
                ? "rounded-[12px] bg-[#25262A]"
                : "hover:bg-neutral-800 rounded-[12px]"
            }`}
            onClick={() => setSelectedWallet("phantom")}
          >
            <div className="flex items-center space-x-4">
              <Image
                src={phantomLogo}
                alt="Phantom Wallet"
                width={32}
                height={32}
              />
              <div className="flex flex-col">
                <span className="text-sm">Phantom Wallet</span>
              </div>
            </div>
            {walletDetected("phantom") && (
              <span className="text-[#D9D9D9] text-sm">Detected</span>
            )}
          </div> */}

          <div
            className={`py-2 px-3 flex flex-col cursor-pointer transition-colors ${
              selectedWallet === "bank"
                ? "rounded-[12px] bg-[#25262A]"
                : "hover:bg-neutral-800 rounded-[12px]"
            }`}
            onClick={() => setSelectedWallet("bank")}
          >
            <div className="flex items-center space-x-4 w-full">
              <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-black">
                <Landmark size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm">Bank Account</span>
              </div>
            </div>
            {selectedWallet === "bank" && (
              <div
                className="mt-4 space-y-3 w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Input
                  placeholder="Account Name"
                  value={bankDetails.accountName}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      accountName: e.target.value,
                    })
                  }
                  className="bg-[#1D1E21] border-none text-white"
                />
                <Input
                  placeholder="Account Number"
                  value={bankDetails.accountNumber}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      accountNumber: e.target.value,
                    })
                  }
                  className="bg-[#1D1E21] border-none text-white"
                />
                <Input
                  placeholder="Bank Name"
                  value={bankDetails.bankName}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, bankName: e.target.value })
                  }
                  className="bg-[#1D1E21] border-none text-white"
                />
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={handleContinue}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700"
          disabled={!selectedWallet}
        >
          Continue
        </Button>

        <Link href={"/creator/comics"}>
          <Button
            variant={"outline"}
            className="mt-4 w-full hover:bg-nerd-default hover:text-nerd-muted"
          >
            Skip
          </Button>
        </Link>
      </div>
    </div>
  );
}
