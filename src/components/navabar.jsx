"use client";
import React, { useState } from "react";
import Link from "next/link";
import { IoSearchSharp, IoLogoGithub } from "react-icons/io5";
import { Menu } from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const navLinks = [
    { label: "Home", href: "/home" },
    { label: "Task Manager", href: "/task-manager" },
    { label: "Date Tracker", href: "/date-tracker" },
    { label: "Goal Tracker", href: "/goal-tracker" },
    { label: "Focus Tracker", href: "/focus-tracker" },
  ];

  return (
    <div className="w-full bg-black text-white p-4">
      <div className="flex justify-between items-center">
        {/* Logo & App Name */}
        <div className="flex items-center gap-2">
          <img src="/logo.JPG" alt="logo" className="w-8 h-8 rounded-full" />
          <div className="text-lg font-bold">Focus Deck</div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-3 text-md font-semibold">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="hover:bg-[#7e7e7e] rounded-md px-3 py-2"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right-side Controls */}
        <div className="flex items-center gap-3">
          {/* Search Button */}



          <div className="relative flex items-center">
            <div
              className={`bg-black border mr-1 border-white rounded-lg w-48 transition-all duration-300 ${showInput ? "block" : "hidden"
                } md:block`}
            >
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-0.5 pl-3 pr-10 rounded-md bg-black text-white border border-gray-700 focus:outline-none"
              />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => setShowInput((prev) => !prev)}
            >
              <IoSearchSharp size={20} className="text-gray-400" />
            </div>

          </div>
          {/* GitHub Icon */}
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoGithub size={25} className="hover:text-gray-300" />
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white ml-2"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mt-4 flex flex-col gap-2 md:hidden">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="hover:bg-[#7e7e7e] rounded-md px-3 py-2"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Navbar;
