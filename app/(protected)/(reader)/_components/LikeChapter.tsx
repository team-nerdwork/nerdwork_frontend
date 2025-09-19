"use client";
import { likeChapterAction } from "@/actions/comic.actions";
import { Chapter } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const LikeChapter = ({ chapter }: { chapter: Chapter }) => {
  const [isLiked, setIsLiked] = React.useState(chapter?.hasLiked);
  const queryClient = useQueryClient();

  const handleLike = async () => {
    try {
      setIsLiked((prev) => !prev);

      const response = await likeChapterAction(chapter.id);

      if (!response?.success) {
        setIsLiked((prev) => !prev);
        toast.error(
          response?.message ??
            "An error occurred while processing your request."
        );
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["reader-chapters"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["comic"],
      });
    } catch (err) {
      setIsLiked((prev) => !prev);
      toast.error("An unexpected error occurred.");
      console.error(err);
    }
  };

  return (
    <button onClick={handleLike} className={`cursor-pointer group`}>
      {isLiked ? (
        <Heart size={20} fill="red" className="hover:fill-transparent" />
      ) : (
        <Heart size={20} className="hover:fill-red-500" />
      )}
    </button>
  );
};

export default LikeChapter;
