"use client";

import { useState, useRef, useEffect } from "react";


export default function RadialPomodoroClock({ pomodoroMinutes, isPaused, onTimeUp }) {
  const totalSeconds = pomodoroMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const intervalRef = useRef(null);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  // Reset when pomodoroMinutes changes
  useEffect(() => {
    setTimeLeft(totalSeconds);
  }, [pomodoroMinutes]);

  // Timer logic
  useEffect(() => {
    if (!isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPaused, timeLeft]);

  // When timer ends
  useEffect(() => {
    if (timeLeft === 0) {
      clearInterval(intervalRef.current);
      if (onTimeUp) onTimeUp(); // 🔔 Tell parent to start beep
    }
  }, [timeLeft, onTimeUp]);

  // Time Formatter
  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const progress = ((totalSeconds - timeLeft) / totalSeconds) * circumference;

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto">
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 blur-3xl z-0" />

      {/* SVG Circle */}
      <svg viewBox="0 0 200 200" className="absolute w-full h-full -rotate-90 z-10">
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="12"
          fill="none"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-1000 ease-linear"
        />
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="200" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center Time Display */}
      <div
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center 
          rounded-full backdrop-blur-lg bg-white/10 border border-white/20 
          shadow-2xl text-white transition-all duration-300 
          ${timeLeft < 30 ? "animate-pulse" : ""}`}
      >
        <span className="text-4xl sm:text-5xl font-bold drop-shadow-lg">
          {formatTime()}
        </span>
        <span className="text-xs sm:text-sm text-gray-300 mt-2 tracking-wide">
          Pomodoro
        </span>
      </div>
    </div>
  );
}
