import Link from "next/link";
import { FaCircle } from "react-icons/fa";
import MobailLinks from "./MobailLinks";
import BarsButton from "../_client/BarsButton";
import NavbarDiv from "../_client/NavbarDiv";
import DotsNavbar from "../_client/DotsNavbar";
import ResponsiveSearchBar from "../_client/ResponsiveSearchBar";
import Image from "next/image";
import InputSearchData from "../_client/InputSearchData";
import { navLinks } from "@/app/constants/website";
import Signinbtn from "../_client/navbar/Signinbtn";

export default function Navbar() {
  return (
    <NavbarDiv>
      <MobailLinks />
      <div className="w-[85%] h-[72px] relative max-sm:w-full max-xl:w-[95%] mx-auto px-4 z-[99]">
        <div className="flex items-center justify-between gap-2 w-full h-full">
          <div className="left flex items-center gap-8">
            <div className="flex items-center gap-3">
              <BarsButton />
              <Link href={"/"} className="shrink-0">
                <Image
                  src="/logo.webp"
                  className="w-24 max-md:w-20 hover:opacity-80 transition-opacity duration-300"
                  alt="FlickHQ logo"
                  width={1024}
                  height={1280}
                  priority
                />
              </Link>
            </div>
            <nav id="links" className="xl:flex hidden items-center gap-6">
              {navLinks.map((item, index) => {
                if (item.type === "link") {
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 whitespace-nowrap"
                    >
                      {item.label}
                    </Link>
                  );
                } else if (item.type === "custom") {
                  return (
                    <Link
                      href={item.href}
                      key={index}
                      className="flex items-center gap-2 text-white/70 text-sm font-medium cursor-pointer hover:text-white transition-colors duration-200 group"
                    >
                      <span className="whitespace-nowrap">{item.label}</span>
                      <FaCircle className="size-1.5 text-accent" />
                    </Link>
                  );
                }
              })}

              <DotsNavbar />
            </nav>
          </div>
          <div className="right flex items-center gap-3 lg:gap-4">
            <div className="relative">
              <div className="hidden lg:block">
                <InputSearchData />
              </div>
              <ResponsiveSearchBar />
            </div>
            <Signinbtn />
          </div>
        </div>
      </div>
    </NavbarDiv>
  );
}
