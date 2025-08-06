// app/api/tasks/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { v4 as uuidv4 } from "uuid";

export async function GET(request) {
  const client = await clientPromise;
  const db = client.db("task-manager");
  const date = request.nextUrl.searchParams.get("date");

  // Fetch both exact-date tasks and global scheduled tasks
  const tasks = await db
    .collection("tasks")
    .find({ $or: [{ date }, { date: "global" }] })
    .toArray();

  return NextResponse.json(tasks);
}

export async function POST(request) {
  const client = await clientPromise;
  const db = client.db("task-manager");
  const body = await request.json();

  const { id, title, date } = body;

  if (id) {
    // Update title
    await db.collection("tasks").updateOne({ id }, { $set: { title } });
  } else {
    // Add new task
    await db.collection("tasks").insertOne({
      id: uuidv4(),
      title,
      date: date || "global",
      status: "Scheduled",
    });
  }
 
  return NextResponse.json({ message: "Success" });
}
