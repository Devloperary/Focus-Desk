"use client";
import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

const tabs = ["All Tasks", "Pending", "In Progress", "Completed", "Scheduled"];
const statuses = ["Pending", "In Progress", "Completed", "Scheduled"];

export default function Page() {
  const [tasks, setTasks] = useState([]);
  const [active, setActive] = useState("All Tasks");
  const [input, setInput] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const today = new Date().toDateString();

  const loadTasks = async () => {
    try {
      const res = await fetch(`/api/daily-tasks?date=${today}`);
      if (!res.ok) throw new Error("Failed to fetch daily tasks");

      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      setTasks(data);
    } catch (err) {
      console.error(err);
      setTasks([]);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAdd = async () => {
    if (!input.trim()) return;

    try {
      const res = await fetch(`/api/daily-tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingTaskId || undefined,
          title: input,
          status: "Pending",
          date: today,
        }),
      });

      if (res.ok) {
        loadTasks();
        setInput("");
        setEditingTaskId(null);
      }
    } catch (err) {
      console.error("Failed to add/update daily task", err);
    }
  };

  const handleEdit = (id, title) => {
    setEditingTaskId(id);
    setInput(title);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/daily-tasks?id=${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Failed to delete daily task", err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await fetch(`/api/daily-tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, date: today }),
      });

      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, status } : task))
      );
    } catch (err) {
      console.error("Failed to update daily task status", err);
    }
  };

  const filteredTasks =
    active === "All Tasks" ? tasks : tasks.filter((t) => t.status === active);

  return (
    <div className="w-full custom-height bg-black text-white px-4 py-4 mt-16">
      {/* Tabs */}
      <div className="bg-gray-900 px-4 py-3 mb-4 rounded-md shadow flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap
                ${
                  active === tab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a daily task..."
          className="flex-1 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none"
        />
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          <Plus size={18} />
          {editingTaskId ? "Update" : "Add"}
        </button>
      </div>

      {/* Daily Task List */}
      <div className="grid gap-3">
        {filteredTasks.map((task) => (
          <div key={task.id} className="bg-gray-800 p-4 rounded-md shadow">
            {/* Task Title */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(task.id, task.title)}
                  className="text-blue-400 hover:text-blue-300"
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

            {/* Status small circular checkboxes */}
            <div className="mt-2 flex gap-4 flex-wrap">
              {statuses.map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`status-${task.id}`}
                    checked={task.status === status}
                    onChange={() => handleStatusChange(task.id, status)}
                    className="w-3 h-3 rounded-full accent-blue-600"
                  />
                  {status}
                </label>
              ))}
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No daily tasks in "{active}"
          </p>
        )}
      </div>
    </div>
  );
}
