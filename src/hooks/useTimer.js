"use client";
import { useState, useRef, useCallback } from "react";

/**
 * useTimer - A custom timer hook supporting countdown and stopwatch.
 *
 * @param {number} initialSeconds - Starting time (for countdown).
 * @param {boolean} isStopwatch - If true, it counts up instead of down.
 */
export function useTimer(initialSeconds = 0, isStopwatch = false) {
  const [time, setTime] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = useCallback((seconds = initialSeconds) => {
    clearInterval(intervalRef.current);
    setTime(seconds);
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        if (isStopwatch) {
          return prev + 1; // Count up
        } else {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return prev - 1; // Count down
        }
      });
    }, 1000);
  }, [initialSeconds, isStopwatch]);

  const pause = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    if (!isRunning && (isStopwatch || time > 0)) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (isStopwatch) {
            return prev + 1;
          } else {
            if (prev <= 1) {
              clearInterval(intervalRef.current);
              setIsRunning(false);
              return 0;
            }
            return prev - 1;
          }
        });
      }, 1000);
    }
  }, [isRunning, time, isStopwatch]);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setTime(initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  return { time, isRunning, start, pause, resume, reset };
}
