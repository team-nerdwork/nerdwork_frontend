"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/assets/nerdwork.png";
import Google from "@/assets/socials/google.svg";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Button } from "@/components/ui/button";

const AdminSignInClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const router = useRouter();
  const { status, data: session } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.adminToken) {
      router.push(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  const isAuthenticated = status === "authenticated";
  const isAdmin = !!session?.adminToken;

  return (
    <main className="bg-[#171719] min-h-screen w-full font-inter text-white flex flex-col items-center justify-between py-20 px-5">
      <Link href={"/"}>
        <Image src={Logo} width={146} height={40} alt="nerdwork logo" />
      </Link>
      <section className="w-full max-w-[400px] text-center flex flex-col items-center">
        <h4 className="text-2xl font-semibold">Nerdwork+ Admin Access</h4>
        <p className="text-[#707073] text-sm mt-3">
          Sign in with a verified admin account.
        </p>

        {isAuthenticated && !isAdmin ? (
          <div className="mt-10 w-full text-left space-y-4">
            <div className="rounded-[12px] border border-[#292A2E] bg-[#1D1E21] px-4 py-3 text-sm text-[#D1D5DB]">
              Your account is signed in but does not have admin access.
            </div>
            <Button
              variant="outline"
              className="w-full border-[#292A2E] text-white"
              onClick={() => signOut({ callbackUrl: "/admin/signin" })}
            >
              Sign out and try another account
            </Button>
          </div>
        ) : (
          <LoadingButton
            type="button"
            variant={"secondary"}
            className="mt-10 max-w-[352px] w-full flex items-center"
            isLoading={isLoading}
            loadingText="Redirecting to Google..."
            spinnerClassName="mr-3 size-4"
            onClick={async () => {
              try {
                setIsLoading(true);
                await signIn("google", { callbackUrl });
              } finally {
                setIsLoading(false);
              }
            }}
          >
            <Image src={Google} width={18} height={18} alt="Google logo" />
            Continue with Google
          </LoadingButton>
        )}
      </section>
      <p className="text-xs text-[#707073] text-center max-w-[420px]">
        Access is restricted to authorized admins. If you need access, contact
        the Nerdwork team.
      </p>
    </main>
  );
};

export default AdminSignInClient;
