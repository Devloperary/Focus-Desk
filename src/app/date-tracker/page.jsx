"use client";
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function Page() {
  const [daytasks, setDaytasks] = useState([]);
  const [input, setInput] = useState("");
  const [date, setDate] = useState(new Date());
  const [editingTaskId, setEditingTaskId] = useState(null);

  const loadTasks = async () => {
    try {
      const res = await fetch(`/api/tasks?date=${date.toDateString()}`);
      const data = await res.json();
      setDaytasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [date]);

  const handleAdd = async () => {
    if (!input.trim()) return;

    const payload = editingTaskId
      ? { id: editingTaskId, title: input }
      : { title: input, date: date.toDateString() };

    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setInput("");
    setEditingTaskId(null);
    loadTasks();
  };

  const handleEdit = (id, title) => {
    setEditingTaskId(id);
    setInput(title);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    loadTasks();
  };

  return (
    <div className="custom-height bg-black mt-16 p-4 text-white flex gap-4 flex-col lg:flex-row">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg border border-gray-700 bg-black w-full lg:w-[400px] h-[450px]"
      />

      <div className="bg-[#1c1c1c] flex-1 rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h2 className="text-2xl font-bold text-[#facc15]">Tasks for:</h2>
          <h3 className="text-xl font-semibold text-gray-300">
            {date?.toDateString()}
          </h3>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a task..."
            className="flex-1 px-4 py-2 rounded-md bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#facc15]"
          />
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-[#facc15] hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-md"
          >
            <Plus size={18} />
            {editingTaskId ? "Update" : "Add"}
          </button>
        </div>

        <div className="grid gap-3">
          {daytasks.map((task) => (
            <div
              key={task.id}
              className="bg-[#2a2a2a] p-4 rounded-md shadow flex justify-between items-center hover:bg-[#3a3a3a] transition"
            >
              <h3 className="text-lg font-medium text-white">{task.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(task.id, task.title)}
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {daytasks.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              No tasks for this day.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
