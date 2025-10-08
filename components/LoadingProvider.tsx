"use client";

import LoadingScreen from "@/components/LoadingScreen";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function LoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  // Initial page load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Trigger animation on route change
  useEffect(() => {
    setIsLoading(true);

    const checkPageReady = () => {
      const checks = [
        // DOM is ready
        () => document.readyState === "complete",
        // No pending images
        () => Array.from(document.images).every((img) => img.complete),
        // No active fetch requests (if you track them)
        () => !document.querySelector('[data-loading="true"]'),
      ];

      const isReady = checks.every((check) => check());

      if (isReady) {
        setIsLoading(false);
      } else {
        setTimeout(checkPageReady, 50);
      }
    };

    setTimeout(checkPageReady, 100);

    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, [pathname]);

  return (
    <>
      <LoadingScreen
        isLoading={isLoading}
        logoSrc={"/nerdwork.svg"}
        logoAlt="Nerwork Logo"
      />
      {children}
    </>
  );
}
