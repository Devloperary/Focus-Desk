"use client";
import React, { useState } from "react";
import RadialPomodoroClock from "@/components/ui/CircularClock";
import { Pause, Play, RotateCcw } from "lucide-react";

function Page() {
  const [showClock, setShowClock] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleStart = () => {
    if (pomodoroTime > 0) {
      setShowClock(true);
      setIsPaused(false);
    } else {
      alert("Please enter a valid Pomodoro time");
    }
  };

  const handleReset = () => {
    setShowClock(false);
    setPomodoroTime(0);
    setIsPaused(false);
  };

  return (
    <div className="bg-black min-h-screen flex justify-center items-center gap-10">
      {!showClock ? (
        <div className="w-[400px] h-[400px] flex flex-col items-center bg-gray-700 text-white font-bold justify-evenly p-4 border border-gray-500 rounded-3xl shadow-2xl">
          <div className="text-2xl">🍅 Set Your Pomodoro</div>
          <input
            type="number"
            className="w-full p-4 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter minutes"
            value={pomodoroTime}
            onChange={(e) => setPomodoroTime(Number(e.target.value))}
          />
          <button
            onClick={handleStart}
            className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition"
          >
            Start Timer
          </button>
          <div className="w-full flex justify-around h-15 items-center mt-4">
            {[25, 30, 40].map((time) => (
              <div
                key={time}
                onClick={() => setPomodoroTime(time)}
                className="cursor-pointer border px-4 py-2 rounded-full hover:bg-blue-500 transition"
              >
                {time} min
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-12">
          {/* Clock */}
          <RadialPomodoroClock
            pomodoroMinutes={pomodoroTime}
            isPaused={isPaused}
          />

          {/* Control Panel */}
          <div className="flex flex-col items-center gap-6 w-[200px] h-[300px] rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 p-6 shadow-xl">
            <h3 className="text-white text-xl mb-4">Controls</h3>
            
            {/* Pause / Play */}
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition"
            >
              {isPaused ? <Play size={28} /> : <Pause size={28} />}
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="w-16 h-16 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition"
            >
              <RotateCcw size={28} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
