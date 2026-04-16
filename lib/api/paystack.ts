"use server";

import axios from "axios";
import { axiosPost } from "./apiClientAuth";

/**
 * Verifies a Paystack transaction after the popup closes successfully.
 * Uses the unified payment verification endpoint.
 */
export const verifyPaystackPayment = async (request: {
  reference: string;
}): Promise<{
  success: boolean;
  data?: unknown;
  message: string;
  status?: number;
}> => {
  try {
    const response = await axiosPost("/payment/verify", {
      paymentMethod: "paystack",
      reference: request.reference,
    });

    console.log("Paystack payment verification request payload:", {
      paymentMethod: "paystack",
      reference: request.reference,
    });
    console.log("Paystack payment verification response:", response.data);

    return {
      success: true,
      data: response.data,
      message: "Payment verified successfully.",
    };
  } catch (error: unknown) {
    console.error("Failed to verify Paystack payment:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error?.status,
        message:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Failed to verify payment. Please try again.",
      };
    }

    return {
      success: false,
      status: 500,
      message: "Failed to verify payment. Please try again.",
    };
  }
};
