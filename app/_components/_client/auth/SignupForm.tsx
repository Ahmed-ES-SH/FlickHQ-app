"use client";
import { useMemo, useState } from "react";

import { FaEnvelope, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { VscLoading } from "react-icons/vsc";

import Link from "next/link";
import { toast } from "sonner";
import OtherMethods from "./OtherMethods";
import VerifyCode from "./VerifyCode";
import Input from "./_form/Input";
import { registerAction } from "@/app/_actions/auth";

export default function SignupForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordFiledType, setPasswordFiledType] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleChangePasswordFieldType = () => {
    setPasswordFiledType((prev) => !prev);
  };

  const validateForm = () => {
    const validationErrors: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (!form.name) {
      validationErrors.name = "The Name is Required.";
    }
    if (!form.email) {
      validationErrors.email = "The Email is Required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      validationErrors.email = "Please, Enter Valid Email.";
    }

    if (!form.password) {
      validationErrors.password = "The Password is Required.";
    } else if (form.password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters.";
    } else if (
      !/[a-z]/.test(form.password) ||
      !/[A-Z]/.test(form.password) ||
      !/\d/.test(form.password)
    ) {
      validationErrors.password =
        "Password must include uppercase, lowercase, and a number.";
    }

    return {
      errors: validationErrors,
      isValid: Object.keys(validationErrors).length === 0,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { errors: validationErrors, isValid } = validateForm();
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const res = await registerAction({
        email: form.email,
        password: form.password,
        name: form.name || undefined,
      });

      if (!res.success) {
        if (res.field && res.field !== "general") {
          setErrors((prev) => ({ ...prev, [res.field!]: res.message }));
        } else {
          toast.error(res.message);
        }
        return;
      }

      toast.success(
        "Account created successfully! Please check your email for verification.",
      );
      setPendingVerification(true);
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const inputs = useMemo(() => {
    return [
      {
        name: "name",
        value: form.name,
        placeHolder: "Enter Your Name",
        type: "text",
        icon: FaUser,
        error: errors.name,
      },
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
        type: passwordFiledType ? "text" : "password",
        icon: passwordFiledType ? FaEye : FaEyeSlash,
        onclick: handleChangePasswordFieldType,
        error: errors.password,
      },
    ];
  }, [form.email, form.name, form.password, passwordFiledType, errors]);

  return (
    <>
      {!pendingVerification ? (
        <>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 sm:gap-5 items-center w-full"
          >
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
                error={input.error}
              />
            ))}

            {/* Sign up btn*/}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative bg-accent hover:bg-[#ff0a16] text-white px-6 py-3 sm:py-4 w-full rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 duration-300 shadow-lg shadow-accent/20 overflow-hidden group/btn disabled:opacity-70 disabled:cursor-not-allowed"
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
          <div className="w-full my-4 sm:my-5 md:my-6 flex items-center gap-4 text-gray-500 text-xs uppercase tracking-widest font-bold">
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
        <VerifyCode email={form.email} />
      )}
    </>
  );
}
