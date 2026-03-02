import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNFT,
  deleteNFT,
  getCreatorNFTs,
  getMarketplaceNFTs,
  getPurchasedNFTs,
  getSingleListedNFT,
  getSingleNFT,
  listNFT,
  purchaseNFT,
} from "@/actions/nfts.actions";
import { NFTFormData } from "@/lib/schema";
import { handleUnauthorized } from "@/lib/utils/actionHandler";

// Query Keys
export const nftKeys = {
  all: ["nfts"] as const,
  creatorNfts: () => [...nftKeys.all, "creator"] as const,
  singleNft: (id: string) => [...nftKeys.all, "single", id] as const,
  marketplace: () => [...nftKeys.all, "marketplace"] as const,
  singleListed: (id: string) => [...nftKeys.all, "listed", id] as const,
  purchased: () => [...nftKeys.all, "purchased"] as const,
};

// CREATOR QUERIES

/**
 * Hook to fetch all NFTs created by the current creator
 */
export const useGetCreatorNFTs = () => {
  return useQuery({
    queryKey: nftKeys.creatorNfts(),
    queryFn: async () => {
      const response = await getCreatorNFTs();

      // Handle 401 unauthorized
      if (handleUnauthorized(response)) {
        throw new Error("Unauthorized");
      }

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch creator NFTs");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

/**
 * Hook to fetch a single NFT by ID
 */
export const useGetSingleNFT = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: nftKeys.singleNft(id),
    queryFn: async () => {
      const response = await getSingleNFT(id);

      // Handle 401 unauthorized
      if (handleUnauthorized(response)) {
        throw new Error("Unauthorized");
      }

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch NFT");
      }
      return response.data;
    },
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

// USER QUERIES

/**
 * Hook to fetch all marketplace NFTs
 */
export const useGetMarketplaceNFTs = () => {
  return useQuery({
    queryKey: nftKeys.marketplace(),
    queryFn: async () => {
      const response = await getMarketplaceNFTs();

      // Handle 401 unauthorized
      if (handleUnauthorized(response)) {
        throw new Error("Unauthorized");
      }

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch marketplace NFTs");
      }
      return response.data;
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    refetchOnWindowFocus: true,
  });
};

/**
 * Hook to fetch a single listed NFT by listing ID
 */
export const useGetSingleListedNFT = (
  listingId: string,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: nftKeys.singleListed(listingId),
    queryFn: async () => {
      const response = await getSingleListedNFT(listingId);

      // Handle 401 unauthorized
      if (handleUnauthorized(response)) {
        throw new Error("Unauthorized");
      }

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch listed NFT");
      }
      return response.data;
    },
    enabled: !!listingId && enabled,
    staleTime: 3 * 60 * 1000,
  });
};

/**
 * Hook to fetch all purchased NFTs by the current user
 */
export const useGetPurchasedNFTs = () => {
  return useQuery({
    queryKey: nftKeys.purchased(),
    queryFn: async () => {
      const response = await getPurchasedNFTs();

      // Handle 401 unauthorized
      if (handleUnauthorized(response)) {
        throw new Error("Unauthorized");
      }

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch purchased NFTs");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

// CREATOR MUTATIONS

/**
 * Hook to create a new NFT
 */
export const useCreateNFT = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NFTFormData) => {
      const response = await createNFT(data);

      // Handle 401 unauthorized
      if (handleUnauthorized(response)) {
        throw new Error("Unauthorized");
      }

      if (!response?.success) {
        throw new Error(response?.message || "Failed to create NFT");
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch creator NFTs
      queryClient.invalidateQueries({ queryKey: nftKeys.creatorNfts() });
    },
  });
};

/**
 * Hook to list an NFT for sale
 */
export const useListNFT = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ nftId, price }: { nftId: string; price: number }) => {
      const response = await listNFT(nftId, price);

      // Handle 401 unauthorized
      if (handleUnauthorized(response)) {
        throw new Error("Unauthorized");
      }

      if (!response.success) {
        throw new Error(response.message || "Failed to list NFT");
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate both creator NFTs and marketplace NFTs
      queryClient.invalidateQueries({ queryKey: nftKeys.creatorNfts() });
      queryClient.invalidateQueries({ queryKey: nftKeys.marketplace() });
    },
  });
};

/**
 * Hook to delete an NFT
 */
export const useDeleteNFT = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteNFT(id);

      // Handle 401 unauthorized
      if (handleUnauthorized(response)) {
        throw new Error("Unauthorized");
      }

      if (!response.success) {
        throw new Error(response.message || "Failed to delete NFT");
      }
      return response;
    },
    onSuccess: (_, deletedId) => {
      // Invalidate creator NFTs list
      queryClient.invalidateQueries({ queryKey: nftKeys.creatorNfts() });
      // Remove the specific NFT from cache
      queryClient.removeQueries({ queryKey: nftKeys.singleNft(deletedId) });
    },
  });
};

// USER MUTATIONS

/**
 * Hook to purchase an NFT
 */
export const usePurchaseNFT = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listingId,
      quantity,
    }: {
      listingId: string;
      quantity: number;
    }) => {
      const response = await purchaseNFT(listingId, quantity);
      console.log("Purchase response:", response); // Debug log to check the response structure

      // Handle 401 unauthorized
      if (handleUnauthorized(response)) {
        throw new Error("Unauthorized");
      }

      if (!response?.success) {
        throw new Error(response?.message || "Failed to purchase NFT");
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate purchased NFTs and marketplace
      queryClient.invalidateQueries({ queryKey: nftKeys.purchased() });
      queryClient.invalidateQueries({ queryKey: nftKeys.marketplace() });
    },
  });
};
