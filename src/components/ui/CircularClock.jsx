"use client";
import React, { useEffect, useState, useRef } from "react";

export default function RadialPomodoroClock({ pomodoroMinutes, isPaused }) {
  const totalSeconds = pomodoroMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const intervalRef = useRef(null);

  // Start/Stop timer based on pause state
  useEffect(() => {
    if (!isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPaused]);

  // Auto clear when finished
  useEffect(() => {
    if (timeLeft === 0) {
      clearInterval(intervalRef.current);
    }
  }, [timeLeft]);

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <div className="relative w-[500px] h-[500px] flex items-center justify-center">
      {/* Outer glowing ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 blur-3xl"></div>

      {/* SVG circular progress */}
      <svg className="absolute w-full h-full -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="220"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="20"
          fill="none"
        />
        <circle
          cx="50%"
          cy="50%"
          r="220"
          stroke="url(#gradient)"
          strokeWidth="20"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={2 * Math.PI * 220}
          strokeDashoffset={
            2 * Math.PI * 220 - (progressPercent / 100) * 2 * Math.PI * 220
          }
          className="transition-all duration-1000 ease-linear"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center display */}
      <div className={`absolute flex flex-col items-center justify-center w-48 h-48 rounded-full 
        backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl 
        ${timeLeft < 30 ? "animate-pulse" : ""}`}>
        <span className="text-6xl font-bold text-white drop-shadow-lg">
          {formatTime()}
        </span>
        <span className="text-sm text-gray-300 tracking-wide mt-2">
          Pomodoro
        </span>
      </div>
    </div>
  );
}
