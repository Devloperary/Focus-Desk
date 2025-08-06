"use client";
import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

const tabs = ["All Tasks", "Pending", "In Progress", "Completed", "Scheduled"];

export default function Page() {
  const [daytasks, setDaytasks] = useState([]);
  const [active, setActive] = useState("All Tasks");
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [date, setDate] = useState(new Date());
  const [editinTaskId, setEditinTaskId] = useState(null);

  const today = new Date().toDateString();

  const dayLoadTasks = async () => {
    try {
      const res = await fetch(`/api/tasks?date=${date.toDateString()}`);
      const data = await res.json();
      setDaytasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const loadTasks = async () => {
    const res = await fetch(`/api/daily-tasks?date=${today}`);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
    dayLoadTasks();
  }, []);

  const handleAdd = async () => {
    if (!input.trim()) return;

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
  };

  const handleEdit = (id, title) => {
    setEditingTaskId(id);
    setInput(title);
  };

  const handlDelete = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    dayLoadTasks();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/daily-tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleStatusChange = async (id, status) => {
    await fetch(`/api/daily-tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const filteredTasks =
    active === "All Tasks" ? tasks : tasks.filter((t) => t.status === active);

  daytasks.forEach((task) => console.log(task.status));

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
          placeholder="Enter a task..."
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

      {/* Task List */}
      <div className="grid gap-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-gray-800 p-4 rounded-md shadow flex justify-between items-center"
          >
            <div className="flex items-start gap-3">
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                className="bg-gray-700 text-white text-sm rounded px-2 py-1 focus:outline-none"
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
              <div>
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-400">{task.status}</p>
              </div>
            </div>
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
        ))}
        {daytasks.map((task) => (
          <div
            key={task.id}
            className="bg-gray-800 p-4 rounded-md shadow flex justify-between items-center"
          >
            <div className="flex items-start gap-3">
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                className="bg-gray-700 text-white text-sm rounded px-2 py-1 focus:outline-none"
              >
                <option>Scheduled</option>
              </select>
              <div>
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-400">{task.status}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlDelete(task.id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {filteredTasks.length === 0 && daytasks.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No tasks in "{active}"
          </p>
        )}
      </div>
    </div>
  );
}
