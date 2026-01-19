import React from "react";
import FilmHouse from "@/assets/sponsors/filmhouse.svg";
import Monster from "@/assets/sponsors/monster.svg";
import Itel from "@/assets/sponsors/itel.svg";
import Carry from "@/assets/sponsors/carry1st.svg";
import Superteam from "@/assets/sponsors/superteam.svg";
import Marquee from "react-fast-marquee";
import Image from "next/image";

const Sponsors = () => {
  return (
    <div className="max-w-[1280px] mx-auto mb-20 max-md:mt-20">
      <Marquee
        className="flex justify-between gap-4"
        autoFill={true}
        pauseOnHover={true}
      >
        <Image
          src={Monster}
          width={54}
          height={48}
          alt="monster logo"
          className="mx-20"
        />
        <Image
          src={FilmHouse}
          width={138}
          height={48}
          alt="filmhouse logo"
          className="mx-20"
        />
        <Image
          src={Itel}
          width={77}
          height={48}
          alt="filmhouse logo"
          className="mx-20"
        />
        <Image
          src={Superteam}
          width={94}
          height={48}
          alt="filmhouse logo"
          className="mx-20"
        />
        <Image
          src={Carry}
          width={50}
          height={48}
          alt="filmhouse logo"
          className="mx-20"
        />
      </Marquee>
    </div>
  );
};

export default Sponsors;
