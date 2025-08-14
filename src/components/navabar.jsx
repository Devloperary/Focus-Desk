"use client";
import React, { useState } from "react";
import Link from "next/link";
import { IoSearchSharp, IoLogoGithub } from "react-icons/io5";
import { Menu } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser
} from "@clerk/nextjs";
import { LogIn } from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const { user } = useUser();

  const navLinks = [
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
          <img src="/logo.jpg" alt="logo" className="w-8 h-8 rounded-full" />
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
          <SignedOut>
            <div className="flex gap-2 items-center">
              {/* Logo */}

              {/* Sign In Button */}
              <SignInButton>
                <button className="flex items-center justify-center rounded-full font-medium text-sm h-10 px-4 cursor-pointer transition-colors bg-transparent text-white dark:text-white hover:bg-white/10">
                  Sign In
                </button>
              </SignInButton>

              {/* Sign Up Button */}
              <SignUpButton>
                <button className="flex items-center justify-center rounded-full font-medium text-sm h-10 px-4 cursor-pointer transition-colors bg-white text-black dark:bg-white dark:text-black hover:bg-gray-200">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="h-10 flex gap-3 items-center">
              {/* Logo */}

              <UserButton afterSignOutUrl="/" />

              <div className="flex flex-col text-sm leading-tight">
                <span className="font-medium">{user?.username || user?.firstName || "User"}</span>
                <span className="text-xs text-gray-500 dark:text-gray-300">
                  {user?.emailAddresses?.[0]?.emailAddress || "No Email"}
                </span>
              </div>
            </div>
          </SignedIn>

          {/* GitHub Icon */}
          <Link
            href="https://github.com/Devloperary/Focus-Desk"
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
      </div >

      {/* Mobile Menu */}
      {
        menuOpen && (
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
        )
      }
    </div >
  );
}

export default Navbar;
