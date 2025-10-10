import { uploadImage } from "@/actions/comic.actions";
import { useMutation } from "@tanstack/react-query";

export type UploadResultItem = {
  success: boolean;
  data?: string;
  message?: string;
  status?: number;
  error?: string;
};
interface SingleUploadVariables {
  data: FormData;
  onProgressUpdate: (percentage: number) => void;
}

interface UploadVariables {
  filesToUpload: File[];
  onProgressUpdate: (percentage: number) => void;
}

export const useUploadImage = () => {
  return useMutation({
    mutationFn: async ({
      data,
      onProgressUpdate,
    }: SingleUploadVariables): Promise<UploadResultItem> => {
      const intervalDelay = 300; // Update progress 10 times per second
      let currentProgress = 0;

      const intervalId = setInterval(() => {
        currentProgress = Math.min(currentProgress + 10, 95);
        onProgressUpdate(currentProgress);
      }, intervalDelay);

      try {
        const result = (await uploadImage(data)) as UploadResultItem;

        clearInterval(intervalId);
        onProgressUpdate(100);

        return result;
      } catch (error) {
        clearInterval(intervalId);

        const errorResult: UploadResultItem = {
          success: false,
          error: (error as Error)?.message || "Image upload failed.",
        };

        onProgressUpdate(100);
        return errorResult;
      }
    },
  });
};

export const useUploadMultiImages = () => {
  return useMutation({
    mutationFn: async ({
      filesToUpload,
      onProgressUpdate,
    }: UploadVariables): Promise<UploadResultItem[]> => {
      const totalFiles = filesToUpload.length;
      const uploadPromises: Promise<UploadResultItem>[] = [];
      const intervalDelay = 300; // Update progress 10 times per second

      let overallCompletedFiles = 0;

      for (const file of filesToUpload) {
        let fileProgress = 0;
        const intervalId = setInterval(() => {
          fileProgress = Math.min(fileProgress + 5, 95); // Stop just before 100%

          const overallProgress = Math.floor(
            (overallCompletedFiles * 100 + fileProgress) / totalFiles
          );

          onProgressUpdate(overallProgress);
        }, intervalDelay);

        const uploadPromise = new Promise<UploadResultItem>(async (resolve) => {
          try {
            const formData = new FormData();
            formData.append("file", file);

            const result = (await uploadImage(formData)) as UploadResultItem;

            clearInterval(intervalId);
            overallCompletedFiles++;

            const finalOverallProgress = Math.floor(
              (overallCompletedFiles * 100) / totalFiles
            );
            onProgressUpdate(finalOverallProgress);

            resolve(result);
          } catch (error) {
            clearInterval(intervalId);
            const errorResult: UploadResultItem = {
              success: false,
              error: (error as Error)?.message || "Upload failed",
            };
            resolve(errorResult);
          }
        });

        uploadPromises.push(uploadPromise);
      }

      return Promise.all(uploadPromises);
    },
  });
};
