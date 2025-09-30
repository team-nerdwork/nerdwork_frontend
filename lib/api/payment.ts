"use server";
import axios from "axios";
import { axiosPost } from "./apiClientAuth";

export interface CreatePaymentLinkRequest {
  amount: number;
  name?: string;
  pricingCurrency?: string;
  redirectUrl?: string;
}

export interface CreatePaymentLinkResponse {
  success: boolean;
  payment: {
    id: string;
    price: string;
    currency?: {
      symbol: string;
    };
    url: string;
  };
  paylinkId: string;
}

export interface CreateWebhookRequest {
  paymentId: string;
}

export interface handlePaymentRequest {
  blockchainSymbol: string;
  redirectUrl: string;
  senderPK: string;
  transaction: string;
  data: {
    content: {
      status: string;
      statusToken: string;
      transactionSignature: string;
    };
  };
}

export interface CreateWebhookResponse {
  success: boolean;
  data: {
    id: string;
  };
}

/**
 * Creates a Helio payment link for NWT token purchase
 */
export const createPaymentLink = async (
  request: CreatePaymentLinkRequest
): Promise<{
  success: boolean;
  data?: CreatePaymentLinkResponse;
  message: string;
  status?: number;
}> => {
  try {
    const response = await axiosPost<CreatePaymentLinkResponse>(
      "/payment/helio/link",
      request
    );

    return {
      success: true,
      data: response.data,
      message: "Payment link created successfully.",
    };
  } catch (error: unknown) {
    console.error("Failed to create payment link:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error?.status,
        message:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Failed to create payment link. Please try again.",
      };
    }

    return {
      success: false,
      status: 500,
      message: "Failed to create payment link. Please try again.",
    };
  }
};

/**
 * Creates a webhook for payment notifications
 */
export const createPaymentWebhook = async (
  request: CreateWebhookRequest
): Promise<{
  success: boolean;
  data?: CreateWebhookResponse;
  message: string;
  status?: number;
}> => {
  try {
    const response = await axiosPost<CreateWebhookResponse>(
      "/payment/helio/webhook/create",
      request
    );

    return {
      success: true,
      data: response.data,
      message: "Webhook created successfully.",
    };
  } catch (error: unknown) {
    console.error("Failed to create webhook:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error?.status,
        message:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Failed to create webhook. Please try again.",
      };
    }

    return {
      success: false,
      status: 500,
      message: "Failed to create webhook. Please try again.",
    };
  }
};

// handlePayment
export const handlePayment = async (request: handlePaymentRequest) => {
  try {
    const response = await axiosPost("/payment/helio/handle", request);

    return {
      success: true,
      data: response.data,
      message: "NWT purchase successfully.",
    };
  } catch (error: unknown) {
    console.error("NWT purchase failed:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error?.status,
        message:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Failed to purchased NWT. Please try again.",
      };
    }
    return {
      success: false,
      status: 500,
      message: "Failed to purchase NWT. Please try again.",
    };
  }
};
