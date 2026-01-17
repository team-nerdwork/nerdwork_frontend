import Image from "next/image";
import React from "react";
import AppStore from "@/assets/socials/appstore.svg";
import PlayStore from "@/assets/socials/playstore.svg";

const JajaGame = () => {
  return (
    <section className="relative font-montserrat text-white my-20">
      <div className="bg-[url(https://res.cloudinary.com/dk4gmufzn/image/upload/v1768558682/jaja_ylcxtx.png)] bg-no-repeat bg-center min-h-screen w-full" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,13,13,0)_0%,#0D0D0D_78%)]" />
      <section className="absolute inset-0 max-w-[1130px] text-center mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4 items-center justify-end z-10 h-full">
        <h2 className="uppercase font-archivo text-5xl max-md:text-xl text-white">
          Jaja Lost Souls
        </h2>
        <p className="max-w-[400px] max-md:text-sm text-white">
          Read tales inspired by tradition, modern life, and bold futures. All
          crafted by African creators
        </p>

        <div className="flex items-center gap-5">
          <button className="min-w-[180px] z-50 flex items-center gap-4 cursor-pointer border border-nerd-muted rounded-md px-4 py-1">
            <Image src={AppStore} width={40} height={33} alt="app store" />
            <p className="leading-tight text-sm text-left">
              Download on the
              <br />
              <span className="text-2xl font-semibold">App Store</span>
            </p>
          </button>
          <button className="min-w-[180px] z-50 flex items-center gap-4 cursor-pointer border border-nerd-muted rounded-md px-4 py-1">
            <Image src={PlayStore} width={40} height={33} alt="app store" />
            <p className="leading-tight text-sm text uppercase text-left">
              Get it on
              <br />
              <span className="text-2xl font-semibold capitalize">
                Google Play
              </span>
            </p>
          </button>
        </div>

        <div className="flex justify-between gap-9 max-w-[800px] w-full mt-10">
          <Image
            src={
              "https://res.cloudinary.com/dk4gmufzn/image/upload/v1768559283/f4d2e81d7033ea0740df5fdf766bd00ac56e7a61_bi0dk9.png"
            }
            width={245}
            height={141}
            alt="game image 1"
          />
          <Image
            src={
              "https://res.cloudinary.com/dk4gmufzn/image/upload/v1768559283/e1a903b090122f0c9fd0037802ea5745129ddf24_furmvi.png"
            }
            width={245}
            height={141}
            alt="game image 2"
          />
          <Image
            src={
              "https://res.cloudinary.com/dk4gmufzn/image/upload/v1768559283/e22a253bea92cf6ce186357c0f1bef55d279a0a5_vsrhfd.png"
            }
            width={245}
            height={141}
            alt="game image 3"
          />
        </div>
      </section>
    </section>
  );
};

export default JajaGame;
