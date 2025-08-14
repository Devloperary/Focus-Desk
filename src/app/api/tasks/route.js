import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
// Removed Clerk auth as requested

export async function GET() {
  // Removed Clerk auth check
  const client = await clientPromise;
  const db = client.db("tasksdb");
  // Get all tasks without filtering by userId
  const tasks = await db.collection("tasks").find({}).toArray();
  return NextResponse.json(tasks);
}

export async function POST(req) {
  // Removed Clerk auth check
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db("tasksdb");

  // Check if we're updating an existing task
  if (body.id) {
    await db.collection("tasks").updateOne(
      { _id: new ObjectId(body.id) },
      { $set: { 
          title: body.title,
          status: body.status || "Pending",
          date: new Date().toDateString()
        }
      }
    );
    return NextResponse.json({ message: "Task updated" });
  }

  // Otherwise create a new task
  const result = await db.collection("tasks").insertOne({
    title: body.title,
    status: body.status || "Pending",
    date: new Date().toDateString(),
    createdAt: new Date(),
  });

  return NextResponse.json({ insertedId: result.insertedId });
}

export async function DELETE(req) {
  // Removed Clerk auth check
  const id = new URL(req.url).searchParams.get("id");
  const client = await clientPromise;
  const db = client.db("tasksdb");

  await db.collection("tasks").deleteOne({
    _id: new ObjectId(id)
  });

  return NextResponse.json({ success: true });
};

// Add a PATCH method to update task status
export async function PATCH(req) {
  // Removed Clerk auth check
  const body = await req.json();
  const { id, status } = body;
  
  if (!id || !status) {
    return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("tasksdb");

  await db.collection("tasks").updateOne(
    { _id: new ObjectId(id) },
    { $set: { status } }
  );

  return NextResponse.json({ success: true });
}
