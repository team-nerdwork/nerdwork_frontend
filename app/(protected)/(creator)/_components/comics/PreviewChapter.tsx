import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

const PreviewChapter = ({ pages }: { pages: string[] }) => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            //   disabled={draftLoading || publishLoading || imageUploading}
          >
            <Eye />
            Preview Chapter
          </Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col items-center gap-7 font-inter border-nerd-default bg-[#151515] text-white">
          <DialogHeader className="mt-5">
            <DialogTitle className="text-center leading-normal text-lg">
              Chapter Preview
            </DialogTitle>
            <DialogDescription className="sr-only text-nerd-muted text-center">
              By deleting this you will no longer have access to it and will not
              be gaining from it anymore. Please proceed with caution.
            </DialogDescription>
          </DialogHeader>
          {pages?.length == 0 ? (
            <>
              <p>
                NO chapter pages. Please upload pages of the chapter to see
                preview.
              </p>
            </>
          ) : (
            <ScrollArea
              className={`w-full max-h-[80vh] h-full relative font-inter px-5 pb-5 flex flex-col justify-center gap-2`}
            >
              {pages?.map((page, index) => (
                <figure
                  key={index}
                  className={`flex justify-center w-auto h-full`}
                >
                  <Image
                    src={page}
                    width={573}
                    height={880}
                    alt={`page ${index + 1}`}
                    className={"object-contain"}
                  />
                </figure>
              ))}
            </ScrollArea>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PreviewChapter;
