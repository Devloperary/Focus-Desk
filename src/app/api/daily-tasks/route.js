import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { v4 as uuidv4 } from "uuid";

/* ✅ GET Daily Tasks */
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("task-manager");
    const date = request.nextUrl.searchParams.get("date");

    const query = date ? { date } : {};
    const tasks = await db.collection("dailyTasks").find(query).toArray();

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ✅ POST (Add or Update) Daily Task */
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("task-manager");
    const body = await request.json();

    const { id, title, date, status = "Scheduled" } = body;

    if (id) {
      await db.collection("dailyTasks").updateOne(
        { id },
        { $set: { title, status } }
      );
    } else {
      await db.collection("dailyTasks").insertOne({
        id: uuidv4(),
        title,
        status,
        date,
      });
    }

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ✅ DELETE Daily Task */
export async function DELETE(request) {
  try {
    const client = await clientPromise;
    const db = client.db("task-manager");
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const result = await db.collection("dailyTasks").deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Daily task deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
