"use client";
import Image from "next/image";
import React from "react";
import Logo from "@/assets/nerdwork.png";
import { Button } from "@/components/ui/button";
import { MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const { data: session } = useSession();
  const user = session?.user;

  const handleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-[#0D0D0D1A] z-30 text-white fixed right-0 left-0 w-full backdrop-blur-[2px]">
      <section className="max-w-[1600px] mx-auto">
        <section className="lg:flex hidden gap-4 font-montserrat font-semibold justify-between h-[93px] items-center px-6">
          <Link href={"/"}>
            <Image src={Logo} width={146} height={40} alt="nerdwork logo" />
          </Link>
          <ul className="flex gap-10 items-center">
            <Link href={"/communities"} className="hover:opacity-75">
              Communities
            </Link>
            <Link href={"/nerdwork+"} className="hover:opacity-75">
              Nerdwork+
            </Link>
            <Link href={"/events"} className="hover:opacity-75">
              Events
            </Link>
            <li>Company</li>
          </ul>
          <div className="flex gap-4">
            {/* <Button asChild>
              <Link href={"/signin"}>Log In</Link>
            </Button> */}
            {user ? (
              <Button
                asChild
                className="bg-[#08FA37CC] rounded-full font-montserrat text-lg hover:bg-[#08FA37]"
              >
                <Link href={"/signin"}>Go to dashboard</Link>
              </Button>
            ) : (
              <Button asChild className="bg-[#009BCB] font-montserrat">
                <Link className="w-[120px]" href={"/signin"}>
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </section>

        {/* Mobile navbar */}
        <section className="max-lg:flex relative lg:hidden border-b border-[#FFFFFF1A] font-inter font-semibold justify-between h-[88px] items-center px-6">
          <Link href={"/"}>
            <Image src={Logo} width={146} height={40} alt="nerdwork logo" />
          </Link>
          <button onClick={handleMenu}>
            <MenuIcon />
          </button>
          {isOpen && (
            <div className="absolute right-0 top-0 flex flex-col w-full gap-8 bg-[#0D0D0D] px-5 py-7">
              <div className="flex justify-between items-center">
                <Link href={"/"}>
                  <Image
                    src={Logo}
                    width={146}
                    height={40}
                    alt="nerdwork logo"
                  />
                </Link>
                <button onClick={handleMenu} className="">
                  <X />
                </button>
              </div>
              <ul className="flex flex-col gap-7">
                <Link href={"/communities"}>Communities</Link>
                <Link href={"/nerdwork+"} className="hover:opacity-75">
                  Nerdwork+
                </Link>
                <Link href={"/events"} className="hover:opacity-75">
                  Events
                </Link>
                <li>Company</li>
              </ul>
              <div className="flex justify-between gap-4 w-full">
                {user ? (
                  <Button
                    asChild
                    className="bg-[#08FA37CC] rounded-full font-montserrat text-lg hover:bg-[#08FA37]"
                  >
                    <Link href={"/signin"}>Go to dashboard</Link>
                  </Button>
                ) : (
                  <Button asChild className="bg-[#009BCB] font-montserrat">
                    <Link href={"/signin"} className="w-[120px]">
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </section>
      </section>
    </nav>
  );
}
