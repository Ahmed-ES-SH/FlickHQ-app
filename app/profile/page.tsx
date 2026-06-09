"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Img from "@/app/_components/_globalComponents/Img";
import { motion } from "framer-motion";
import { FaEnvelope, FaCalendarAlt, FaUser } from "react-icons/fa";
import { useAuthStore } from "@/app/_stores/authStore";

export default function ProfileCard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signin");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center text-gray-400">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full h-full lg:p-8 p-3 flex flex-col justify-center items-center bg-slate-900 text-white"
    >
      <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-800 rounded-3xl p-10 shadow-2xl max-w-4xl w-full">
        <Img
          src={user.avatar || "/website/avatar.jpg"}
          alt={user.name || user.email}
          className="w-32 h-32 rounded-full border-4 border-primary_blue object-cover"
        />

        <div className="flex flex-col grow">
          <h2 className="text-4xl font-extrabold mb-2">
            {user.name || "No Name Set"}
          </h2>
          <p className="text-lg text-gray-400 mb-6">{user.email}</p>

          <div className="space-y-5 text-lg">
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-primary_blue text-2xl" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-4">
              <FaUser className="text-primary_blue text-2xl" />
              <span>
                Role:{" "}
                <span className="text-accent font-semibold">{user.role}</span>
              </span>
            </div>
            {user.isEmailVerified !== undefined && (
              <div className="flex items-center gap-4">
                <FaCalendarAlt className="text-primary_blue text-2xl" />
                <span>
                  Email Verified:{" "}
                  <span
                    className={
                      user.isEmailVerified ? "text-green-400" : "text-red-400"
                    }
                  >
                    {user.isEmailVerified ? "Yes" : "No"}
                  </span>
                </span>
              </div>
            )}
            {user.isPremium !== undefined && (
              <div className="flex items-center gap-4">
                <FaCalendarAlt className="text-primary_blue text-2xl" />
                <span>
                  Premium:{" "}
                  <span
                    className={
                      user.isPremium ? "text-yellow-400" : "text-gray-400"
                    }
                  >
                    {user.isPremium ? "Active" : "Inactive"}
                  </span>
                </span>
              </div>
            )}
            {user.createdAt && (
              <div className="flex items-center gap-4">
                <FaCalendarAlt className="text-primary_blue text-2xl" />
                <span>
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
