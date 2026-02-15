import React from "react";
import ReaderOnboarding from "../../_components/ReaderOnboarding";
import CreatorOnboarding from "../../_components/CreatorOnboarding";

const UserOnboarding = async ({
  params,
  searchParams,
}: {
  params: Promise<{ userRole: string }>;
  searchParams?: Promise<{ redirect?: string }>;
}) => {
  const { userRole } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const redirectUrl = resolvedSearchParams?.redirect;
  return (
    <>
      {userRole == "reader" ? (
        <ReaderOnboarding redirectUrl={redirectUrl} />
      ) : (
        <CreatorOnboarding redirectUrl={redirectUrl} />
      )}
    </>
  );
};

export default UserOnboarding;
