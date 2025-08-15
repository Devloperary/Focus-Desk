import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongo";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getAuth(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = await getDb();
    const tasks = await db
      .collection("daily-tasks")
      .find({ userId })
      .toArray();

    return NextResponse.json(tasks);
  } catch (err: unknown) {
    console.error("GET tasks error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const db = await getDb();

    if (body.id) {
      // Update existing task title
      await db.collection("daily-tasks").updateOne(
        { _id: new ObjectId(body.id), userId },
        { $set: { title: body.title } }
      );
      return NextResponse.json({ success: true });
    } else {
      // Add new task
      const newTask = {
        title: body.title,
        status: "Pending",
        userId,
        createdAt: new Date(),
      };
      await db.collection("daily-tasks").insertOne(newTask);
      return NextResponse.json({ success: true });
    }
  } catch (err: unknown) {
    console.error("POST task error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || "Failed to add task" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const db = await getDb();

    await db.collection("daily-tasks").updateOne(
      { _id: new ObjectId(body.id), userId },
      { $set: { status: body.status } }
    );
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("PATCH task error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || "Failed to update status" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Task ID missing" }, { status: 400 });

    const db = await getDb();
    await db.collection("daily-tasks").deleteOne({ _id: new ObjectId(id), userId });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("DELETE task error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || "Failed to delete task" }, { status: 500 });
  }
}
