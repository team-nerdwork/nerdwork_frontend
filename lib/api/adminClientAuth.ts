/* eslint-disable @typescript-eslint/no-explicit-any */

import { auth } from "@/auth";
import axios, { AxiosResponse } from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function getAdminToken(): Promise<string> {
  try {
    const session = await auth();
    return session?.adminToken ?? "";
  } catch (error) {
    console.error("Error retrieving admin token:", error);
    return "";
  }
}

async function getAdminAuthHeader(): Promise<Record<string, string>> {
  const token = await getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function axiosGet<T = any>(
  url: string,
  params = {},
  contentType?: string,
  otherHeaders = {},
): Promise<AxiosResponse<T>> {
  const customContentType = contentType || "application/json";
  const headers = await getAdminAuthHeader();
  const config = {
    headers: {
      "Content-Type": customContentType,
      ...headers,
      ...otherHeaders,
    },
    params,
  };
  const fullUrl = `${apiUrl}${url}`;
  try {
    const response = await axios.get<T>(fullUrl, config);
    return response;
  } catch (error) {
    console.error(
      "Error in admin GET request to %s:",
      encodeURIComponent(fullUrl),
      error,
    );
    throw error;
  }
}

async function axiosPost<T = any, D = any>(
  url: string,
  body: D,
  params = {},
): Promise<AxiosResponse<T>> {
  const headers = await getAdminAuthHeader();
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    params,
  };
  const fullUrl = `${apiUrl}${url}`;
  try {
    const response = await axios.post<T>(fullUrl, body, config);
    return response;
  } catch (error) {
    console.error(
      "Error in admin POST request to %s:",
      encodeURIComponent(fullUrl),
      error,
    );
    throw error;
  }
}

async function axiosPatch<T = any, D = any>(
  url: string,
  body: D,
  params = {},
): Promise<AxiosResponse<T>> {
  const headers = await getAdminAuthHeader();
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    params,
  };
  const fullUrl = `${apiUrl}${url}`;
  try {
    const response = await axios.patch<T>(fullUrl, body, config);
    return response;
  } catch (error) {
    console.error(
      "Error in admin PATCH request to %s:",
      encodeURIComponent(fullUrl),
      error,
    );
    throw error;
  }
}

export { axiosGet, axiosPost, axiosPatch };
