import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const ReadButton = ({ chapterCode }: { chapterCode: string }) => {
  const pathname = usePathname();
  return (
    <Link className="" href={`${pathname}/chapter/${chapterCode}`}>
      <Button
        variant={"primary"}
        className="hover:bg-neutral-300 border-neutral-600"
      >
        Read
      </Button>
    </Link>
  );
};

export default ReadButton;
