import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
// Removed Clerk auth as requested

export async function GET(req) {
  // Removed Clerk auth check

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date"); // YYYY-MM-DD

  const client = await clientPromise;
  const db = client.db("tasksdb");

  const query = {};
  if (date) query.date = date;

  const tasks = await db.collection("tasks").find(query).toArray();
  return Response.json(tasks);
}

export async function POST(req) {
  // Removed Clerk auth check

  const body = await req.json();
  const client = await clientPromise;
  const db = client.db("tasksdb");

  if (body.id) {
    await db.collection("tasks").updateOne(
      { _id: new ObjectId(body.id) },
      { $set: { title: body.title, status: body.status, date: body.date } }
    );
    return Response.json({ message: "Daily task updated" });
  }

  const newTask = {
    title: body.title,
    status: body.status || "Scheduled",
    date: body.date, // store the date
    createdAt: new Date(),
  };

  const result = await db.collection("tasks").insertOne(newTask);
  return Response.json({ _id: result.insertedId, ...newTask });
}

export async function DELETE(req) {
  // Removed Clerk auth check

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return Response.json({ error: "Task ID required" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("tasksdb");

  await db.collection("tasks").deleteOne({ _id: new ObjectId(id) });
  return Response.json({ message: "Daily task deleted" });

}
