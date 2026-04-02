"use client";
import { usePathname } from "next/navigation";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaPinterestP,
} from "react-icons/fa";
import Img from "./Img";



export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/dashboard") return null;

  const discoveryItems = ["Trending Movies", "Top Rated Shows", "New Releases", "Upcoming Premieres", "Original Productions"];
  const communityItems = ["Help Center", "Community Forum", "Cinematic Blog", "Device Support", "Accessibility"];
  const companyItems = ["About FlickHQ", "Press Media", "Careers", "Legal Notices", "Contact Us"];

  const footerSections = [
    { title: "Discovery", items: discoveryItems },
    { title: "Community", items: communityItems },
    { title: "Company", items: companyItems },
  ];

  return (
    <footer className="relative bg-[#050505] pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* Background Decorative Text */}
      <div className="absolute top-0 right-0 left-0 flex justify-center opacity-[0.02] pointer-events-none select-none">
        <h1 className="text-[20vw] font-black tracking-tighter leading-none translate-y-[-20%]">FLICKHQ</h1>
      </div>

      <div className="custom-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 mb-20">
          {/* Brand Section - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <Img
                className="w-32 brightness-110 drop-shadow-[0_0_20px_rgba(229,9,20,0.4)]"
                src="/logo.webp"
                alt="FlickHQ Logo"
              />
              <p className="text-white/50 text-sm leading-relaxed max-w-sm font-medium">
                The ultimate gateway to cinematic discovery. Explore thousands of 4K titles, exclusive premieres, and award-winning originals designed for the modern enthusiast.
              </p>
            </div>
            
            <div className="flex gap-5 text-xl text-white/40">
              <FaInstagram className="hover:text-accent hover:-translate-y-1 transition-all duration-500 cursor-pointer" />
              <FaTwitter className="hover:text-accent hover:-translate-y-1 transition-all duration-500 cursor-pointer" />
              <FaFacebook className="hover:text-accent hover:-translate-y-1 transition-all duration-500 cursor-pointer" />
              <FaPinterestP className="hover:text-accent hover:-translate-y-1 transition-all duration-500 cursor-pointer" />
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-white text-xs font-black tracking-[0.3em] uppercase">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="text-white/40 text-sm hover:text-accent hover:translate-x-2 transition-all duration-500 cursor-pointer font-medium"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-8">
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/20 hover:text-white/60 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/20 hover:text-white/60 cursor-pointer transition-colors">Terms of Service</span>
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/20 hover:text-white/60 cursor-pointer transition-colors">Cookie Settings</span>
          </div>
          
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white/20">
            © {new Date().getFullYear()} FLICKHQ. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
