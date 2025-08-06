"use client";
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";

function Page() {
  const [daytasks, setDaytasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState(new Date());
  const [visibleCount, setVisibleCount] = useState(5);

  const today = new Date().toDateString();
  const formattedDate = date.toDateString();

  const fetchTasks = async () => {
    try {
      const scheduledRes = await fetch(`/api/tasks?date=${formattedDate}`);
      const scheduledData = await scheduledRes.json();

      const dailyRes = await fetch(`/api/daily-tasks?date=${today}`);
      const dailyData = await dailyRes.json();

      setDaytasks(scheduledData);
      setTasks(dailyData);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [date]);

  const allTasks = [...tasks, ...daytasks];
  const displayedTasks = allTasks.slice(0, visibleCount);

  return (
    <div className="mt-18 bg-black custom-height w-full text-white px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col bg-gray-700 p-4 w-full max-w-2xl mx-auto rounded-xl gap-2">
        <div className="text-lg font-semibold">Scheduled Tasks</div>

        <ul className="flex flex-col gap-3">
          {displayedTasks.map((task) => (
            <li
              key={task.id}
              className="bg-gray-800 p-4 rounded-md shadow flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></span>
              <h3 className="text-base sm:text-lg break-words">{task.title}</h3>
            </li>
          ))}
        </ul>

        <div className="flex justify-between items-center mt-3">
          {/* Show More Button */}
          <Link
            href="/task-manager"
            className="flex items-center gap-2 bg-transparent hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm sm:text-base"
          >
            <IoIosArrowDown className="text-lg" />
            <span>Show More</span>
          </Link>

        </div>
      </div>
    </div>
  );
}

export default Page;
