import React from "react";
import { BiLogoFacebook } from "react-icons/bi";
import { FaPhone, FaTiktok } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaXTwitter } from "react-icons/fa6";
import { CiInstagram } from "react-icons/ci";
import SwiperBartners from "@/app/_components/_website/_pricing/SwiperBartners";

export default function Contactus() {
  const inputStyle =
    "max-lg:w-full  p-2 rounded-xl bg-fourth_color text-gray-200 border-none outline-none placeholder:text-white placeholder:font-light placeholder:px-2 focus:ring-2 focus:ring-sky-300 duration-300";
  const iconStyle = "text-white size-6";
  const socialIcons = [
    {
      icon: <BiLogoFacebook className={`${iconStyle}`} />,
      bg_color: "bg-[#1877f2]",
    },
    {
      icon: <FaXTwitter className={`${iconStyle}`} />,
      bg_color: "bg-[#000000]",
    },

    {
      icon: <CiInstagram className={`${iconStyle}`} />,
      bg_color: "bg-[#f56040]",
    },
    {
      icon: <FaTiktok className={`${iconStyle}`} />,
      bg_color: " bg-[#000000]",
    },
  ];
  return (
    <>
      <div className="lg:mt-32 mt-20 custom-container min-h-screen">
        <h1 className="text-gray-200 text-2xl xl:text-5xl mb-12">Contact Us</h1>
        <div className="max-lg:flex-col flex items-start justify-between w-full gap-6 mt-12">
          {/* Form  */}
          <form className="flex-2/3 max-lg:w-full p-3 lg:p-6 border border-gray-800 rounded-xl">
            <div className="max-lg:flex-col flex items-center justify-between gap-4 w-full">
              <input
                type="text"
                name="name"
                placeholder="Name ..."
                className={`${inputStyle} flex-1`}
              />
              <input
                type="email"
                name="email"
                placeholder="Email ..."
                className={`${inputStyle} flex-1`}
              />
            </div>
            <input
              type="text"
              placeholder="Subject ..."
              className={`${inputStyle} w-full mt-4`}
            />
            <textarea
              placeholder="Type your message ..."
              className={`${inputStyle} w-full mt-4 h-[18vh]`}
            />
            <input
              type="submit"
              value={"Submit"}
              className="py-4 px-6 lg:px-20 mt-4 cursor-pointer hover:bg-white hover:text-black hover:border-sky-400 border border-transparent hover:scale-110 duration-200  bg-primary_blue text-white text-center rounded-2xl"
            />
          </form>
          {/* Info */}
          <div className="lg:flex-[40%] w-full flex-1 flex flex-col gap-4 max-lg:pt-5 max-lg:border-t max-lg:border-gray-600">
            <h1 className="text-white text-xl lg:text-4xl">Info</h1>
            <p className="text-lg text-white leading-8">
              It is a long fact that a reader will be distracted by the readable
              content of a page when looking at its layout
            </p>
            {/* Phone Number */}
            <div className="flex items-baseline gap-2 md:mt-6">
              <FaPhone className="text-primary_blue size-6 lg:size-8 rotate-[150deg]" />
              <p className="cursor-pointer hover:text-primary_blue duration-300 lg:text-xl text-lg text-white  ">
                +1 809 234-56-78
              </p>
            </div>
            {/* Email */}
            <div className="flex items-center gap-2 mt-2">
              <MdEmail className="text-primary_blue size-6 lg:size-8" />
              <p className="cursor-pointer hover:text-primary_blue duration-300 lg:text-xl text-lg text-white  ">
                support@FlickHQ.template
              </p>
            </div>
            {/* Social Icons  */}
            <div className="flex items-center gap-6 mt-6">
              {socialIcons.map((item, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 hover:-translate-y-2 duration-200 cursor-pointer rounded-full ${item.bg_color} flex items-center justify-center`}
                >
                  {item.icon}
                </div>
              ))}
            </div>
          </div>
        </div>
        <SwiperBartners />
      </div>
    </>
  );
}
