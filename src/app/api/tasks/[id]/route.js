// app/api/tasks/[id]/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";

export async function DELETE(req, { params }) {
  const client = await clientPromise;
  const db = client.db("task-manager");

  await db.collection("tasks").deleteOne({ id: params.id });
  return NextResponse.json({ message: "Deleted" });
}
