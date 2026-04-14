"use client";
import React, { useMemo, useState } from "react";
import { FaEnvelope } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import OtherMethods from "./OtherMethods";
import { useAuth } from "@/app/context/AuthContext";
import Input from "./_form/Input";

export default function SigninForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordFieldType, setPasswordFieldType] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({
    email: "",
    password: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangePasswordFieldType = () => {
    setPasswordFieldType((prev) => !prev);
  };

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};

    if (!form.email) {
      errors.email = "The Email is Required .";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Please, Enter Valid Email.";
    }

    if (!form.password) {
      errors.password = "The Password is Required .";
    }

    return {
      errors,
      isValid: Object.keys(errors).length === 0,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { errors, isValid } = validateForm();
    if (!isValid) {
      setErrors(errors);
      return;
    }
    setIsSubmitting(true);
    try {
      await login(form);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputs = useMemo(() => {
    return [
      {
        name: "email",
        value: form.email,
        placeHolder: "Enter Your Email",
        type: "email",
        icon: FaEnvelope,
        error: errors.email,
      },
      {
        name: "password",
        value: form.password,
        placeHolder: "Enter Your Password",
        type: passwordFieldType ? "text" : "password",
        icon: passwordFieldType ? FaEye : FaEyeSlash,
        onclick: handleChangePasswordFieldType,
        error: errors.password,
      },
    ];
  }, [form.email, form.password, passwordFieldType, errors]);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-5 items-center"
      >
        {inputs.map((input) => (
          <div key={input.name} className="w-full relative group">
            <input.icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent duration-300" />
            <Input
              onChange={onChange}
              name={input.name}
              value={input.value}
              type={input.type}
              placeholder={input.placeHolder}
              icon={input.icon}
              onclick={input.onclick}
              error={input.error}
            />
          </div>
        ))}

        {/* Ticket */}
        <div className="w-full flex items-center justify-between text-sm text-gray-400">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="accent-accent w-4 h-4" />
            <span className="group-hover:text-white duration-300">
              Remember me
            </span>
          </label>
          <Link
            href="/forget-password"
            className="hover:text-white duration-300 text-accent font-medium"
          >
            Forgot password?
          </Link>
        </div>

        {/* Login btn*/}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative bg-accent hover:bg-[#ff0a16] text-white px-6 py-4 w-full rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 duration-300 shadow-lg shadow-accent/20 overflow-hidden group/btn disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 bg-linear-to-r from-transparent via-white/20 to-transparent" />

          {isSubmitting ? (
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
