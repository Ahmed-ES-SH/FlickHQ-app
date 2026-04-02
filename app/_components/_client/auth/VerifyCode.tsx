"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { VscLoading } from "react-icons/vsc";

export default function VerifyCode() {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;

    const newValues = [...values];
    newValues[index] = val.slice(-1);

    setValues(newValues);

    if (val.length === 1 && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && values[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
      const newValues = [...values];
      newValues[index - 1] = "";
      setValues(newValues);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(paste)) return;

    const pasteArr = paste.split("");
    const newValues = [...values];
    for (let i = 0; i < 6; i++) {
      newValues[i] = pasteArr[i] || "";
    }
    setValues(newValues);

    const lastIndex = pasteArr.length >= 6 ? 5 : pasteArr.length;
    inputsRef.current[lastIndex]?.focus();
  };

  return (
    <form className="h-fit flex flex-col items-center justify-center bg-transparent space-y-8 w-full">
      <div className="text-center space-y-2">
        <h3 className="text-white text-xl font-bold uppercase tracking-wider">Confirm your email</h3>
        <p className="text-gray-400 text-sm">We've sent a 6-digit code to your inbox.</p>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center gap-3 w-full"
      >
        {values.map((val, idx) => (
          <input
            key={idx}
            ref={(el) => {
              if (el) {
                inputsRef.current[idx] = el;
              }
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="w-12 h-14 text-center rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent duration-300 text-2xl font-black font-mono shadow-inner"
            value={val}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onPaste={handlePaste}
            autoComplete="one-time-code"
          />
        ))}
      </motion.div>
      
      <motion.button
        type="submit"
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
          <p className="relative z-10">Verify Experience</p>
        )}
      </motion.button>
      
      <button 
        type="button" 
        className="text-gray-500 hover:text-white text-sm font-medium transition-colors duration-300 underline underline-offset-4"
      >
        Resend code
      </button>
    </form>
  );
}
