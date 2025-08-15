import { getDb } from "./mongo";

let ensured = false;

export async function ensureIndexes() {
  if (ensured) return;
  const db = await getDb();

  const tasks = db.collection("tasks");
  await tasks.createIndex({ userId: 1, createdAt: -1 });
  await tasks.createIndex({ userId: 1, status: 1 });

  const scheduled = db.collection("scheduledTasks");
  await scheduled.createIndex({ userId: 1, date: 1 });
  await scheduled.createIndex({ userId: 1, status: 1 });

  ensured = true;
}
