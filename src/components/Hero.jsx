"use client";
import { image } from "framer-motion/client";
import React from "react";
import Link from "next/link";

function Hero() {
  return (
    <div className="w-full min-h-full flex items-center justify-center text-white px-6 py-12 flex-col gap-6">
      <div className="max-w-4xl text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Master Your Focus. Track What Matters.
        </h1>

        <p className="text-md sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto opacity-40 text-center flex justify-center items-center">
          Focus Deck is your all-in-one workspace to manage tasks, goals,
          habits, and progress — built for clarity, consistency, and results.
        </p>
      </div>
      <div>
        <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 focus:ring-offset-slate-100">
          <Link href="./task-manager">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              Strat Now
            </span>
          </Link>
        </button>
      </div>
    </div>
  );
}

export default Hero;
