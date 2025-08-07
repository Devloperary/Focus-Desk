"use client";
import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  Plus,
  Trash2,
  Pencil,
} from "lucide-react";
import {
  format,
  addDays,
  startOfWeek,
  isBefore,
  isSameDay,
  addWeeks,
  subWeeks,
} from "date-fns";
import { Calendar } from "@/components/ui/calendar";

export default function WeeklyTaskPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const weekDates = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  const isPastDay = (date) =>
    isBefore(date, new Date()) && !isSameDay(date, new Date());

  const fetchTasks = async () => {
    try {
      const res = await fetch(
        `/api/daily-tasks?date=${selectedDate.toDateString()}`
      );
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch daily tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  const handleAdd = async () => {
    if (!inputText.trim()) return;

    const payload = editingTaskId
      ? { id: editingTaskId, title: inputText, date: selectedDate.toDateString() }
      : { title: inputText, date: selectedDate.toDateString() };

    await fetch("/api/daily-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setInputText("");
    setEditingTaskId(null);
    fetchTasks();
  };

  const handleEdit = (id, title) => {
    setEditingTaskId(id);
    setInputText(title);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/daily-tasks?id=${id}`, { method: "DELETE" });
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 mt-16 sm:px-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Weekly Planner</h1>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex items-center gap-2 text-sm px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
        >
          <CalendarDays className="w-4 h-4" />
          <ChevronDown
            className={`w-4 h-4 transition-transform ${showCalendar ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Calendar Toggle */}
      {showCalendar && (
        <div className="mb-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="bg-gray-900 rounded-xl border border-gray-700"
          />
        </div>
      )}

      {/* Week Selector */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}
          className="p-2 rounded-lg hover:bg-gray-800 disabled:opacity-30"
          disabled={isBefore(currentWeekStart, startOfWeek(new Date(), { weekStartsOn: 0 }))}
        >
          <ChevronLeft />
        </button>

        <div className="flex-1 mx-4">
          <div className="grid grid-cols-7 gap-2 text-center">
            {weekDates.map((date) => (
              <button
                key={date.toDateString()}
                onClick={() => setSelectedDate(date)}
                className={`py-2 px-1 rounded-md flex flex-col items-center transition-all text-sm ${
                  isSameDay(date, selectedDate)
                    ? "bg-blue-600 text-white"
                    : isPastDay(date)
                    ? "text-gray-500"
                    : "hover:bg-gray-800"
                }`}
                disabled={isPastDay(date)}
              >
                <span className="font-medium hidden sm:block">{format(date, "EEE")}</span>
                <span className="text-lg">{format(date, "d")}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
          className="p-2 rounded-lg hover:bg-gray-800"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Task Input & List */}
      <div className="bg-gray-900 p-5 rounded-xl shadow-md border border-gray-700">
        {/* Input */}
        <div className="flex items-center gap-3 mb-4">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Add task for ${format(selectedDate, "EEE, MMM d")}`}
            className="flex-1 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 p-2 rounded-md hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-800 px-4 py-2 rounded-md border border-gray-700 flex justify-between items-center hover:bg-gray-700 transition"
              >
                <span>{task.title}</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(task.id, task.title)}
                    className="text-yellow-400 hover:text-yellow-300"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No tasks for this day.</p>
          )}
        </div>
      </div>
    </div>
  );
}
