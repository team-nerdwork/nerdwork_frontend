"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImageIcon, Loader2, Trash } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { ComicSeriesFormData, NFTFormData } from "@/lib/schema";
import { toast } from "sonner";
import { UploadResultItem, useUploadImage } from "@/lib/api/mutations";
import { Progress } from "@/components/ui/progress";

interface ImageUploadProps {
  field:
    | ControllerRenderProps<ComicSeriesFormData, "coverImage">
    | ControllerRenderProps<NFTFormData, "coverImage">;
}

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const ImageUpload = ({ field }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Initialize preview from field value if it exists
  const [previewURL, setPreviewURL] = useState(field.value || "");
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

  // Sync preview URL with field value changes
  useEffect(() => {
    if (field.value && field.value !== previewURL) {
      setPreviewURL(field.value);
    } else if (!field.value && previewURL) {
      setPreviewURL("");
    }
  }, [field.value, previewURL]);

  useEffect(() => {
    if (isSuccess && uploadedData) {
      if (uploadedData.success && uploadedData.data) {
        toast.success("Image uploaded successfully!");
        setPreviewURL(uploadedData.data);
        // Backend will handle URL processing, send full URL with query params
        field.onChange(uploadedData.data);
      } else {
        // Don't clear existing image on upload failure
        toast.error(uploadedData.message || "Upload failed.");
      }
    }
    if (error) {
      console.error("Upload error:", error);
      toast.error("An unexpected error occurred during upload.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, uploadedData, error]);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error(
        "Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.",
      );
      return false;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      toast.error(
        `File size exceeds ${MAX_FILE_SIZE_MB}MB limit. Please choose a smaller file.`,
      );
      return false;
    }

    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      // Validate file before uploading
      if (!validateFile(selectedFile)) {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

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
      // Validate file before uploading
      if (!validateFile(droppedFile)) {
        return;
      }

      const formData = new FormData();
      formData.append("file", droppedFile);

      setUploadPercentage(1); // Start the progress bar visually
      mutate({ data: formData, onProgressUpdate: updateProgress });
    }
  };

  const handleDelete = () => {
    field.onChange(null);
    setPreviewURL("");
    reset();
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
            <div className="flex flex-col gap-4 items-center justify-center pt-5 pb-6 w-full px-8">
              <Loader2 size={32} className="animate-spin text-white" />
              <div className="w-full space-y-2">
                <p className="text-sm font-semibold text-center">
                  Uploading... {uploadPercentage}%
                </p>
                <Progress value={uploadPercentage} className="w-full h-2" />
              </div>
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
