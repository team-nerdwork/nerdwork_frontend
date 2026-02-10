import React, { use } from "react";
import ReaderOnboarding from "../../_components/ReaderOnboarding";
import CreatorOnboarding from "../../_components/CreatorOnboarding";

const UserOnboarding = ({
  params,
  searchParams,
}: {
  params: Promise<{ userRole: string }>;
  searchParams?: { redirect?: string };
}) => {
  const { userRole } = use(params);
  const redirectUrl = searchParams?.redirect;
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
