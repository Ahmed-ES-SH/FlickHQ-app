/* eslint-disable react/no-unescaped-entities */
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiHome, FiCompass } from "react-icons/fi";

export default function NotFound() {
  const colors = {
    primary: "primary_blue",
    primaryHover: "hover:bg-blue-700",
    primaryText: "text-blue-600",
    primaryBorder: "border-blue-600",
    fourth: "bg-purple-500",
    fourthHover: "hover:bg-purple-600",
    fourthText: "text-purple-500",
    fourthBorder: "border-purple-500",
  };
  return (
    <div
      className={`min-h-screen bg-fourth_color bg-opacity-10 flex flex-col items-center justify-center p-4`}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-thired_dash rounded-xl shadow-2xl overflow-hidden"
      >
        <div className={`p-6 bg-primary_blue text-white`}>
          <div className="flex items-center justify-center">
            <FiAlertTriangle className="w-12 h-12 mr-3" />
            <motion.h1
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold"
            >
              404 Error
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-center text-gray-100"
          >
            The page you are looking for does not exist.
          </motion.p>
        </div>

        <div className="p-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-6"
          >
            <p className={`text-lg text-primary_blue font-semibold mb-2`}>
              Something went wrong!
            </p>
            <p className="text-gray-300">
              The page you are looking for may have been moved, deleted, or
              temporarily unavailable.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/"
              className={`flex items-center justify-center px-4 py-2 rounded-lg bg-primary_blue hover:bg-sky-500 text-white transition-colors`}
            >
              <FiHome className="mr-2" />
              Home
            </Link>
            <Link
              href="/movies"
              className={`flex items-center justify-center px-4 py-2 rounded-lg border ${colors.fourthBorder} ${colors.fourthText} ${colors.fourthHover} ${colors.fourth} ${colors.fourthHover} text-white transition-colors`}
            >
              <FiCompass className="mr-2" />
              Browse the site
            </Link>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 flex justify-center"
          >
            <div className={`h-1 w-24 rounded-full bg-primary_blue`}></div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
