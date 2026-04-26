"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "HMI", href: "/hmi" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const formatted = now.toLocaleString("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Jakarta",
      });

      setTime(formatted + " WIB");
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav
      className="
    fixed top-0 left-0 w-full
    bg-white
    px-6
    h-25   
    flex items-center justify-between
    z-9999
  "
    >
      {/* Logo */}
      <Link href="/" className=" text-lg tracking-tight">
        <Image
          src="/kbi-logo.png"
          alt="KBI Logo"
          width={220}
          height={80}
          priority
        />
      </Link>

      {/* Links */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center  rounded-r-lg rounded-l-lg ">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
          px-12 py-6 rounded-md text-xl transition-all duration-300 ease-out
          transform active:scale-95 
          ${
            isActive
              ? "bg-rose-600 border-rose-200 text-white shadow-md font-extrabold "
              : "text-zinc-500 hover:text-rose-600 hover:bg-zinc-100 hover:-translate-y-0.5 font-bold"
          }
        `}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Right side */}
      <div className="bg-rose-600 h-full flex items-center px-6">
        <span className="text-xl font-mono text-white">{time}</span>
      </div>
    </nav>
  );
}
