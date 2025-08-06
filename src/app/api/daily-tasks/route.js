import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { v4 as uuidv4 } from "uuid";

export async function GET(request) {
  const client = await clientPromise;
  const db = client.db("task-manager");
  const date = request.nextUrl.searchParams.get("date");

  const query = date ? { date } : {};
  const tasks = await db.collection("dailyTasks").find(query).toArray();
  return NextResponse.json(tasks);
}

export async function POST(request) {
  const client = await clientPromise;
  const db = client.db("task-manager");
  const body = await request.json();

  const { id, title, date, status = "Pending" } = body;

  if (id) {
    // Update title/status
    await db
      .collection("dailyTasks")
      .updateOne({ id }, { $set: { title, status } });
  } else {
    // Add new task
    await db.collection("dailyTasks").insertOne({
      id: uuidv4(),
      title,
      status,
      date,
    });
  }

  return NextResponse.json({ message: "Success" });
}
