"use client";

import React from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { usePaystackPayment } from "react-paystack";
import { verifyPaystackPayment } from "@/lib/api/paystack";
import { useUserSession } from "@/lib/api/queries";
import { useSession } from "next-auth/react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FiatCurrency } from "@/lib/types/payment.types";
import { EXCHANGE_RATES, TRANSACTION_FEE_RATE } from "@/lib/constants";

interface PaystackCheckoutProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  nwtAmount: number;
  currency: FiatCurrency;
}

function generateReference() {
  return `nwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

const PaystackCheckout: React.FC<PaystackCheckoutProps> = ({
  isOpen,
  onOpenChange,
  nwtAmount,
  currency,
}) => {
  const [paymentStatus, setPaymentStatus] = React.useState<
    "idle" | "popup" | "verifying" | "success" | "failed"
  >("idle");
  const [drawerVisible, setDrawerVisible] = React.useState(false);

  const { data: session } = useSession();
  const { refetch } = useUserSession();

  const rate = EXCHANGE_RATES[currency];
  const fiatAmount = nwtAmount * rate.ratePerNWT;
  const transactionFee = fiatAmount * TRANSACTION_FEE_RATE;
  const totalFiat = fiatAmount + transactionFee;
  const amountInSmallestUnit = Math.round(
    totalFiat * rate.smallestUnitMultiplier
  );

  // Sync drawer visibility with parent's isOpen (only when not in popup state)
  React.useEffect(() => {
    if (isOpen && paymentStatus !== "popup") {
      setDrawerVisible(true);
    }
    if (!isOpen) {
      setDrawerVisible(false);
      setPaymentStatus("idle");
    }
  }, [isOpen, paymentStatus]);

  const handleDrawerChange = (open: boolean) => {
    setDrawerVisible(open);
    if (!open && paymentStatus !== "popup") {
      onOpenChange(false);
    }
  };

  // Called by PaystackPopupTrigger right before opening the popup
  const handlePopupOpen = () => {
    setPaymentStatus("popup");
    setDrawerVisible(false); // Close drawer so popup is clickable
  };

  const handleSuccess = async (reference: string) => {
    // Re-open drawer for verification state
    setPaymentStatus("verifying");
    setDrawerVisible(true);
    toast.info("Verifying payment...");

    try {
      const result = await verifyPaystackPayment({ reference });

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success("Payment completed successfully!");
      setPaymentStatus("success");
      await refetch();

      setTimeout(() => {
        onOpenChange(false);
        setPaymentStatus("idle");
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Paystack verification error:", error);
      toast.error("Payment verification failed. Please contact support.");
      setPaymentStatus("failed");
    }
  };

  const handlePopupClose = () => {
    // User closed the Paystack popup without completing
    setPaymentStatus("idle");
    setDrawerVisible(true); // Re-open drawer
    toast.info("Payment cancelled.");
  };

  // Show the drawer for idle, verifying, success, failed states
  // Hide it during "popup" state so Paystack popup is accessible
  const showDrawer = drawerVisible && paymentStatus !== "popup";

  return (
    <>
      <Drawer open={showDrawer} onOpenChange={handleDrawerChange}>
        <DrawerContent className="bg-[#171719] text-white border-none flex flex-col h-[90vh]">
          <ScrollArea className="flex-1 overflow-y-auto px-10 max-md:px-5">
            <div className="space-y-4 py-4">
              <DrawerHeader>
                <DrawerTitle className="text-2xl text-white justify-center flex items-center gap-2">
                  Complete Payment
                </DrawerTitle>
                <DrawerDescription className="text-nerd-muted">
                  Purchase NWT tokens using{" "}
                  {currency === "NGN" ? "Naira" : "US Dollars"}
                </DrawerDescription>
              </DrawerHeader>

              {/* Payment Summary */}
              <div className="bg-[#1D1E21] rounded-lg p-4 space-y-3 border border-[#292A2E]">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Payment Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-nerd-muted">
                    <span>NWT Tokens</span>
                    <span className="text-white font-medium">
                      {nwtAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-nerd-muted">
                    <span>{currency} Equivalent</span>
                    <span className="text-white">
                      {rate.symbol}
                      {fiatAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-nerd-muted">
                    <span>Transaction Fee (1%)</span>
                    <span className="text-white">
                      {rate.symbol}
                      {transactionFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-[#292A2E] pt-2 mt-2">
                    <div className="flex justify-between text-white font-semibold">
                      <span>Total to Pay</span>
                      <span>
                        {rate.symbol}
                        {totalFiat.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Action / Status */}
              <div className="min-h-[200px] flex items-center justify-center">
                {paymentStatus === "idle" && (
                  <PaystackPopupTrigger
                    email={session?.user?.email ?? ""}
                    amount={amountInSmallestUnit}
                    currency={currency}
                    nwtAmount={nwtAmount}
                    totalFiat={totalFiat}
                    symbol={rate.symbol}
                    onPopupOpen={handlePopupOpen}
                    onSuccess={handleSuccess}
                    onClose={handlePopupClose}
                  />
                )}

                {paymentStatus === "verifying" && (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="text-nerd-muted">
                      Verifying payment...
                    </span>
                  </div>
                )}

                {paymentStatus === "success" && (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Payment Successful!
                      </h3>
                      <p className="text-nerd-muted">
                        Your NWT tokens will be credited to your wallet shortly.
                      </p>
                    </div>
                  </div>
                )}

                {paymentStatus === "failed" && (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <AlertCircle className="h-16 w-16 text-red-500" />
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Payment Failed
                      </h3>
                      <p className="text-nerd-muted">
                        There was an issue processing your payment. Please try
                        again.
                      </p>
                      <Button
                        variant="primary"
                        className="mt-4"
                        onClick={() => setPaymentStatus("idle")}
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Security Notice */}
              <div className="bg-[#1D1E21] rounded-lg p-3 border border-[#292A2E]">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">
                      Secure Payment
                    </p>
                    <p className="text-xs text-nerd-muted">
                      Your payment is processed securely through Paystack&apos;s
                      encrypted payment system. Your card details are never
                      stored on our servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="flex items-center justify-center py-2 border-t border-[#292A2E]">
            <p className="text-xs text-nerd-muted">Powered by Paystack</p>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Hidden trigger component — mounted during popup state to keep the hook alive */}
      {paymentStatus === "popup" && (
        <PaystackPopupTrigger
          email={session?.user?.email ?? ""}
          amount={amountInSmallestUnit}
          currency={currency}
          nwtAmount={nwtAmount}
          totalFiat={totalFiat}
          symbol={rate.symbol}
          onPopupOpen={handlePopupOpen}
          onSuccess={handleSuccess}
          onClose={handlePopupClose}
          hidden
        />
      )}
    </>
  );
};

/**
 * Inner component that wraps usePaystackPayment hook.
 * Separated because the hook must be called at component level.
 */
function PaystackPopupTrigger({
  email,
  amount,
  currency,
  nwtAmount,
  totalFiat,
  symbol,
  onPopupOpen,
  onSuccess,
  onClose,
  hidden = false,
}: {
  email: string;
  amount: number;
  currency: FiatCurrency;
  nwtAmount: number;
  totalFiat: number;
  symbol: string;
  onPopupOpen: () => void;
  onSuccess: (reference: string) => void;
  onClose: () => void;
  hidden?: boolean;
}) {
  const reference = React.useMemo(() => generateReference(), []);

  const initializePayment = usePaystackPayment({
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    email,
    amount,
    currency,
    reference,
    metadata: {
      custom_fields: [
        {
          display_name: "NWT Tokens",
          variable_name: "nwt_amount",
          value: nwtAmount,
        },
      ],
    },
  });

  const handlePay = React.useCallback(() => {
    // Close the drawer first, then open the Paystack popup
    onPopupOpen();

    // Small delay to let the drawer close before popup opens
    setTimeout(() => {
      initializePayment({
        onSuccess: (response) => {
          onSuccess(response?.reference ?? reference);
        },
        onClose,
      });
    }, 300);
  }, [initializePayment, onPopupOpen, onSuccess, onClose, reference]);

  if (hidden) {
    // Mounted just to keep the hook alive during popup state
    return null;
  }

  return (
    <Button variant="primary" className="w-full" onClick={handlePay}>
      Pay {symbol}
      {totalFiat.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}{" "}
      with Paystack
    </Button>
  );
}

export default PaystackCheckout;
