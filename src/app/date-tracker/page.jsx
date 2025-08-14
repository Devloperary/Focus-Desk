"use client";
import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { format, isSameDay } from "date-fns";
// Removed Clerk auth imports if any were present

export default function DailyTasksPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch(
        `/api/daily-tasks?date=${selectedDate.toDateString()}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  const handleAdd = async () => {
    if (!inputText.trim()) return;

    const payload = editingTaskId
      ? {
          id: editingTaskId,
          title: inputText,
          status: "Pending",
          date: selectedDate.toDateString(),
        }
      : {
          title: inputText,
          status: "Pending",
          date: selectedDate.toDateString(),
        };

    await fetch("/api/daily-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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
    await fetch(`/api/daily-tasks?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 mt-16 sm:px-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Daily Tasks - {format(selectedDate, "EEE, MMM d")}
        </h1>
        <input
          type="date"
          value={format(selectedDate, "yyyy-MM-dd")}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="bg-gray-800 text-white px-3 py-1 rounded-md border border-gray-700"
        />
      </div>

      {/* Task Input */}
      <div className="bg-gray-900 p-5 rounded-xl shadow-md border border-gray-700 mb-4">
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
                key={task._id}
                className="bg-gray-800 px-4 py-2 rounded-md border border-gray-700 flex justify-between items-center hover:bg-gray-700 transition"
              >
                <span>{task.title}</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(task._id, task.title)}
                    className="text-yellow-400 hover:text-yellow-300"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
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
