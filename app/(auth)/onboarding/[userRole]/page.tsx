import React from "react";
import ReaderOnboarding from "../../_components/ReaderOnboarding";
import CreatorOnboarding from "../../_components/CreatorOnboarding";

const UserOnboarding = ({
  params,
  searchParams,
}: {
  params: { userRole: string };
  searchParams?: { redirect?: string };
}) => {
  const { userRole } = params;
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
