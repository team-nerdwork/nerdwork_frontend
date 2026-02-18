"use server";

import { axiosGet, axiosPatch, axiosPost } from "@/lib/api/adminClientAuth";
import axios from "axios";
import type {
  AdminAuditLog,
  AdminComic,
  AdminCreator,
  AdminOverviewResponse,
  AdminPayout,
  AdminUser,
  ApiResult,
  FinanceSummary,
  MarketplaceSummary,
  Paginated,
} from "@/lib/types/admin";

const handleAdminError = <T>(
  error: unknown,
  fallbackMessage: string,
): ApiResult<T> => {
  if (axios.isAxiosError(error)) {
    return {
      success: false,
      status: error?.status ?? 500,
      message:
        error?.response?.data?.detail ??
        error?.response?.data?.message ??
        fallbackMessage,
    };
  }
  return {
    success: false,
    status: 500,
    message: fallbackMessage,
  };
};

export const getAdminOverview = async (): Promise<
  ApiResult<AdminOverviewResponse>
> => {
  try {
    const response = await axiosGet("/admin/overview");
    return {
      success: true,
      data: response.data,
      status: response?.status ?? 200,
    };
  } catch (error: unknown) {
    return handleAdminError<AdminOverviewResponse>(
      error,
      "Failed to load admin overview.",
    );
  }
};

export const getAdminUsers = async (params: {
  query?: string;
  status?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<ApiResult<Paginated<AdminUser>>> => {
  try {
    const response = await axiosGet("/admin/users", params);
    return {
      success: true,
      data: response.data,
      status: response?.status ?? 200,
    };
  } catch (error: unknown) {
    return handleAdminError<Paginated<AdminUser>>(
      error,
      "Failed to load users.",
    );
  }
};

export const updateAdminUserStatus = async (
  authUserId: string,
  payload: { status: string; durationDays?: number; reason?: string },
): Promise<ApiResult<{ user?: AdminUser }>> => {
  try {
    const response = await axiosPatch(
      `/admin/users/${authUserId}/status`,
      payload,
    );
    return {
      success: true,
      data: response.data,
      status: response?.status ?? 200,
    };
  } catch (error: unknown) {
    return handleAdminError<{ user?: AdminUser }>(
      error,
      "Failed to update user status.",
    );
  }
};

export const getAdminCreators = async (params: {
  query?: string;
  status?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<ApiResult<Paginated<AdminCreator>>> => {
  try {
    const response = await axiosGet("/admin/creators", params);
    return {
      success: true,
      data: response.data,
      status: response?.status ?? 200,
    };
  } catch (error: unknown) {
    return handleAdminError<Paginated<AdminCreator>>(
      error,
      "Failed to load creators.",
    );
  }
};

export const updateAdminCreatorVerification = async (
  creatorId: string,
  payload: { status: string; note?: string },
): Promise<ApiResult<{ creator?: AdminCreator }>> => {
  try {
    const response = await axiosPatch(
      `/admin/creators/${creatorId}/verify`,
      payload,
    );
    return {
      success: true,
      data: response.data,
      status: response?.status ?? 200,
    };
  } catch (error: unknown) {
    return handleAdminError<{ creator?: AdminCreator }>(
      error,
      "Failed to update creator status.",
    );
  }
};

export const getAdminComics = async (params: {
  query?: string;
  status?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<ApiResult<Paginated<AdminComic>>> => {
  try {
    const response = await axiosGet("/admin/comics", params);
    return {
      success: true,
      data: response.data,
      status: response?.status ?? 200,
    };
  } catch (error: unknown) {
    return handleAdminError<Paginated<AdminComic>>(
      error,
      "Failed to load comics.",
    );
  }
};

export const updateAdminComicStatus = async (
  comicId: string,
  payload: { status: string; note?: string },
): Promise<ApiResult<{ comic?: AdminComic }>> => {
  try {
    const response = await axiosPatch(
      `/admin/comics/${comicId}/moderate`,
      payload,
    );
    return {
      success: true,
      data: response.data,
      status: response?.status ?? 200,
    };
  } catch (error: unknown) {
    return handleAdminError<{ comic?: AdminComic }>(
      error,
      "Failed to update comic status.",
    );
  }
};

export const getMarketplaceSummary = async (): Promise<
  ApiResult<MarketplaceSummary>
> => {
  try {
    const response = await axiosGet("/admin/marketplace/summary");
    return {
      success: true,
      data: response.data,
      status: response?.status ?? 200,
    };
  } catch (error: unknown) {
    return handleAdminError<MarketplaceSummary>(
      error,
      "Failed to load marketplace summary.",
    );
  }
};

export const getFinanceSummary = async (): Promise<ApiResult<FinanceSummary>> => {
  try {
    const response = await axiosGet("/admin/finance/summary");
    return {
      success: true,
      data: response.data,
      status: response?.status ?? 200,
    };
  } catch (error: unknown) {
    return handleAdminError<FinanceSummary>(
      error,
      "Failed to load finance summary.",
    );
  }
};

export const getAdminPayouts = async (params: {
  status?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<ApiResult<Paginated<AdminPayout>>> => {
  try {
    const response = await axiosGet("/admin/finance/payouts", params);
    return {
      success: true,
      data: response.data,
      status: response?.status ?? 200,
    };
  } catch (error: unknown) {
    return handleAdminError<Paginated<AdminPayout>>(
      error,
      "Failed to load payouts.",
    );
  }
};

export const processAdminPayout = async (
  payoutId: string,
  payload: { status?: string } = {},
): Promise<ApiResult<{ payout?: AdminPayout }>> => {
  try {
    const response = await axiosPost(
      `/admin/finance/payouts/${payoutId}/process`,
      payload,
    );
    return {
      success: true,
      data: response.data,
      status: response?.status ?? 200,
    };
  } catch (error: unknown) {
    return handleAdminError<{ payout?: AdminPayout }>(
      error,
      "Failed to process payout.",
    );
  }
};

export const getAuditLogs = async (params: {
  page?: number;
  pageSize?: number;
} = {}): Promise<ApiResult<Paginated<AdminAuditLog>>> => {
  try {
    const response = await axiosGet("/admin/audit-logs", params);
    return {
      success: true,
      data: response.data,
      status: response?.status ?? 200,
    };
  } catch (error: unknown) {
    return handleAdminError<Paginated<AdminAuditLog>>(
      error,
      "Failed to load audit logs.",
    );
  }
};
