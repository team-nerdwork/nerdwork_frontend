"use server";

import { axiosDelete, axiosGet, axiosPost } from "@/lib/api/apiClientAuth";
import { NFTFormData } from "@/lib/schema";
import axios from "axios";

// CREATOR ENDPOINTS

export const createNFT = async (data: NFTFormData) => {
  try {
    const requestBody = {
      name: data.name,
      description: data.description,
      imageKey: data.coverImage,
      supply: data.supply,
      tags: data.tags,
      properties: data.properties.map((prop) => ({
        trait_type: prop.type,
        name: prop.name,
      })),
    };

    console.log("Creating NFT with data:", requestBody);

    // const response = await axiosPost("/nft", requestBody);

    // return {
    //   success: true,
    //   data: response.data,
    //   message: "NFT created successfully.",
    // };
  } catch (error: unknown) {
    console.error("NFT listing failed:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error?.status,
        message:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Failed to create NFT. Please try again.",
      };
    }
    return {
      success: false,
      status: 500,
      message: "Failed to create NFT. Please try again.",
    };
  }
};

export const getCreatorNFTs = async () => {
  try {
    const response = await axiosGet("/nft/my");

    return {
      success: true,
      data: response.data,
      message: "Creator nfts retrieved successfully.",
    };
  } catch (error: unknown) {
    console.error("Creator nfts retrieval failed:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error?.status,
        message:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Failed to retrieve creator nfts. Please try again.",
      };
    }
    return {
      success: false,
      status: 500,
      message: "Failed to retrieve creator nfts. Please try again.",
    };
  }
};

export const getSingleNFT = async (id: string) => {
  try {
    const response = await axiosGet(`/nft/my/${id}`);

    return {
      success: true,
      data: response.data,
      message: "Single creator nft retrieved successfully.",
    };
  } catch (error: unknown) {
    console.error("Single creator nft retrieval failed:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error?.status,
        message:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Failed to retrieve Single creator nft. Please try again.",
      };
    }
    return {
      success: false,
      status: 500,
      message: "Failed to retrieve Single creator nft. Please try again.",
    };
  }
};

export const listNFT = async (nftId: string, price: number) => {
  try {
    const requestBody = {
      nftId,
      price,
    };

    console.log("Listing NFT with data:", requestBody);

    const response = await axiosPost("/nft/list", requestBody);

    return {
      success: true,
      data: response.data,
      message: "NFT listed successfully.",
    };
  } catch (error: unknown) {
    console.error("NFT listing failed:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error?.status,
        message:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Failed to list NFT. Please try again.",
      };
    }
    return {
      success: false,
      status: 500,
      message: "Failed to list NFT. Please try again.",
    };
  }
};

export const deleteNFT = async (id: string) => {
  try {
    console.log("Deleting NFT with id:", id);

    const response = await axiosDelete(`/nft/${id}`);

    return {
      success: true,
      data: response.data,
      message: "NFT deleted successfully.",
    };
  } catch (error: unknown) {
    console.error("NFT deletion failed:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error?.status,
        message:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Failed to delete NFT. Please try again.",
      };
    }
    return {
      success: false,
      status: 500,
      message: "Failed to delete NFT. Please try again.",
    };
  }
};

// USER ENDPOINTS

export const getMarketplaceNFTs = async () => {
  try {
    const response = await axiosGet("/marketplace");

    return {
      success: true,
      data: response.data,
      message: "Marketplace nfts retrieved successfully.",
    };
  } catch (error: unknown) {
    console.error("Marketplace nfts retrieval failed:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error?.status,
        message:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Failed to retrieve marketplace nfts. Please try again.",
      };
    }
    return {
      success: false,
      status: 500,
      message: "Failed to retrieve marketplace nfts. Please try again.",
    };
  }
};

export const getSingleListedNFT = async (listingId: string) => {
  try {
    const response = await axiosGet(`/marketplace/${listingId}`);

    return {
      success: true,
      data: response.data,
      message: "Single listed NFT retrieved successfully.",
    };
  } catch (error: unknown) {
    console.error("Single listed NFT retrieval failed:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error?.status,
        message:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Failed to retrieve single listed NFT. Please try again.",
      };
    }
    return {
      success: false,
      status: 500,
      message: "Failed to retrieve single listed NFT. Please try again.",
    };
  }
};

export const getPurchasedNFTs = async () => {
  try {
    const response = await axiosGet("/nfts/my-purchases");

    return {
      success: true,
      data: response.data,
      message: "Purchased NFTs retrieved successfully.",
    };
  } catch (error: unknown) {
    console.error("Purchased NFTs retrieval failed:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error?.status,
        message:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Failed to retrieve purchased NFTs. Please try again.",
      };
    }
    return {
      success: false,
      status: 500,
      message: "Failed to retrieve purchased NFTs. Please try again.",
    };
  }
};

export const purchaseNFT = async (listingId: string, quantity: number) => {
  try {
    const requestBody = {
      listingId,
      quantity,
    };

    console.log("Purchasing NFT with data:", requestBody);

    // const response = await axiosPost("/nft/buy", requestBody);

    // return {
    //   success: true,
    //   data: response.data,
    //   message: "NFT purchased successfully.",
    // };
  } catch (error: unknown) {
    console.error("NFT purchase failed:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error?.status,
        message:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Failed to purchase NFT. Please try again.",
      };
    }
    return {
      success: false,
      status: 500,
      message: "Failed to purchase NFT. Please try again.",
    };
  }
};
