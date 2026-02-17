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
import { WalletCardsIcon, Loader2, CreditCard, Bitcoin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import NWT from "@/assets/nwt.svg";
import Helio from "@/assets/helio.svg";
import { toast } from "sonner";
import { createPaymentLink, createPaymentWebhook } from "@/lib/api/payment";
import HelioModal from "./HelioModal";
import PaystackCheckout from "./PaystackCheckout";
import type { PaymentProvider } from "@/lib/types/payment.types";
import {
  EXCHANGE_RATES,
  TRANSACTION_FEE_RATE,
  NWT_SUGGESTED_AMOUNTS,
} from "@/lib/constants";

const PurchaseTokenModal = () => {
  const [nwtAmount, setNwtAmount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  // Payment method & currency state
  const [paymentMethod, setPaymentMethod] =
    React.useState<PaymentProvider>("paystack");
  // Helio modal state
  const [helioModalOpen, setHelioModalOpen] = React.useState(false);
  const [paymentData, setPaymentData] = React.useState<{
    paymentLink?: string;
    paylinkId?: string;
  }>({});

  // Paystack modal state
  const [paystackModalOpen, setPaystackModalOpen] = React.useState(false);

  // Paystack = NGN, Helio = USD
  const activeRate =
    paymentMethod === "helio" ? EXCHANGE_RATES.USD : EXCHANGE_RATES.NGN;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setNwtAmount(isNaN(value) ? 0 : value);
  };

  const calculateFiat = (amount: number) => amount * activeRate.ratePerNWT;
  const calculateFee = (amount: number) =>
    calculateFiat(amount) * TRANSACTION_FEE_RATE;
  const calculateTotal = (amount: number) =>
    calculateFiat(amount) + calculateFee(amount);

  const fiatEquivalent = calculateFiat(nwtAmount);
  const transactionFee = calculateFee(nwtAmount);
  const totalToPay = calculateTotal(nwtAmount);

  const handleSubmit = async () => {
    if (nwtAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (paymentMethod === "paystack") {
      setIsOpen(false);
      setPaystackModalOpen(true);
      return;
    }

    // Helio flow (existing)
    setIsLoading(true);

    try {
      toast.info("Creating payment link...");
      const usdEquivalent = nwtAmount * EXCHANGE_RATES.USD.ratePerNWT;
      const paymentResponse = await createPaymentLink({
        amount: usdEquivalent,
        name: "NWT_Purchase",
        redirectUrl: "http://nerdwork.ng/helio/webhook/handle",
      });

      if (!paymentResponse.success) {
        throw new Error("Failed to create payment link");
      }

      if (paymentResponse.success && paymentResponse.data) {
        const webhook = await createPaymentWebhook({
          paymentId: paymentResponse.data.paylinkId,
        });

        console.log(webhook);

        setPaymentData({
          paymentLink: paymentResponse.data.payment.url,
          paylinkId: paymentResponse.data.paylinkId,
        });

        setIsOpen(false);
        setHelioModalOpen(true);
        toast.success("Payment form ready!");
      } else {
        console.error("Error creating link:", paymentResponse.message);
      }
    } catch (error: unknown) {
      console.error("Payment error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create payment. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // USD values for Helio modal (it expects USD)
  const helioUsdEquivalent = nwtAmount * EXCHANGE_RATES.USD.ratePerNWT;
  const helioTransactionFee = helioUsdEquivalent * TRANSACTION_FEE_RATE;
  const helioTotalToPay = helioUsdEquivalent + helioTransactionFee;

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <form>
          <DialogTrigger asChild>
            <Button variant="primary">
              <WalletCardsIcon size={16} /> Buy NWT
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#171719] text-white border-none">
            <DialogHeader>
              <DialogTitle className="text-2xl">Buy NWT</DialogTitle>
              <DialogDescription className="text-nerd-muted">
                Choose the amount of NWT tokens you want to purchase and
                continue to payment
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* NWT Amount Input */}
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={nwtAmount === 0 ? "" : nwtAmount}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="bg-[#1D1E21] border-[#292A2E] text-white placeholder:text-nerd-muted"
                />
              </div>

              {/* Suggested Amounts */}
              <div className="flex space-x-2 flex-wrap">
                {NWT_SUGGESTED_AMOUNTS.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    type="button"
                    className={`flex items-center gap-1.5 ${
                      nwtAmount === amount
                        ? "bg-white text-black"
                        : "bg-transparent"
                    }`}
                    onClick={() => setNwtAmount(amount)}
                  >
                    {amount}{" "}
                    <Image src={NWT} width={14} height={14} alt="nwt" />
                  </Button>
                ))}
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-2">
                <p className="text-sm text-nerd-muted">Payment Method</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`flex-1 flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                      paymentMethod === "paystack"
                        ? "border-[#AE7A5B] bg-[#AE7A5B]/10 text-white"
                        : "border-[#292A2E] bg-[#1D1E21] text-nerd-muted hover:border-[#3A3B3F]"
                    }`}
                    onClick={() => setPaymentMethod("paystack")}
                  >
                    <CreditCard size={18} />
                    <div className="text-left">
                      <p className="font-medium">Card Payment</p>
                      <p className="text-xs opacity-70">Paystack</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`flex-1 flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                      paymentMethod === "helio"
                        ? "border-[#AE7A5B] bg-[#AE7A5B]/10 text-white"
                        : "border-[#292A2E] bg-[#1D1E21] text-nerd-muted hover:border-[#3A3B3F]"
                    }`}
                    onClick={() => setPaymentMethod("helio")}
                  >
                    <Bitcoin size={18} />
                    <div className="text-left">
                      <p className="font-medium">Crypto</p>
                      <p className="text-xs opacity-70">Helio</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Currency info (Paystack = NGN, Helio = USD) */}
              {paymentMethod === "paystack" && (
                <p className="text-xs text-nerd-muted">
                  Paystack payments are charged in {EXCHANGE_RATES.NGN.symbol}
                  NGN
                </p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 mt-4 text-sm text-nerd-muted border-t pt-3 border-[#292A2E]">
              <div className="flex justify-between">
                <span>Token Amount</span>
                <span>{nwtAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>{activeRate.currency} Equivalent</span>
                <span>
                  {activeRate.symbol}
                  {fiatEquivalent.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>1% Transaction Fee</span>
                <span>
                  {activeRate.symbol}
                  {transactionFee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-3 border-[#292A2E] text-white">
                <span>Total to pay</span>
                <span>
                  {activeRate.symbol}
                  {totalToPay.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            <DialogFooter className="flex !flex-col">
              <Button
                onClick={handleSubmit}
                variant={"primary"}
                type="button"
                className="w-full mt-3"
                disabled={isLoading || nwtAmount <= 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Continue to Payment"
                )}
              </Button>
              <p className="text-xs text-center text-nerd-muted flex items-center justify-center gap-2">
                {paymentMethod === "helio" ? (
                  <>
                    Powered by Helio{" "}
                    <Image src={Helio} width={14} height={14} alt="helio" />
                  </>
                ) : (
                  "Powered by Paystack"
                )}
              </p>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      {/* Paystack Checkout Modal */}
      <PaystackCheckout
        isOpen={paystackModalOpen}
        onOpenChange={setPaystackModalOpen}
        nwtAmount={nwtAmount}
        currency="NGN"
      />

      {/* Helio Payment Modal */}
      <HelioModal
        isOpen={helioModalOpen}
        onOpenChange={setHelioModalOpen}
        paymentLink={paymentData.paymentLink}
        paylinkId={paymentData.paylinkId}
        amount={nwtAmount}
        usdEquivalent={helioUsdEquivalent}
        transactionFee={helioTransactionFee}
        totalToPay={helioTotalToPay}
      />
    </div>
  );
};

export default PurchaseTokenModal;
