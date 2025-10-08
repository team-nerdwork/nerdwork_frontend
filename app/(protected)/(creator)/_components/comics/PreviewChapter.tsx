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
import { Page } from "./MultiFileUpload";

const isPageArray = (data: Page[] | string[]): data is Page[] => {
  return (
    data.length > 0 &&
    typeof data[0] === "object" &&
    data[0] !== null &&
    "previewUrl" in data[0]
  );
};

const PreviewChapter = ({
  pages,
  loading,
}: {
  pages: Page[] | string[];
  loading?: boolean;
}) => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" disabled={loading}>
            <Eye />
            Preview Chapter
          </Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col h-[calc(100%-4rem)] items-center font-inter border-nerd-default bg-[#151515] text-white">
          <DialogHeader className="">
            <DialogTitle className="text-center leading-normal text-lg">
              Chapter Preview
            </DialogTitle>
            <DialogDescription className="sr-only text-nerd-muted text-center">
              Preview of uploaded chapter pages.
            </DialogDescription>
          </DialogHeader>
          {isPageArray(pages) ? (
            pages?.length == 0 ? (
              <>
                <p className="text-center">
                  No chapter pages. Please upload pages of the chapter to see
                  preview.
                </p>
              </>
            ) : (
              <ScrollArea
                className={`w-full max-h-[calc(100%-5.5rem)] relative font-inter md:px-2 flex flex-col justify-center gap-2`}
              >
                {pages?.map((page, index) => (
                  <figure
                    key={index}
                    className={`flex justify-center mb-2 w-auto h-full`}
                  >
                    <Image
                      src={page.previewUrl}
                      width={573}
                      height={880}
                      alt={`page ${index + 1}`}
                      className={"object-contain"}
                    />
                  </figure>
                ))}
              </ScrollArea>
            )
          ) : (
            <ScrollArea
              className={`w-full max-h-[calc(100%-5.5rem)] relative font-inter md:px-2 flex flex-col justify-center gap-2`}
            >
              {pages?.map((page, index) => (
                <figure
                  key={index}
                  className={`flex justify-center mb-2 w-auto h-full`}
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
              <Button variant="primary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PreviewChapter;
