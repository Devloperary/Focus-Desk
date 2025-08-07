import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";

// ✅ GET: Fetch tasks
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const status = searchParams.get("status");

    const query = {};
    if (date) query.date = date;
    if (status) query.status = status;

    const tasks = await Task.find(query).sort({ _id: -1 });
    return NextResponse.json(tasks);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// ✅ POST: Add or Update Task
export async function POST(req) {
  try {
    await connectDB();
    const { id, title, status, date } = await req.json();

    if (id) {
      await Task.findByIdAndUpdate(id, { title, status, date });
    } else {
      await Task.create({ title, status, date });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save task" }, { status: 500 });
  }
}

// ✅ DELETE: Remove Task
export async function DELETE(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing task ID" }, { status: 400 });
    }

    await Task.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
