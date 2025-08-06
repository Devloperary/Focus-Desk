"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";

export default function YearlyGoals() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");

  // Load goals from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("yearlyGoals")) || [];
    setGoals(saved);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("yearlyGoals", JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    if (!newGoal.trim()) return;
    setGoals([...goals, { text: newGoal, completed: false }]);
    setNewGoal("");
  };

  const toggleComplete = (index) => {
    const updated = [...goals];
    updated[index].completed = !updated[index].completed;
    setGoals(updated);
  };

  const deleteGoal = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const completedCount = goals.filter((g) => g.completed).length;
  const progress = goals.length ? (completedCount / goals.length) * 100 : 0;

  return (
    <div className="w-[500px] bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 text-white">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-4">🎯 Yearly Goals</h2>

      {/* Progress Bar */}
      <div className="w-full bg-gray-800 rounded-full h-3 mb-6">
        <div
          className="h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-gray-300 mb-4 text-sm">
        {completedCount}/{goals.length} completed
      </p>

      {/* Goal Input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          className="flex-1 p-3 rounded-lg text-white focus:outline-none"
          placeholder="Add new goal..."
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
        />
        <button
          onClick={addGoal}
          className="px-4 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Goals List */}
      <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {goals.map((goal, index) => (
          <li
            key={index}
            className={`flex items-center justify-between p-3 rounded-xl transition ${
              goal.completed
                ? "bg-green-700/40 line-through text-gray-300"
                : "bg-gray-700/40"
            }`}
          >
            <span className="flex-1">{goal.text}</span>
            <div className="flex gap-3">
              <button
                onClick={() => toggleComplete(index)}
                className="text-green-400 hover:text-green-500"
              >
                <CheckCircle2 size={20} />
              </button>
              <button
                onClick={() => deleteGoal(index)}
                className="text-red-400 hover:text-red-500"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
