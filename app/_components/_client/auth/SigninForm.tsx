"use client";
import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import OtherMethods from "./OtherMethods";

export default function SigninForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [trySign, setTrySign] = useState(false);
  const [passwordFildType, setPasswordFildType] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangePasswordFildType = () => {
    setPasswordFildType((prev) => !prev);
  };

  return (
    <>
      <form className="w-full flex flex-col gap-5 items-center">
        {/* Email */}
        <div className="w-full relative group">
          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent duration-300" />
          <input
            onChange={onChange}
            name="email"
            value={form.email}
            type="email"
            placeholder="Enter your email"
            className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent duration-300 placeholder:text-gray-500"
          />
        </div>

        {/* Password */}
        <div className="w-full relative group">
          {form.password.length > 0 && (
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
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent duration-300" />
          <input
            onChange={onChange}
            name="password"
            value={form.password}
            type={passwordFildType ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent duration-300 placeholder:text-gray-500"
          />
        </div>

        {/* Ticket */}
        <div className="w-full flex items-center justify-between text-sm text-gray-400">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="accent-accent w-4 h-4" />
            <span className="group-hover:text-white duration-300">
              Remember me
            </span>
          </label>
          <Link
            href="/forgetpassword"
            className="hover:text-white duration-300 text-accent font-medium"
          >
            Forgot password?
          </Link>
        </div>

        {/* Login btn*/}
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
            <p className="relative z-10">Sign In</p>
          )}
        </motion.button>
      </form>

      {/* other methods*/}
      <div className="w-full my-5 flex items-center gap-4 text-gray-500 text-xs uppercase tracking-widest font-bold">
        <div className="h-[1px] flex-1 bg-white/10"></div>
        <span>or connect with</span>
        <div className="h-[1px] flex-1 bg-white/10"></div>
      </div>

      <OtherMethods />
      <div className="flex gap-2 mt-4 text-gray-400 font-medium">
        <h2>New here?</h2>
        <Link
          href={"/signup"}
          className="text-accent hover:text-white underline underline-offset-4 duration-300"
        >
          Create an account
        </Link>
      </div>
    </>
  );
}
