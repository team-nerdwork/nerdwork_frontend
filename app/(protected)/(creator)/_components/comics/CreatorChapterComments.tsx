"use client";

import { getChapterComments } from "@/actions/comic.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Chapter, Comment } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2, MessageSquare } from "lucide-react";
import React, { useEffect, useState } from "react";

const CreatorChapterComments = ({ chapter }: { chapter: Chapter }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { data: comments, isLoading } = useQuery({
    queryKey: ["chapter-comments", chapter.id],
    queryFn: async () => {
      const res = await getChapterComments(chapter.id);
      if (!res.success) throw new Error(res.message);
      return res.data.data as Comment[];
    },
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MessageSquare size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="flex bg-[#1D1E21] font-inter p-2 border-none max-md:rounded-t-2xl text-white text-sm flex-col w-full sm:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle className="text-xl text-white font-semibold font-inter">
            Comments ({comments?.length ?? 0})
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="flex flex-col gap-4 mt-4">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin" />
              </div>
            ) : comments?.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No comments yet.
              </p>
            ) : (
              comments?.map((comment) => (
                <div key={comment.commentId} className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    {comment.image && <AvatarImage src={comment.image} />}
                    <AvatarFallback className="bg-nerd-blue">
                      {comment.readerName?.charAt(0) ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {comment.readerName ?? "Unknown"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default CreatorChapterComments;
