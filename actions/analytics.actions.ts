"use server";

import { axiosGet } from "@/lib/api/apiClientAuth";
import axios from "axios";

export const getCreatorAnalytics = async () => {
  try {
    const response = await axiosGet(`/analytics/creator`);

    return {
      success: true,
      data: response.data,
      message: "Creator analytics retrieved successfully.",
    };
  } catch (error: unknown) {
    console.error("Analytics retrieval failed:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error?.status,
        message:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Failed to retrieve analytics. Please try again.",
      };
    }
    return {
      success: false,
      status: 500,
      message: "Failed to retrieve analytics. Please try again.",
    };
  }
};
