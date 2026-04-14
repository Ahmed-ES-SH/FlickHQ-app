"use client";
import { useMemo, useState } from "react";

import { FaEnvelope, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { VscLoading } from "react-icons/vsc";

import Link from "next/link";
import OtherMethods from "./OtherMethods";
import VerifyCode from "./VerifyCode";
import Input from "./_form/Input";

export default function SignupForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordFiledType, setPasswordFiledType] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangePasswordFieldType = () => {
    setPasswordFiledType((prev) => !prev);
  };

  const inputs = useMemo(() => {
    return [
      {
        name: "name",
        value: form.name,
        placeHolder: "Enter Your Name",
        type: "text",
        icon: FaUser,
      },
      {
        name: "email",
        value: form.email,
        placeHolder: "Enter Your Email",
        type: "email",
        icon: FaEnvelope,
      },
      {
        name: "password",
        value: form.password,
        placeHolder: "Enter Your Password",
        type: passwordFiledType ? "text" : "password",
        icon: passwordFiledType ? FaEye : FaEyeSlash,
        onclick: handleChangePasswordFieldType,
      },
    ];
  }, [form.email, form.name, form.password, passwordFiledType]);

  return (
    <>
      {!pendingVerification ? (
        <>
          <form className="flex flex-col gap-5 items-center w-full">
            <div className="hidden" id="clerk-captcha" />
            {/* Inputs Section */}
            {inputs.map((input, index) => (
              <Input
                key={index}
                onChange={onChange}
                value={input.value}
                name={input.name}
                type={input.type}
                placeholder={input.placeHolder}
                icon={input.icon}
                onclick={input.onclick}
              />
            ))}

            {/* Sign up btn*/}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative bg-accent hover:bg-[#ff0a16] text-white px-6 py-4 w-full rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 duration-300 shadow-lg shadow-accent/20 overflow-hidden group/btn"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 bg-linear-to-r from-transparent via-white/20 to-transparent" />

              {loading ? (
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
          <div className="w-full my-6 flex items-center gap-4 text-gray-500 text-xs uppercase tracking-widest font-bold">
            <div className="h-[1px] flex-1 bg-white/10"></div>
            <span>or sign up with</span>
            <div className="h-[1px] flex-1 bg-white/10"></div>
          </div>

          {/* Other Sign in Method */}
          <OtherMethods />

          <div className="flex gap-2 mt-4 text-gray-400 font-medium">
            <h2>Already a member?</h2>
            <Link
              href={"/signin"}
              className="text-accent hover:text-white underline underline-offset-4 duration-300"
            >
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
