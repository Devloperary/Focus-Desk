"use client";

import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Calendar } from "lucide-react";
import { format } from "date-fns";
// Removed Clerk import

const tabs = ["All Tasks", "Pending", "In Progress", "Completed", "Scheduled"];
const statuses = ["Pending", "In Progress", "Completed", "Scheduled"];

export default function Page() {
  // Removed Clerk auth hook
  const [active, setActive] = useState("All Tasks");
  const [input, setInput] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadTasks() {
    // Removed Clerk auth check
    try {
      const res = await fetch("/api/tasks", { credentials: "include" });
      if (!res.ok) {
        const responseClone = res.clone();
        // Try to parse as JSON first
        try {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch tasks");
        } catch (jsonError) {
          // If JSON parsing fails, use text
          const errorText = await responseClone.text();
          throw new Error(errorText || "Failed to fetch tasks");
        }
      }
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error loading tasks", err);
      setError(err.message || "Failed to load tasks. Please try again.");
    }
  }

  async function handleAdd() {
    if (!title.trim()) return;
    
    // Removed Clerk auth check
    
    setIsLoading(true);
    setError(""); // Clear previous errors
    try {
      const payload = editingTaskId 
        ? { id: editingTaskId, title, status: "Pending" }
        : { title };
        
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const responseClone = res.clone();
        // Try to parse as JSON first
        try {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to save task");
        } catch (jsonError) {
          // If JSON parsing fails, use text
          const errorText = await responseClone.text();
          throw new Error(errorText || "Failed to save task");
        }
      }
      setTitle("");
      setEditingTaskId(null);
      loadTasks();
    } catch (err) {
      console.error("Failed to save task", err);
      setError(err.message || "Failed to save task");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEdit(id, taskTitle) {
    setEditingTaskId(id);
    setTitle(taskTitle);
  }

  async function handleDelete(id) {
    // Removed Clerk auth check
    
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/tasks?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!res.ok) {
        const responseClone = res.clone();
        // Try to parse as JSON first
        try {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to delete task");
        } catch (jsonError) {
          // If JSON parsing fails, use text
          const errorText = await responseClone.text();
          throw new Error(errorText || "Failed to delete task");
        }
      }
      loadTasks();
    } catch (err) {
      console.error("Failed to delete task", err);
      setError(err.message || "Failed to delete task");
    } finally {
      setIsLoading(false);
    }
  }
  
  async function handleStatusChange(id, status) {
    // Removed Clerk auth check
    
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, status }),
      });
      
      if (!res.ok) {
        const responseClone = res.clone();
        // Try to parse as JSON first
        try {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to update task status");
        } catch (jsonError) {
          // If JSON parsing fails, use text
          const errorText = await responseClone.text();
          throw new Error(errorText || "Failed to update task status");
        }
      }
      loadTasks();
    } catch (err) {
      console.error("Failed to update task status", err);
      setError(err.message || "Failed to update task status");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Removed Clerk auth dependency
    loadTasks();
  }, []);


  const filteredTasks =
    active === "All Tasks" ? tasks : tasks.filter((t) => t.status === active);

  return (
    <div className="w-full custom-height bg-black text-white px-4 py-4 mt-16">
      {/* Removed Clerk auth conditional rendering */}
      {(
        <>
          {/* Tabs */}
          <div className="bg-gray-900 px-4 py-3 mb-4 rounded-md shadow flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActive(tab)}
                  className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap
                    ${active === tab
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
          <div className="flex flex-col w-full mb-4">
            <div className="flex gap-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a task..."
                className="flex-1 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none"
              />
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                disabled={isLoading}
              >
                <Plus size={18} />
                {isLoading ? "Saving..." : editingTaskId ? "Update" : "Add"}
              </button>
            </div>
            {error && (
              <div className="mt-2 text-red-500 text-sm">
                {error}
              </div>
            )}
          </div>
        </>
      )}

      {/* Task List */}
      {(
        <div className="grid gap-3">
          {filteredTasks.map((task) => (
            <div key={task._id} className="bg-gray-800 p-4 rounded-md shadow">
              {/* Task Title */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(task._id, task.title)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="mt-2 flex gap-4 flex-wrap">
                {statuses.map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`status-${task._id}`}
                      checked={task.status === status}
                      onChange={() => handleStatusChange(task._id, status)}
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
              No tasks in "{active}"
            </p>
          )}
        </div>
      )}
    </div>
  );
}
