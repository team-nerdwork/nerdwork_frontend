"use client";
import { addChapterComment, getChapterComments } from "@/actions/comic.actions";
import { Chapter, Comment } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MessageSquareMore, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ChapterComment = ({ chapter }: { chapter: Chapter }) => {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
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

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      console.log("Submitting comment:", content);
      return await addChapterComment(chapter.id, content);
    },
    onSuccess: async (response) => {
      if (!response?.success) {
        toast.error(
          response?.message ??
            "An error occurred while processing your request."
        );
        return;
      }

      setContent("");
      await queryClient.invalidateQueries({
        queryKey: ["chapter-comments", chapter.id],
      });
      toast.success("Comment added successfully");
    },
    onError: (err) => {
      toast.error("An unexpected error occurred.");
      console.error(err);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    mutate();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className={`cursor-pointer group relative`}>
          <MessageSquareMore size={20} />
        </button>
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
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              comments?.map((comment) => (
                <div key={comment.commentId} className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    {comment.image && <AvatarImage src={comment.image} />}
                    <AvatarFallback className="bg-nerd-blue">
                      {comment.username?.charAt(0) ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {comment.username ?? "Unknown"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2 items-end">
          <Textarea
            placeholder="Add a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isPending}
            className="min-h-[80px] resize-none border-nerd-muted"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isPending || !content.trim()}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default ChapterComment;
