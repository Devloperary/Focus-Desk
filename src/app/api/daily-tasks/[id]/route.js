import clientPromise from "@/lib/mongo";

export async function DELETE(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("TaskDB");
    const { id } = params;

    const result = await db.collection("tasks").deleteOne({ id });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Task not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "Task deleted" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
