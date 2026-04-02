"use client";
import Img from "@/app/_components/_globalComponents/Img";
import { motion } from "framer-motion";
import { FaEnvelope, FaCalendarAlt, FaSignInAlt, FaUser } from "react-icons/fa";

export default function ProfileCard() {
  const user = null;
  if (!user) return;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full h-full lg:p-8 p-3 flex flex-col justify-center items-center bg-slate-900 text-white"
    >
      <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-800 rounded-3xl p-10 shadow-2xl max-w-4xl w-full">
        <Img
          src={user.imageUrl}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-primary_blue object-cover"
        />

        <div className="flex flex-col flex-grow">
          <h2 className="text-4xl font-extrabold mb-2">
            {user.fullName || "No Name Set"}
          </h2>
          <p className="text-lg text-gray-400 mb-6">
            {user.username || "No Username"}
          </p>

          <div className="space-y-5 text-lg">
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-primary_blue text-2xl" />
              <span>{user.primaryEmailAddress?.emailAddress}</span>
            </div>
            <div className="flex items-center gap-4">
              <FaCalendarAlt className="text-primary_blue text-2xl" />
              <span>
                Joined:{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Unknown"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <FaSignInAlt className="text-primary_blue text-2xl" />
              <span className="max-sm:text-[10px]">
                Last Sign-in:{" "}
                {user.lastSignInAt
                  ? new Date(user.lastSignInAt).toLocaleString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <FaUser className="text-primary_blue text-2xl" />
              <span>
                2FA Enabled:{" "}
                <span
                  className={
                    user.twoFactorEnabled ? "text-green-400" : "text-red-400"
                  }
                >
                  {user.twoFactorEnabled ? "Yes" : "No"}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
