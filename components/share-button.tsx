"use client";

import { Button } from "@/components/ui/button";
import { Check, Share2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ShareButtonProps {
  title?: string;
  text?: string;
  url: string;
  className?: string;
}

export default function ShareButton({
  title = "Check out this comic!",
  text = "Read this amazing comic on Nerdwork.",
  url,
  className,
}: ShareButtonProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  url = baseUrl + url;
  console.log("ShareButton URL:", url);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleShare = async () => {
    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast.error("Failed to copy link");
      }
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={className}
          onClick={handleShare}
        >
          {copied ? (
            <Check className="w-5 h-5" />
          ) : (
            <Share2 className="w-5 h-5" />
          )}
          <span className="sr-only">Share</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Share button</p>
      </TooltipContent>
    </Tooltip>
  );
}
