import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const Create = () => {
  return (
    <section className="relative text-white font-montserrat max-w-[1440px] mx-auto max-md:py-10">
      <Image
        src={
          "https://res.cloudinary.com/dk4gmufzn/image/upload/v1768557374/creator_wql4vi.png"
        }
        width={1600}
        height={421}
        alt="comic gallery"
        className="w-full max-md:hidden"
      />
      <div className="absolute inset-0 md:bg-[linear-gradient(285deg,rgba(13,13,13,0)_0%,#0D0D0D_47%)]" />
      <div className="absolute inset-0 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4 items-start md:justify-center z-10">
        <h2 className="uppercase font-archivo text-5xl max-md:text-xl">
          Become a Creator
        </h2>
        <p className="max-w-[583px] max-md:text-sm">
          Find the community that speaks to you. Talk about storylines,
          characters and tropes with readers and creators
        </p>
        <Button
          className="md:max-w-[219px] max-md:w-full bg-[#009BCB] text-white uppercase font-inter"
          asChild
        >
          <Link href={"/signin"}>Get Started</Link>
        </Button>
      </div>
      <Image
        src={
          "https://res.cloudinary.com/dk4gmufzn/image/upload/v1768793182/gallery-mobile_bd2fwo.png"
        }
        width={382}
        height={271}
        alt=""
        className="mt-20 md:hidden"
      />
    </section>
  );
};

export default Create;
