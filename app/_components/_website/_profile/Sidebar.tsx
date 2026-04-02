"use client";
import React, { useEffect } from "react";
import { FaBars, FaEye, FaHeart, FaHome, FaList, FaUser } from "react-icons/fa";
import Link from "next/link";
import { MdLogout } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { useVariables } from "@/app/context/VariablesContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const { showSidebar, setShowSidebar, width } = useVariables();
  const iconStyle = "text-red-500";
  const profileOptions = [
    {
      text: "Profile",
      icon: <FaUser className={`${iconStyle}`} />,
      link: "/profile",
    },
    {
      text: "Watched",
      icon: <FaEye className={`${iconStyle}`} />,
      link: "/profile/watched",
    },
    {
      text: "Watch List",
      icon: <FaList className={`${iconStyle}`} />,
      link: "/profile/watchlist",
    },
    {
      text: "Favorite",
      icon: <FaHeart className={`${iconStyle}`} />,
      link: "/profile/favouritlist",
    },
  ];

  useEffect(() => {
    if (width >= 1024) {
      setShowSidebar(true);
    }
  }, [setShowSidebar, width]);

  const fadeInVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      x: 20,
    },
  };

  return (
    <>
      {!showSidebar && (
        <FaBars
          onClick={() => setShowSidebar(true)}
          className="fixed top-4 left-4 z-[100] text-white size-6 cursor-pointer lg:hidden"
        />
      )}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center justify-between py-6 px-2 lg:w-[23%] xl:w-[18%] bg-fourth_color max-lg:fixed top-0 left-0 z-[99] max-lg:w-[300px] max-lg:min-h-screen"
          >
            <div className="top w-full p-2 pt-20">
              <RxCross1
                onClick={() => setShowSidebar(false)}
                className="text-red-400  top-2 right-2 cursor-pointer size-6 w-fit ml-auto block lg:hidden"
              />
              {/* Avatar */}
              {/* <div className="lg:w-48 lg:h-48 w-32 h-32 mx-auto rounded-full flex items-center justify-center border-2 border-sky-400">
                <Img
                  src={user.imageUrl}
                  className="w-full h-full rounded-full object-cover"
                />
              </div> */}
              {/* <p className="my-2 text-white text-center">
                {user.fullName || "No Name Found"}
              </p> */}
              <div className="flex flex-col w-full gap-4 mt-8">
                {profileOptions.map((opation, index) => (
                  <Link
                    href={opation.link}
                    key={index}
                    className="flex items-center justify-between w-full"
                  >
                    <p className="text-white hover:text-sky-400 duration-200 lg:text-lg">
                      {opation.text}
                    </p>
                    {opation.icon}
                  </Link>
                ))}
              </div>
            </div>
            <div className="bottom w-full p-4">
              <div className="flex flex-col gap-4 w-full">
                <Link
                  href={"/"}
                  className="flex items-center justify-between w-full"
                >
                  <p className="text-red-400 hover:text-red-500">Home</p>
                  <FaHome className={`${iconStyle}`} />
                </Link>
                <div className=" cursor-pointer flex items-center justify-between w-full">
                  <p className="text-red-400 hover:text-red-500">Log out</p>
                  <MdLogout className={`${iconStyle}`} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
