import { getCreatorProfile, getReaderProfile } from "@/actions/profile.actions";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";

export const useUserSession = (id?: string) => {
  const { data: session } = useSession();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["user", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        return null;
      }

      let creatorProfile = null;
      let readerProfile = null;

      // Fetch creator profile if the user is a creator
      if (session?.cProfile) {
        const creatorData = await getCreatorProfile();
        if (creatorData?.success && creatorData?.data?.profile) {
          creatorProfile = creatorData.data.profile;
        }
      }

      // Fetch reader profile if the user is a reader
      if (session?.rProfile) {
        const readerData = await getReaderProfile();
        if (readerData?.success && readerData?.data?.profile) {
          readerProfile = readerData.data.profile;
        }
      }

      if (!creatorProfile && !readerProfile) {
        signOut({ callbackUrl: "/signin" });
        return null;
      }

      // Return an object containing both profiles.
      return { creatorProfile, readerProfile };
    },
    enabled: !!id || !!session?.user?.id,
    placeholderData: keepPreviousData,
    refetchInterval: 3 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  return {
    profile: data,
    isLoading,
    error,
    refetch,
  };
};
