"use server";

import axios from "axios";
import { axiosPost } from "./apiClientAuth";
import type {
  PaystackInitializeRequest,
  PaystackInitializeResponse,
  PaystackVerifyRequest,
  PaystackVerifyResponse,
} from "@/lib/types/payment.types";

/**
 * Initializes a Paystack transaction on the backend.
 * The backend creates the transaction with Paystack and returns
 * the reference needed for the inline popup.
 */
export const initializePaystackPayment = async (
  request: PaystackInitializeRequest
): Promise<{
  success: boolean;
  data?: PaystackInitializeResponse;
  message: string;
  status?: number;
}> => {
  try {
    const response = await axiosPost<PaystackInitializeResponse>(
      "/payment/paystack/initialize",
      request
    );

    return {
      success: true,
      data: response.data,
      message: "Payment initialized successfully.",
    };
  } catch (error: unknown) {
    console.error("Failed to initialize Paystack payment:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error?.status,
        message:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Failed to initialize payment. Please try again.",
      };
    }

    return {
      success: false,
      status: 500,
      message: "Failed to initialize payment. Please try again.",
    };
  }
};

/**
 * Verifies a Paystack transaction after the popup closes successfully.
 * The backend verifies with Paystack's API and credits NWT if valid.
 */
export const verifyPaystackPayment = async (
  request: PaystackVerifyRequest
): Promise<{
  success: boolean;
  data?: PaystackVerifyResponse;
  message: string;
  status?: number;
}> => {
  try {
    const response = await axiosPost<PaystackVerifyResponse>(
      "/payment/paystack/verify",
      request
    );

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
