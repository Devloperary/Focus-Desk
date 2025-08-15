import { getDb } from "@/lib/mongo";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const { userId } = await auth(); // ✅ no await here
    if (!userId) {
      return NextResponse.json([], { status: 200 });
    }

    const db = await getDb();
    const tasks = await db
      .collection("scheduled-tasks")
      .find({ userId })
      .sort({ date: 1 })
      .toArray();

    return NextResponse.json(tasks);
  } catch (err) {
    console.error("GET /scheduled-tasks error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth(); // ✅ no await here
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title || !body.date) {
      return NextResponse.json(
        { error: "Title and Date are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const newTask = {
      userId,
      title: body.title,
      date: new Date(body.date),
      createdAt: new Date(),
      status: "pending",
    };

    await db.collection("scheduled-tasks").insertOne(newTask);
    return NextResponse.json(newTask, { status: 201 });
  } catch (err) {
    console.error("POST /scheduled-tasks error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
// Add these new endpoints to your existing file

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection("scheduled-tasks").deleteOne({
      _id: new ObjectId(id),
      userId // Ensure user can only delete their own tasks
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("DELETE /scheduled-tasks error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.id || !body.title || !body.date) {
      return NextResponse.json(
        { error: "ID, Title and Date are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const updatedTask = {
      title: body.title,
      date: new Date(body.date),
      status: body.status || "pending",
      updatedAt: new Date()
    };

    const result = await db.collection("scheduled-tasks").updateOne(
      {
        _id: new ObjectId(body.id),
        userId // Ensure user can only update their own tasks
      },
      { $set: updatedTask }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ ...updatedTask, _id: body.id }, { status: 200 });
  } catch (err) {
    console.error("PUT /scheduled-tasks error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
