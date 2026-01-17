import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const Nerdworker = () => {
  return (
    <section className="relative text-white font-montserrat max-w-[1130px] mx-auto max-md:py-10">
      <Image
        src={
          "https://res.cloudinary.com/dk4gmufzn/image/upload/v1768557375/nerdworker_jdjt63.png"
        }
        width={1600}
        height={421}
        alt="comic gallery"
        className="w-full max-md:hidden"
      />
      <div className="absolute inset-0 bg-[linear-gradient(240deg,rgba(13,13,13,0)_0%,#0D0D0D_48%)]" />
      <div className="absolute inset-0 max-w-[1130px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4 items-start justify-center z-10">
        <h2 className="uppercase font-archivo text-5xl max-md:text-xl">
          Become a Nerdworker
        </h2>
        <p className="max-w-[583px] max-md:text-xs">
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
    </section>
  );
};

export default Nerdworker;
