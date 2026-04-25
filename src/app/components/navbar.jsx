"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "HMI", href: "/hmi" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      className="
  fixed top-0 left-0 w-full
  bg-white
  px-6 py-8
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
      {/* <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">teriot</span>
        <button className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded-md transition-colors">
          Logout
        </button>
      </div> */}
    </nav>
  );
}
