"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImageIcon, Loader2, Trash } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { ComicSeriesFormData, NFTFormData } from "@/lib/schema";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { UploadResultItem, useUploadImage } from "@/lib/api/mutations";
import { Progress } from "@/components/ui/progress";

interface ImageUploadProps {
  field:
    | ControllerRenderProps<ComicSeriesFormData, "coverImage">
    | ControllerRenderProps<NFTFormData, "coverImage">;
}

export const ImageUpload = ({ field }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [previewURL, setPreviewURL] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const {
    mutate,
    isPending,
    isSuccess,
    error,
    data: uploadedData,
    reset,
  } = useUploadImage() as {
    mutate: (variables: {
      data: FormData;
      onProgressUpdate: (p: number) => void;
    }) => void;
    isPending: boolean;
    isSuccess: boolean;
    error: unknown;
    data: UploadResultItem;
    reset: () => void;
  };

  const updateProgress = useCallback((percentage: number) => {
    setUploadPercentage(percentage);
  }, []);

  useEffect(() => {
    if (isSuccess && uploadedData) {
      if (uploadedData.success && uploadedData.data) {
        toast.success("Image uploaded successfully!");
        setPreviewURL(uploadedData.data);

        const cleanUrl = uploadedData.data.split("?")[0];
        field.onChange(cleanUrl);
      } else {
        toast.error(uploadedData.message || "Upload failed.");
        field.onChange(null);
      }
    }
    if (error) {
      console.error("Upload error:", error);
      toast.error("An unexpected error occurred during upload.");
    }
  }, [isSuccess, uploadedData, error, field]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      setUploadPercentage(1); // Start the progress bar visually
      mutate({ data: formData, onProgressUpdate: updateProgress });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0] || null;
    if (droppedFile) {
      const formData = new FormData();
      formData.append("file", droppedFile);

      setUploadPercentage(1); // Start the progress bar visually
      mutate({ data: formData, onProgressUpdate: updateProgress });
    }
  };

  const handleDelete = () => {
    field.onChange(null);
    reset();
    queryClient.resetQueries();
  };

  return (
    <div className="">
      {!field.value ? (
        <label
          htmlFor="file-upload"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="mx-auto flex flex-col border-dashed items-center justify-center group max-md:max-w-[335px] max-md:h-[496] md:max-w-[352px] md:h-[521px] border rounded-lg cursor-pointer bg-transparent border-[#9D9D9F] hover:border-[#646464]"
        >
          {isPending ? (
            <div className="flex flex-col gap-2 items-center justify-center pt-5 pb-6">
              <p className="text-sm font-semibold flex text-center items-center gap-1">
                <Loader2 size={16} className="animate-spin" /> Uploading
              </p>
              <Progress value={uploadPercentage} className="w-full h-2" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImageIcon />
              <p className="mb-2 text-sm font-semibold text-center group-hover:opacity-75">
                Drag and drop
                <br />
                <span className="font-normal text-xs text-[#707073]">
                  or Click to upload
                </span>
              </p>
            </div>
          )}
          <input
            id="file-upload"
            accept="image/*"
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isPending}
          />
        </label>
      ) : (
        <div className="relative flex flex-col items-center">
          <Image
            src={previewURL}
            width={335}
            height={496}
            alt="Cover Preview"
            className="rounded-md max-md:max-w-[335px] max-md:h-[496] md:max-w-[352px] md:h-[521px] object-contain"
          />
          <Button
            onClick={handleDelete}
            className="absolute right-0 left-0 top-1/2 w-fit mx-auto px-7 flex items-center"
            disabled={isPending}
          >
            <Trash />
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};
