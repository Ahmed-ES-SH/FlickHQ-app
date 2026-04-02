"use client";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { VscLoading } from "react-icons/vsc";
import OtherMethods from "./OtherMethods";
import VerifyCode from "./VerifyCode";

export default function SignupForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [trySign, setTrySign] = useState(false);
  const [passwordFildType, setPasswordFildType] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const iconStyle = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400";
  const inputs = [
    {
      name: "name",
      value: form.name,
      placeHolder: "Enter Your Name",
      type: "text",
      icon: <FaUser className={`${iconStyle}`} />,
    },
    {
      name: "email",
      value: form.email,
      placeHolder: "Enter Your Email",
      type: "email",
      icon: <FaEnvelope className={`${iconStyle}`} />,
    },
    {
      name: "password",
      value: form.password,
      placeHolder: "Enter Your Password",
      type: "password",
      icon: <FaLock className={`${iconStyle}`} />,
    },
  ];

  const handleChangePasswordFildType = () => {
    setPasswordFildType((prev) => !prev);
  };

  return (
    <>
      {!pendingVerification ? (
        <>
          <form className="flex flex-col gap-5 items-center w-full">
            <div className="hidden" id="clerk-captcha" />
            {/* Inputs Section */}
            {inputs.map((input, index) => (
              <div key={index} className="w-full relative group">
                {input.type == "password" && form.password.length > 0 && (
                  <div
                    onClick={handleChangePasswordFildType}
                    className=" absolute top-1/2 -translate-y-1/2 right-4 z-10"
                  >
                    {passwordFildType ? (
                      <FaEyeSlash className="size-5 text-gray-500 hover:text-white cursor-pointer duration-300" />
                    ) : (
                      <FaEye className="size-5 text-gray-500 hover:text-white cursor-pointer duration-300" />
                    )}
                  </div>
                )}
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent duration-300">
                  {input.icon}
                </div>
                <input
                  onChange={onChange}
                  value={input.value}
                  name={input.name}
                  type={
                    input.type == "password"
                      ? passwordFildType
                        ? "text"
                        : "password"
                      : input.type
                  }
                  placeholder={input.placeHolder}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent duration-300 placeholder:text-gray-500"
                />
              </div>
            ))}

            {/* Sign up btn*/}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative bg-accent hover:bg-[#ff0a16] text-white px-6 py-4 w-full rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 duration-300 shadow-lg shadow-accent/20 overflow-hidden group/btn"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 bg-linear-to-r from-transparent via-white/20 to-transparent" />

              {trySign ? (
                <motion.div
                  animate={{ rotate: "360deg" }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <VscLoading className="size-5" />
                </motion.div>
              ) : (
                <p className="relative z-10">Join Experience</p>
              )}
            </motion.button>
          </form>

          {/* other methods*/}
          <div className="w-full flex items-center gap-4 text-gray-500 text-xs uppercase tracking-widest font-bold">
            <div className="h-[1px] flex-1 bg-white/10"></div>
            <span>or sign up with</span>
            <div className="h-[1px] flex-1 bg-white/10"></div>
          </div>

          {/* Other Sign in Method */}
          <OtherMethods />

          <div className="flex gap-2 mt-4 text-gray-400 font-medium">
            <h2>Already a member?</h2>
            <Link href={"/signin"} className="text-accent hover:text-white underline underline-offset-4 duration-300">
              Sign In
            </Link>
          </div>
        </>
      ) : (
        <VerifyCode />
      )}
    </>
  );
}
