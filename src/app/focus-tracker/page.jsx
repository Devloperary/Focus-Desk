"use client";
import React, { useState, useRef, useEffect } from "react";
import RadialPomodoroClock from "@/components/ui/CircularClock";
import { Pause, Play, RotateCcw } from "lucide-react";
import "@/app/globals.css";

function Page() {
  const [showClock, setShowClock] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isBeeping, setIsBeeping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // NEW

  const tickRef = useRef(null);
  const beepRef = useRef(null);

  // Play ticking sound when timer runs
  useEffect(() => {
    if (showClock && !isPaused && !isBeeping && hasStarted) {
      tickRef.current?.play().catch(() => { });
    } else {
      tickRef.current?.pause();
    }
  }, [showClock, isPaused, isBeeping, hasStarted]);

  const handleStart = () => {
    if (pomodoroTime > 0) {
      setShowClock(true);
      setIsPaused(false);
      setIsBeeping(false);
      setHasStarted(true);

      // ✅ Play ticking sound on user click
      tickRef.current.currentTime = 0;
      tickRef.current.play().catch(() => { });
    } else {
      setShowClock(true);
      setHasStarted(false);
    }
  };

  const togglePause = () => {
    setIsPaused((prev) => {
      const next = !prev;
      if (!next) { // unpausing
        tickRef.current.play().catch(() => { });
      } else { // pausing
        tickRef.current.pause();
      }
      return next;
    });
  };


  const handleReset = () => {
    setShowClock(false);
    setPomodoroTime(0);
    setIsPaused(false);
    setIsBeeping(false);
    setHasStarted(false);
    tickRef.current?.pause();
    beepRef.current?.pause();
    beepRef.current.currentTime = 0;
  };

  const handleTimeUp = () => {
    if (!hasStarted || pomodoroTime <= 0) return; // PREVENT constant beep
    setIsBeeping(true);
    setHasStarted(false); // stop marking it as running
    tickRef.current?.pause();
    beepRef.current.loop = true;
    beepRef.current?.play().catch(() => { });
  };

  const stopBeep = () => {
    setIsBeeping(false);
    beepRef.current?.pause();
    beepRef.current.currentTime = 0;
  };

  return (
    <div className="bg-black min-h-screen flex flex items-center justify-center px-4 py-8 mt-16 sm:px-8 sm:py-12 gap-12">

      {/* Pomodoro setup */}
      <div className="w-full max-w-md flex flex-col items-center bg-gray-700 text-white font-bold justify-evenly p-6 border border-gray-500 rounded-3xl shadow-2xl gap-6">
        <div className="text-2xl text-center pacifico-regular">Set Your Pomodoro</div>
        <input
          type="number"
          className="w-full p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        <div className="w-full flex justify-around items-center">
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

      {/* Timer + Controls */}
      <div className="flex flex-col items-center justify-center gap-8 md:gap-16 w-full max-w-6xl">

        {/* Audio elements */}
        <audio ref={tickRef} src="/sounds/clock-ticking.wav" preload="auto" loop />
        <audio ref={beepRef} src="/sounds/beep.wav" preload="auto" />

        {/* Clock (always visible) */}
        <div className="w-[250px] sm:w-[300px] md:w-[350px] lg:w-[400px] aspect-square">
          <RadialPomodoroClock
            pomodoroMinutes={pomodoroTime}
            isPaused={isPaused}
            onTimeUp={handleTimeUp}
          />
        </div>

        {/* Controls */}
        { showClock && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4">
              <button
                onClick={togglePause}
                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition"
              >
                {isPaused ? <Play size={24} /> : <Pause size={24} />}
              </button>
              <button
                onClick={handleReset}
                className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition"
              >
                <RotateCcw size={24} />
              </button>
            </div>
            {isBeeping && (
              <button
                onClick={stopBeep}
                className="mt-4 p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition"
              >
                Stop Beep
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
