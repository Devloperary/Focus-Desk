"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Save } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@clerk/nextjs";
import { ChevronDownIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function ScheduledTasksPage() {
  const { getToken } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false)// JS version (no type params)





  async function fetchTasks() {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await fetch(`/api/scheduled-tasks?date=${selectedDate.toISOString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Fetch tasks error:", err);
      setError(err.message);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  const handleAddTask = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const payload = {
        title: inputText,
        date: selectedDate.toISOString(),
      };

      const response = await fetch("/api/scheduled-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      setInputText("");
      await fetchTasks();
    } catch (err) {
      console.error("Add task error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async () => {
    if (!inputText.trim() || !editingTaskId) return;

    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const payload = {
        id: editingTaskId,
        title: inputText,
        date: selectedDate.toISOString(),
      };

      const response = await fetch("/api/scheduled-tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      setInputText("");
      setEditingTaskId(null);
      await fetchTasks();
    } catch (err) {
      console.error("Update task error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch(`/api/scheduled-tasks?id=${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      await fetchTasks();
    } catch (err) {
      console.error("Delete task error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task._id);
    setInputText(task.title);
    setSelectedDate(new Date(task.date));
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setInputText("");
  };

  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.date);
    return (
      taskDate.getDate() === selectedDate.getDate() &&
      taskDate.getMonth() === selectedDate.getMonth() &&
      taskDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 mt-16 sm:px-8 sm:py-12 w-full">
      <div className="w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            Scheduled Tasks - {format(selectedDate, "EEE, MMM d, yyyy")}
          </h1>
          <div className="flex flex-col gap-3 invert-100 text-white">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-48 justify-between font-normal text-white border-neutral-700 hover:bg-neutral-800 hover:border-neutral-600 "
                >
                  {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                  <ChevronDownIcon className="text-white" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-auto overflow-hidden p-0 bg-neutral-900 text-white border border-neutral-700"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  captionLayout="dropdown"
                  onSelect={(newDate) => {
                    if (newDate) {
                      setSelectedDate(newDate);
                    }
                    setOpen(false);
                  }}
                  className="[&_.rdp-day]:text-white [&_.rdp-day_selected]:bg-blue-600 [&_.rdp-day_selected]:text-white"
                />
              </PopoverContent>
            </Popover>

          </div>
        </div>

        <div className="bg-gray-900 p-5 rounded-xl shadow-md border border-gray-700 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`${editingTaskId ? "Edit" : "Add"} task for ${format(selectedDate, "EEE, MMM d")}`}
              className="flex-1 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editingTaskId ? handleUpdateTask() : handleAddTask();
                }
              }}
            />
            {editingTaskId ? (
              <>
                <button
                  onClick={handleUpdateTask}
                  disabled={isLoading}
                  className="bg-green-600 p-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  className="bg-gray-600 p-2 rounded-md hover:bg-gray-700 transition disabled:opacity-50"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleAddTask}
                disabled={isLoading || !inputText.trim()}
                className="bg-blue-600 p-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-900 text-red-100 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {isLoading && !tasks.length ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-gray-800 px-4 py-3 rounded-md border border-gray-700 flex justify-between items-center hover:bg-gray-700 transition group"
                >
                  <span className={task.status === "completed" ? "line-through text-gray-400" : ""}>
                    {task.title}
                  </span>
                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditTask(task)}
                      disabled={isLoading}
                      className="text-yellow-400 hover:text-yellow-300 disabled:opacity-50"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      disabled={isLoading}
                      className="text-red-400 hover:text-red-300 disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                {isLoading ? "Loading..." : "No tasks for this day."}
              </p>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-500 text-center">
          {tasks.length > 0 && (
            <p>
              Showing {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} for selected date
            </p>
          )}
        </div>
      </div>
    </div>
  );
}