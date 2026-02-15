"use server";

import { axiosPost } from "@/lib/api/apiClient";
import axios from "axios";

export const googleAuth = async (idToken: string) => {
  try {
    const response = await axiosPost("/auth/signin", { idToken });

    return {
      success: true,
      data: response.data,
      message: "Authentication Successful",
      status: response?.status ?? 200,
    };
  } catch (error: unknown) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error?.status ?? 500,
        message:
          error?.response?.data?.detail ??
          error.response?.data.message ??
          "Google sign in failed. Please try again.",
      };
    }
    return {
      success: false,
      status: 500,
      message: "Google sign in failed. Please try again.",
    };
  }
};

export const adminAuth = async (idToken: string) => {
  try {
    const response = await axiosPost("/admin/auth/signin", { idToken });

    return {
      success: true,
      data: response.data,
      message: "Admin authentication successful",
      status: response?.status ?? 200,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error?.status ?? 500,
        message:
          error?.response?.data?.detail ??
          error.response?.data.message ??
          "Admin sign in failed.",
      };
    }
    return {
      success: false,
      status: 500,
      message: "Admin sign in failed.",
    };
  }
};
